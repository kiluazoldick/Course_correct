import { Express } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { storage } from './storage';
import { User } from '@shared/schema';

// Configure session middleware
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

// Password hashing utility
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Setup authentication strategies
export function setupAuth(app: Express) {
  app.set('trust proxy', 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy (Email/Password)
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          
          if (!user) {
            return done(null, false, { message: 'Email ou mot de passe incorrect' });
          }

          if (!user.password) {
            return done(null, false, { message: 'Veuillez vous connecter avec Google' });
          }

          const isValid = await comparePassword(password, user.password);
          
          if (!isValid) {
            return done(null, false, { message: 'Email ou mot de passe incorrect' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const domain = process.env.CUSTOM_DOMAIN || process.env.REPLIT_DOMAINS?.split(',')[0];
    const callbackURL = process.env.NODE_ENV === 'production'
      ? `https://${domain}/api/auth/google/callback`
      : 'http://localhost:5000/api/auth/google/callback';

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists with this Google ID
            let user = await storage.getUserByGoogleId(profile.id);

            if (!user) {
              // Check if user exists with this email
              const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
              
              if (existingUser) {
                // Link Google account to existing user
                user = await storage.linkGoogleAccount(existingUser.id, profile.id);
              } else {
                // Create new user
                const email = profile.emails?.[0]?.value || '';
                const firstName = profile.name?.givenName || 'Utilisateur';
                const lastName = profile.name?.familyName || 'Google';
                
                user = await storage.createGoogleUser({
                  email,
                  googleId: profile.id,
                  firstName,
                  lastName,
                  profileImageUrl: profile.photos?.[0]?.value,
                });

                // Add user to Resend contacts and send welcome email (non-blocking)
                try {
                  const { addContactToResend, sendWelcomeEmail } = await import('./email');
                  // Add to Resend contacts
                  addContactToResend(email, firstName, lastName, false).catch(err => {
                    console.error('Failed to add Google contact to Resend:', err);
                  });
                  // Send welcome email
                  sendWelcomeEmail(email, firstName, 'fr', 'yes').catch(err => {
                    console.error('Failed to send welcome email to Google user:', err);
                  });
                } catch (emailError) {
                  console.error('Email service error for Google user:', emailError);
                }
              }
            }

            return done(null, user);
          } catch (error) {
            return done(error as Error);
          }
        }
      )
    );
  }

  // Serialize/Deserialize user
  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  
  // Local login
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err: Error, user: User, info: { message: string }) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      
      if (!user) {
        return res.status(401).json({ error: info.message || 'Authentification échouée' });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur de connexion' });
        }
        return res.json({ user });
      });
    })(req, res, next);
  });

  // Local registration
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await storage.createLocalUser({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      // Add user to Resend contacts and send welcome email (non-blocking)
      try {
        const { addContactToResend, sendWelcomeEmail } = await import('./email');
        // Add to Resend contacts
        addContactToResend(email, firstName, lastName, false).catch(err => {
          console.error('Failed to add contact to Resend (non-blocking):', err);
        });
        // Send welcome email
        sendWelcomeEmail(email, firstName, 'fr', 'yes').catch(err => {
          console.error('Failed to send welcome email (non-blocking):', err);
        });
      } catch (emailError) {
        console.error('Email service error (non-blocking):', emailError);
      }

      // Auto-login after registration
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur de connexion' });
        }
        return res.json({ user });
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  });

  // Google OAuth routes
  app.get(
    '/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  // Get current user
  app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Non authentifié' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
      }
      res.json({ success: true });
    });
  });
}

// Middleware to protect routes
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Non authentifié' });
}
