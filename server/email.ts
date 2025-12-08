// Email Service using Resend Integration
// Connected via Replit Resend Connector

import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  // First try to use the RESEND_API_KEY secret directly
  if (process.env.RESEND_API_KEY) {
    return {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: 'noreply@corrigetescours.com'
    };
  }

  // Fallback to Replit connector
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { 
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email || 'noreply@corrigetescours.com'
  };
}

async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

// Email Templates
const emailTemplates = {
  // Welcome email when user signs up
  welcome: {
    fr: {
      subject: 'Bienvenue sur Corrige Tes Cours !',
      html: (firstName: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; margin-top: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">Corrige Tes Cours</h1>
      <p style="color: #666; font-size: 14px; margin-top: 5px;">Ta plateforme d'apprentissage intelligente</p>
    </div>
    
    <h2 style="color: #1a1a1a; font-size: 22px;">Salut ${firstName} !</h2>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Bienvenue sur <strong>Corrige Tes Cours</strong> ! Tu as fait le premier pas vers une meilleure façon d'étudier.
    </p>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Voici ce que tu peux faire maintenant :
    </p>
    
    <ul style="color: #333; font-size: 16px; line-height: 1.8; padding-left: 20px;">
      <li><strong>Upload tes cours</strong> - PDF, Word, ou copie-colle directement</li>
      <li><strong>Génère des résumés IA</strong> - Comprends l'essentiel en quelques secondes</li>
      <li><strong>Teste-toi avec des quiz</strong> - Questions personnalisées basées sur ton cours</li>
      <li><strong>Discute avec Tariq IA</strong> - Ton assistant personnel pour réviser</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://corrigetescours.com/dashboard" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Commencer maintenant
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
      On est là pour t'aider à réussir. Bonne chance dans tes études !
    </p>
    
    <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        Corrige Tes Cours - L'IA au service de ta réussite
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 5px;">
        <a href="https://corrigetescours.com/unsubscribe" style="color: #999;">Se désabonner</a>
      </p>
    </div>
  </div>
</body>
</html>`
    },
    en: {
      subject: 'Welcome to Corrige Tes Cours!',
      html: (firstName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; margin-top: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">Corrige Tes Cours</h1>
      <p style="color: #666; font-size: 14px; margin-top: 5px;">Your AI-powered learning platform</p>
    </div>
    
    <h2 style="color: #1a1a1a; font-size: 22px;">Hi ${firstName}!</h2>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Welcome to <strong>Corrige Tes Cours</strong>! You've taken the first step towards smarter studying.
    </p>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Here's what you can do now:
    </p>
    
    <ul style="color: #333; font-size: 16px; line-height: 1.8; padding-left: 20px;">
      <li><strong>Upload your courses</strong> - PDF, Word, or paste directly</li>
      <li><strong>Generate AI summaries</strong> - Understand the key points in seconds</li>
      <li><strong>Test yourself with quizzes</strong> - Personalized questions based on your course</li>
      <li><strong>Chat with Tariq AI</strong> - Your personal assistant for studying</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://corrigetescours.com/dashboard" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Get Started Now
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
      We're here to help you succeed. Good luck with your studies!
    </p>
    
    <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        Corrige Tes Cours - AI for your success
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 5px;">
        <a href="https://corrigetescours.com/unsubscribe" style="color: #999;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`
    }
  },

  // Weekly motivation email - "Bon début de semaine"
  weeklyMotivation: {
    fr: {
      subject: 'Bonne semaine ! Tes objectifs t\'attendent',
      html: (firstName: string, stats: { coursesCount: number; quizzesCount: number; avgScore: number }) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; margin-top: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">Corrige Tes Cours</h1>
    </div>
    
    <h2 style="color: #1a1a1a; font-size: 24px; text-align: center;">Bonne semaine, ${firstName} !</h2>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">
      C'est lundi, le moment parfait pour donner le meilleur de toi-même !
    </p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; margin: 25px 0; color: white;">
      <h3 style="margin: 0 0 15px 0; font-size: 18px;">Tes stats de la semaine dernière</h3>
      <div style="display: flex; justify-content: space-around; text-align: center;">
        <div>
          <p style="font-size: 28px; font-weight: bold; margin: 0;">${stats.coursesCount}</p>
          <p style="font-size: 12px; margin: 5px 0 0 0; opacity: 0.9;">Cours actifs</p>
        </div>
        <div>
          <p style="font-size: 28px; font-weight: bold; margin: 0;">${stats.quizzesCount}</p>
          <p style="font-size: 12px; margin: 5px 0 0 0; opacity: 0.9;">Quiz passés</p>
        </div>
        <div>
          <p style="font-size: 28px; font-weight: bold; margin: 0;">${stats.avgScore}%</p>
          <p style="font-size: 12px; margin: 5px 0 0 0; opacity: 0.9;">Score moyen</p>
        </div>
      </div>
    </div>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      <strong>Conseil de la semaine :</strong> Commence par revoir tes cours les plus difficiles quand ton énergie est au maximum, c'est-à-dire maintenant !
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://corrigetescours.com/dashboard/courses" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Continuer à apprendre
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center; font-style: italic;">
      "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès."
    </p>
    
    <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        Corrige Tes Cours - L'IA au service de ta réussite
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 5px;">
        <a href="https://corrigetescours.com/unsubscribe" style="color: #999;">Se désabonner</a>
      </p>
    </div>
  </div>
</body>
</html>`
    },
    en: {
      subject: 'Happy Monday! Your goals are waiting',
      html: (firstName: string, stats: { coursesCount: number; quizzesCount: number; avgScore: number }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; margin-top: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">Corrige Tes Cours</h1>
    </div>
    
    <h2 style="color: #1a1a1a; font-size: 24px; text-align: center;">Happy Monday, ${firstName}!</h2>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">
      It's Monday - the perfect time to give your best!
    </p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; margin: 25px 0; color: white;">
      <h3 style="margin: 0 0 15px 0; font-size: 18px;">Your stats from last week</h3>
      <div style="display: flex; justify-content: space-around; text-align: center;">
        <div>
          <p style="font-size: 28px; font-weight: bold; margin: 0;">${stats.coursesCount}</p>
          <p style="font-size: 12px; margin: 5px 0 0 0; opacity: 0.9;">Active courses</p>
        </div>
        <div>
          <p style="font-size: 28px; font-weight: bold; margin: 0;">${stats.quizzesCount}</p>
          <p style="font-size: 12px; margin: 5px 0 0 0; opacity: 0.9;">Quizzes taken</p>
        </div>
        <div>
          <p style="font-size: 28px; font-weight: bold; margin: 0;">${stats.avgScore}%</p>
          <p style="font-size: 12px; margin: 5px 0 0 0; opacity: 0.9;">Average score</p>
        </div>
      </div>
    </div>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      <strong>Tip of the week:</strong> Start by reviewing your most challenging courses when your energy is at its peak - that's now!
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://corrigetescours.com/dashboard/courses" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Keep Learning
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; line-height: 1.6; text-align: center; font-style: italic;">
      "Success is not the key to happiness. Happiness is the key to success."
    </p>
    
    <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        Corrige Tes Cours - AI for your success
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 5px;">
        <a href="https://corrigetescours.com/unsubscribe" style="color: #999;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`
    }
  }
};

export type EmailType = keyof typeof emailTemplates;
export type Language = 'fr' | 'en';

// Send welcome email (respects email marketing preferences)
export async function sendWelcomeEmail(
  to: string, 
  firstName: string, 
  language: Language = 'fr',
  emailMarketing: string = 'yes' // Pass user's email preference
): Promise<{ success: boolean; messageId?: string; error?: string; skipped?: boolean }> {
  // Skip if user opted out of marketing emails
  if (emailMarketing === 'no') {
    console.log('Skipping welcome email - user opted out:', to);
    return { success: true, skipped: true };
  }

  try {
    const { client, fromEmail } = await getResendClient();
    const template = emailTemplates.welcome[language];
    
    const { data, error } = await client.emails.send({
      from: `Corrige Tes Cours <${fromEmail}>`,
      to: [to],
      subject: template.subject,
      html: template.html(firstName),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Welcome email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Send weekly motivation email
export async function sendWeeklyMotivationEmail(
  to: string, 
  firstName: string, 
  stats: { coursesCount: number; quizzesCount: number; avgScore: number },
  language: Language = 'fr'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    const template = emailTemplates.weeklyMotivation[language];
    
    const { data, error } = await client.emails.send({
      from: `Corrige Tes Cours <${fromEmail}>`,
      to: [to],
      subject: template.subject,
      html: template.html(firstName, stats),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Weekly motivation email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send weekly email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Send bulk weekly emails to all users
export async function sendBulkWeeklyEmails(
  users: Array<{ 
    email: string; 
    firstName: string; 
    language: Language;
    stats: { coursesCount: number; quizzesCount: number; avgScore: number };
  }>
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const results = { sent: 0, failed: 0, errors: [] as string[] };
  
  // Send in batches to avoid rate limits
  for (const user of users) {
    try {
      const result = await sendWeeklyMotivationEmail(
        user.email, 
        user.firstName, 
        user.stats, 
        user.language
      );
      
      if (result.success) {
        results.sent++;
      } else {
        results.failed++;
        results.errors.push(`${user.email}: ${result.error}`);
      }
      
      // Small delay between emails to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.failed++;
      results.errors.push(`${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return results;
}

// ==================== RESEND CONTACTS MANAGEMENT ====================
// These functions sync users to Resend's contact list for marketing emails
// You can then send marketing emails directly from Resend's dashboard

// Get the Resend Audience ID from environment (returns null if not configured)
function getAudienceId(): string | null {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.warn('RESEND_AUDIENCE_ID not configured - contact sync disabled');
    return null;
  }
  return audienceId;
}

// Add a contact to Resend (for marketing emails from Resend dashboard)
export async function addContactToResend(
  email: string,
  firstName: string,
  lastName?: string,
  unsubscribed: boolean = false
): Promise<{ success: boolean; contactId?: string; error?: string; skipped?: boolean }> {
  try {
    const audienceId = getAudienceId();
    if (!audienceId) {
      return { success: true, skipped: true }; // Gracefully skip if not configured
    }
    
    const { client } = await getResendClient();
    
    const { data, error } = await client.contacts.create({
      audienceId,
      email,
      firstName,
      lastName: lastName || '',
      unsubscribed,
    });

    if (error) {
      console.error('Resend contact create error:', error);
      return { success: false, error: error.message };
    }

    console.log('Contact added to Resend:', data?.id, email);
    return { success: true, contactId: data?.id };
  } catch (error) {
    console.error('Failed to add contact to Resend:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Update a contact's subscription status in Resend
export async function updateResendContact(
  email: string,
  unsubscribed: boolean
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  try {
    const audienceId = getAudienceId();
    if (!audienceId) {
      return { success: true, skipped: true }; // Gracefully skip if not configured
    }
    
    const { client } = await getResendClient();
    
    // Use email-based update (SDK 6.5+ supports this)
    const { error } = await client.contacts.update({
      audienceId,
      email,
      unsubscribed,
    });

    if (error) {
      // If contact not found, that's ok - skip gracefully
      if (error.message?.includes('not found')) {
        console.log('Contact not found in Resend for update:', email);
        return { success: true };
      }
      console.error('Resend contact update error:', error);
      return { success: false, error: error.message };
    }

    console.log('Contact updated in Resend:', email, 'unsubscribed:', unsubscribed);
    return { success: true };
  } catch (error) {
    console.error('Failed to update Resend contact:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Remove a contact from Resend
export async function removeContactFromResend(
  email: string
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  try {
    const audienceId = getAudienceId();
    if (!audienceId) {
      return { success: true, skipped: true }; // Gracefully skip if not configured
    }
    
    const { client } = await getResendClient();
    
    // Use email-based remove (SDK 6.5+ supports this)
    const { error } = await client.contacts.remove({ 
      audienceId, 
      email 
    });

    if (error) {
      // If contact not found, that's ok - already removed
      if (error.message?.includes('not found')) {
        console.log('Contact not found in Resend:', email);
        return { success: true };
      }
      console.error('Resend contact remove error:', error);
      return { success: false, error: error.message };
    }

    console.log('Contact removed from Resend:', email);
    return { success: true };
  } catch (error) {
    console.error('Failed to remove Resend contact:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Sync all opted-in users to Resend (for initial setup or periodic sync)
export async function syncAllUsersToResend(
  users: Array<{ email: string; firstName: string; lastName?: string; emailMarketing: string }>
): Promise<{ added: number; updated: number; skipped: number; errors: string[] }> {
  const results = { added: 0, updated: 0, skipped: 0, errors: [] as string[] };
  
  // Check if audienceId is configured
  const audienceId = getAudienceId();
  if (!audienceId) {
    return { added: 0, updated: 0, skipped: users.length, errors: ['RESEND_AUDIENCE_ID not configured'] };
  }
  
  for (const user of users) {
    try {
      // Skip users who opted out
      if (user.emailMarketing === 'no') {
        // Update as unsubscribed if they exist in Resend
        await updateResendContact(user.email, true);
        results.skipped++;
        continue;
      }
      
      // Try to add the contact
      const result = await addContactToResend(
        user.email,
        user.firstName,
        user.lastName,
        false // subscribed
      );
      
      if (result.success && !result.skipped) {
        results.added++;
      } else if (result.error?.includes('already exists') || result.error?.includes('Contact already')) {
        // Contact exists, update subscription status
        await updateResendContact(user.email, false);
        results.updated++;
      } else if (result.skipped) {
        results.skipped++;
      } else {
        results.errors.push(`${user.email}: ${result.error}`);
      }
      
      // Rate limit handling: delay between requests
      await new Promise(resolve => setTimeout(resolve, 600));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`${user.email}: ${errorMsg}`);
      
      // If rate limited, wait longer before continuing
      if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
        console.log('Rate limited - waiting 5 seconds before continuing...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  
  console.log(`Resend sync complete: added=${results.added}, updated=${results.updated}, skipped=${results.skipped}, errors=${results.errors.length}`);
  return results;
}
