import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertCourseSchema, insertQuizSchema, insertQuizResultSchema, insertSummarySchema, updateUserProfileSchema, type Payment, payments } from "@shared/schema";
import { generateCourseSummary, generateQuiz, evaluateOpenAnswer, chatWithAI } from "./ai";
import multer from "multer";
import { processUploadedFile } from "./fileProcessor";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";
import { lygosService } from "./lygos";
import { sendWelcomeEmail, sendWeeklyMotivationEmail, sendBulkWeeklyEmails, sendPremiumCongratsEmail, sendReminderEmail } from "./email";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Configure multer for file uploads (10MB limit)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Type de fichier non supporté. Utilise PDF ou Word (.docx)'));
      }
    },
  });

  // Note: Auth routes are now handled in auth.ts

  // Courses routes
  app.get('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const courses = await storage.getCoursesByUserId(userId);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const validated = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse({
        ...validated,
        userId,
      });
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid course data", errors: error });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.patch('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const validated = insertCourseSchema.partial().parse(req.body);
      const updated = await storage.updateCourse(req.params.id, validated);
      res.json(updated);
    } catch (error) {
      console.error("Error updating course:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid course data", errors: error });
      }
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      await storage.deleteCourse(req.params.id);
      res.json({ message: "Course deleted" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Anonymous onboarding routes (test before signup)
  app.post('/api/anonymous/upload', upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier n'a été uploadé" });
      }

      const sessionId = req.body.sessionId;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID requis" });
      }

      // Check if session already has an upload (limit: 1 upload per anonymous session)
      const existing = await storage.getAnonymousUploadBySessionId(sessionId);
      if (existing) {
        return res.status(400).json({ 
          message: "Vous avez déjà testé l'application. Créez un compte gratuit pour continuer !",
          existingUploadId: existing.id
        });
      }

      // Process the uploaded file
      const { text, title } = await processUploadedFile(req.file.buffer, req.file.mimetype);

      // Create anonymous upload with 48h expiration
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      const upload = await storage.createAnonymousUpload({
        sessionId,
        title: title || req.file.originalname,
        content: text,
        summary: null,
        expiresAt,
      });

      res.json({ 
        uploadId: upload.id,
        title: upload.title,
        content: upload.content
      });
    } catch (error) {
      console.error("Error creating anonymous upload:", error);
      res.status(500).json({ message: "Échec de l'upload du fichier" });
    }
  });

  app.post('/api/anonymous/:uploadId/summarize', async (req: any, res) => {
    try {
      const { uploadId } = req.params;
      const { language = 'fr' } = req.body;
      const upload = await storage.getAnonymousUpload(uploadId);
      
      if (!upload) {
        return res.status(404).json({ message: "Upload introuvable" });
      }

      // Generate AI summary in selected language (anonymous users get free tier limits)
      const result = await generateCourseSummary(upload.content, upload.title, language, false);

      // Update the upload with the summary
      await storage.updateAnonymousUpload(uploadId, { summary: result.summary });

      res.json({ 
        summary: result.summary,
        wasTruncated: result.wasTruncated,
        message: result.wasTruncated 
          ? (language === 'fr' 
              ? `Le document était très long. Le résumé couvre les premières parties. Créez un compte Premium pour traiter des documents plus longs.`
              : `The document was very long. The summary covers the first portions. Create a Premium account to process longer documents.`)
          : undefined
      });
    } catch (error) {
      console.error("Error generating anonymous summary:", error);
      const errorMessage = error instanceof Error ? error.message : 'Échec de la génération du résumé';
      res.status(500).json({ message: errorMessage });
    }
  });

  app.get('/api/anonymous/:uploadId', async (req: any, res) => {
    try {
      const { uploadId } = req.params;
      const upload = await storage.getAnonymousUpload(uploadId);
      
      if (!upload) {
        return res.status(404).json({ message: "Upload introuvable" });
      }

      res.json(upload);
    } catch (error) {
      console.error("Error fetching anonymous upload:", error);
      res.status(500).json({ message: "Échec de la récupération de l'upload" });
    }
  });

  app.post('/api/anonymous/:uploadId/migrate', isAuthenticated, async (req: any, res) => {
    try {
      const { uploadId } = req.params;
      const userId = (req.user as any).id;

      const course = await storage.migrateAnonymousUploadToUser(uploadId, userId);

      res.json({ 
        message: "Cours migré avec succès!",
        course
      });
    } catch (error) {
      console.error("Error migrating anonymous upload:", error);
      res.status(500).json({ message: "Échec de la migration du cours" });
    }
  });

  // File upload route
  app.post('/api/courses/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier n'a été uploadé" });
      }

      const userId = (req.user as any).id;

      // Check subscription status
      const subscription = await storage.getSubscriptionByUserId(userId);
      const isPremium = subscription?.status === 'premium' && 
                        subscription?.endDate && 
                        new Date(subscription.endDate) > new Date();

      // If not premium, check upload limit (2 files per month)
      if (!isPremium) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const uploads = await storage.getUploadCountThisMonth(userId, startOfMonth);

        if (uploads >= 2) {
          return res.status(403).json({ 
            message: "Limite d'upload atteinte",
            limitExceeded: true,
            limit: 2,
            description: "Tu as atteint ta limite de 2 fichiers par mois. Passe au Premium pour des uploads illimités !"
          });
        }
      }

      const { text, title } = await processUploadedFile(req.file.buffer, req.file.mimetype);

      if (!text || text.length < 50) {
        return res.status(400).json({ 
          message: "Le fichier ne contient pas assez de texte exploitable" 
        });
      }

      // Create course from extracted text with isUpload flag
      const course = await storage.createCourse({
        userId,
        title: title,
        content: text,
        subject: req.body.subject || '',
        isUpload: 1, // Mark as uploaded file
      });

      res.json(course);
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error instanceof Error) {
        if (error.message.includes('File too large')) {
          return res.status(413).json({ message: "Le fichier est trop volumineux (max 10 MB)" });
        }
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Erreur lors de l'upload du fichier" });
    }
  });

  // User profile routes
  app.get('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get subscription information
      const subscription = await storage.getSubscriptionByUserId(userId);
      const isPremium = subscription?.status === 'premium' && 
                        subscription?.endDate && 
                        new Date(subscription.endDate) > new Date();

      // Return user info without password
      const { password, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        plan: isPremium ? 'premium' : 'free',
        subscription: subscription || null
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const validated = updateUserProfileSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, validated);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid profile data", errors: error });
      }
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Update user language preference
  app.put('/api/user/language', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const { language } = req.body;
      
      if (!language || !['fr', 'en'].includes(language)) {
        return res.status(400).json({ message: "Invalid language. Must be 'fr' or 'en'" });
      }
      
      const updatedUser = await storage.updateUser(userId, { language });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ language: updatedUser.language });
    } catch (error) {
      console.error("Error updating user language:", error);
      res.status(500).json({ message: "Failed to update language" });
    }
  });

  // Configure multer for profile image uploads (2MB limit)
  const profileUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2 MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Type de fichier non supporté. Utilise JPG, PNG ou WebP'));
      }
    },
  });

  app.post('/api/user/profile/photo', isAuthenticated, profileUpload.single('photo'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucune photo n'a été uploadée" });
      }

      const userId = (req.user as any).id;
      
      // Convert image to base64 data URL
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      
      const updatedUser = await storage.updateUser(userId, {
        profileImageUrl: base64Image
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ profileImageUrl: updatedUser.profileImageUrl });
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      if (error instanceof Error) {
        if (error.message.includes('File too large')) {
          return res.status(413).json({ message: "La photo est trop volumineuse (max 2 MB)" });
        }
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Erreur lors de l'upload de la photo" });
    }
  });

  // Quiz routes
  app.get('/api/quizzes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const quizzes = await storage.getQuizzesByUserId(userId);
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.get('/api/quizzes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      if (quiz.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  app.post('/api/quizzes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const validated = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz({
        ...validated,
        userId,
      });
      res.json(quiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid quiz data", errors: error });
      }
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  app.delete('/api/quizzes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      if (quiz.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      await storage.deleteQuiz(req.params.id);
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  });

  // Quiz results routes
  app.get('/api/quiz-results', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const results = await storage.getQuizResultsByUserId(userId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  app.post('/api/quiz-results', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const validated = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult({
        ...validated,
        userId,
      });
      res.json(result);
    } catch (error) {
      console.error("Error creating quiz result:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid quiz result data", errors: error });
      }
      res.status(500).json({ message: "Failed to create quiz result" });
    }
  });

  // Summaries routes
  app.get('/api/summaries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const summaries = await storage.getSummariesByUserId(userId);
      res.json(summaries);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      res.status(500).json({ message: "Failed to fetch summaries" });
    }
  });

  app.post('/api/summaries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const validated = insertSummarySchema.parse(req.body);
      const summary = await storage.createSummary({
        ...validated,
        userId,
      });
      res.json(summary);
    } catch (error) {
      console.error("Error creating summary:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid summary data", errors: error });
      }
      res.status(500).json({ message: "Failed to create summary" });
    }
  });

  // AI-powered summary generation
  app.post('/api/courses/:id/generate-summary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const course = await storage.getCourse(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!course) {
        const msg = user?.language === 'en' ? "Course not found" : "Cours introuvable";
        return res.status(404).json({ message: msg });
      }
      
      if (course.userId !== userId) {
        const msg = user?.language === 'en' ? "Access denied" : "Accès refusé";
        return res.status(403).json({ message: msg });
      }

      // Use user's language preference for AI generation
      const language = (user?.language || 'fr') as 'fr' | 'en';
      
      // Check if user is premium to apply appropriate limits
      const subscription = await storage.getSubscriptionByUserId(userId);
      const isPremium = subscription?.status === 'premium' && 
                        (!subscription.endDate || new Date(subscription.endDate) > new Date());
      
      const result = await generateCourseSummary(course.content, course.title, language, isPremium);
      
      const summary = await storage.createSummary({
        courseId: course.id,
        userId,
        content: result.summary,
      });

      // Include truncation info in response for user feedback
      res.json({
        ...summary,
        wasTruncated: result.wasTruncated,
        originalLength: result.originalLength,
        message: result.wasTruncated 
          ? (language === 'fr' 
              ? `Le document était très long (${Math.round(result.originalLength / 1000)}k caractères). Le résumé couvre les premières parties.${!isPremium ? ' Passez en Premium pour traiter des documents plus longs.' : ''}`
              : `The document was very long (${Math.round(result.originalLength / 1000)}k characters). The summary covers the first portions.${!isPremium ? ' Upgrade to Premium to process longer documents.' : ''}`)
          : undefined
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      // Return the user-friendly error message directly
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
      res.status(500).json({ message: errorMessage });
    }
  });

  // AI-powered quiz generation
  app.post('/api/courses/:id/generate-quiz', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const { type = 'mixed' } = req.body;
      const course = await storage.getCourse(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Use user's language preference for AI generation
      const language = (user?.language || 'fr') as 'fr' | 'en';
      const quizData = await generateQuiz(course.content, course.title, type, language);
      
      const quiz = await storage.createQuiz({
        courseId: course.id,
        userId,
        title: `Quiz : ${course.title}`,
        questions: quizData.questions,
      });

      res.json(quiz);
    } catch (error) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ message: "Failed to generate quiz", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Evaluate quiz answers
  app.post('/api/quizzes/:id/evaluate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const { answers } = req.body;
      const quiz = await storage.getQuiz(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      if (quiz.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Use user's language preference for AI evaluation
      const language = (user?.language || 'fr') as 'fr' | 'en';
      const questions = quiz.questions as any[];
      let score = 0;
      const evaluations: any[] = [];

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = answers[i];

        if (question.type === 'mcq') {
          // Normalize answers for comparison (trim spaces, lowercase)
          const normalizedUserAnswer = (userAnswer || '').trim().toLowerCase();
          const normalizedCorrectAnswer = (question.correctAnswer || '').trim().toLowerCase();
          const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
          if (isCorrect) score++;
          evaluations.push({
            questionIndex: i,
            isCorrect,
            userAnswer,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
          });
        } else if (question.type === 'open') {
          const evaluation = await evaluateOpenAnswer(
            question.question,
            userAnswer,
            question.explanation,
            language
          );
          score += evaluation.score / 100;
          evaluations.push({
            questionIndex: i,
            score: evaluation.score,
            userAnswer,
            feedback: evaluation.feedback,
          });
        }
      }

      const finalScore = Math.round((score / questions.length) * 100);

      const result = await storage.createQuizResult({
        quizId: quiz.id,
        userId,
        courseId: quiz.courseId,
        answers,
        score: finalScore,
        totalQuestions: questions.length,
      });

      res.json({
        result,
        evaluations,
        finalScore,
      });
    } catch (error) {
      console.error("Error evaluating quiz:", error);
      res.status(500).json({ message: "Failed to evaluate quiz", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Chat routes
  app.post('/api/chat/message', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get or create chat session
      let session = await storage.getChatSessionByUserId(userId);
      if (!session) {
        session = await storage.createChatSession({
          userId,
          messages: [],
          messageCount: 0,
        });
      }

      // Check subscription status
      const subscription = await storage.getSubscriptionByUserId(userId);
      const isPremium = subscription?.status === 'premium' && 
                        subscription?.endDate && 
                        new Date(subscription.endDate) > new Date();

      // Check message limits for free users
      if (!isPremium) {
        const now = new Date();
        const resetAt = session.resetAt ? new Date(session.resetAt) : null;

        // If reset time has passed, reset the counter
        if (resetAt && resetAt <= now) {
          session = await storage.updateChatSession(session.id, {
            messageCount: 0,
            resetAt: null,
          }) || session;
        }

        // Check if limit exceeded
        if (session.messageCount >= 5) {
          const remainingTime = resetAt ? Math.ceil((resetAt.getTime() - now.getTime()) / 1000 / 60) : 0;
          return res.status(429).json({
            message: "Limite atteinte",
            limitExceeded: true,
            remainingMinutes: remainingTime > 0 ? remainingTime : 0,
          });
        }
      }

      // Get conversation history (last 10 messages to keep context manageable)
      const messages = (session.messages as any[]) || [];
      const conversationHistory = messages.slice(-10);

      // Get user's language preference for AI chat
      const user = await storage.getUserById(userId);
      const language = (user?.language || 'fr') as 'fr' | 'en';

      // Get AI response in user's preferred language
      const aiResponse = await chatWithAI(message, conversationHistory, language);

      // Update session with new messages
      const updatedMessages = [
        ...messages,
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
      ];

      const newMessageCount = session.messageCount + 1;
      const updates: any = {
        messages: updatedMessages,
        messageCount: newMessageCount,
        lastMessageAt: new Date(),
      };

      // Set reset time for free users when they hit the limit
      if (!isPremium && newMessageCount >= 5) {
        const resetTime = new Date();
        resetTime.setHours(resetTime.getHours() + 3);
        updates.resetAt = resetTime;
      }

      await storage.updateChatSession(session.id, updates);

      res.json({
        response: aiResponse,
        messagesRemaining: isPremium ? null : Math.max(0, 5 - newMessageCount),
        isPremium,
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get('/api/chat/session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const session = await storage.getChatSessionByUserId(userId);

      if (!session) {
        return res.json({
          messages: [],
          messageCount: 0,
          isPremium: false,
          messagesRemaining: 5,
        });
      }

      // Check subscription status
      const subscription = await storage.getSubscriptionByUserId(userId);
      const isPremium = subscription?.status === 'premium' && 
                        subscription?.endDate && 
                        new Date(subscription.endDate) > new Date();

      // Check if reset time has passed
      const now = new Date();
      const resetAt = session.resetAt ? new Date(session.resetAt) : null;
      let messageCount = session.messageCount;

      if (!isPremium && resetAt && resetAt <= now) {
        messageCount = 0;
        await storage.updateChatSession(session.id, {
          messageCount: 0,
          resetAt: null,
        });
      }

      res.json({
        messages: session.messages || [],
        messageCount,
        isPremium,
        messagesRemaining: isPremium ? null : Math.max(0, 5 - messageCount),
        resetAt: !isPremium && resetAt && resetAt > now ? resetAt : null,
      });
    } catch (error) {
      console.error("Error fetching chat session:", error);
      res.status(500).json({ message: "Failed to fetch chat session" });
    }
  });

  app.delete('/api/chat/session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const session = await storage.getChatSessionByUserId(userId);

      if (session) {
        await storage.deleteChatSession(session.id);
      }

      res.json({ message: "Chat session cleared" });
    } catch (error) {
      console.error("Error clearing chat session:", error);
      res.status(500).json({ message: "Failed to clear chat session" });
    }
  });

  // Subscription routes
  app.get('/api/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const subscription = await storage.getSubscriptionByUserId(userId);

      if (!subscription) {
        return res.json({
          status: 'free',
          isPremium: false,
        });
      }

      const isPremium = subscription.status === 'premium' && 
                        subscription.endDate && 
                        new Date(subscription.endDate) > new Date();

      res.json({
        ...subscription,
        isPremium,
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Payment routes
  app.post('/api/payment/initiate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;

      const DOMAIN = process.env.CUSTOM_DOMAIN || process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
      const protocol = DOMAIN.includes('localhost') ? 'http' : 'https';
      const baseUrl = `${protocol}://${DOMAIN}`;

      const orderId = `CTC-${Date.now()}-${userId.slice(0, 8)}`;

      const paymentResponse = await lygosService.createPayment({
        amount: 1500,
        shopName: 'Corrige Tes Cours',
        message: 'Abonnement Premium 1 mois - Accès illimité',
        successUrl: `${baseUrl}/api/payment/return/lygos?status=success&order_id=${orderId}`,
        failureUrl: `${baseUrl}/api/payment/return/lygos?status=failed&order_id=${orderId}`,
        orderId,
      });

      if (!paymentResponse.success) {
        return res.status(400).json({ 
          message: paymentResponse.error || 'Échec de création du paiement' 
        });
      }

      const payment = await storage.createPayment({
        userId,
        subscriptionId: null,
        amount: 1500,
        currency: 'XAF',
        status: 'pending',
        paymentMethod: 'mobile_money',
        lygosProductId: paymentResponse.productId || null, // Only store if we have actual gateway ID
        lygosTransactionId: orderId, // Our internal order reference
        metadata: { 
          checkoutUrl: paymentResponse.checkoutUrl,
          lygosOrderId: orderId,
          lygosGatewayId: paymentResponse.productId || null,
        },
      });

      res.json({
        paymentId: payment.id,
        checkoutUrl: paymentResponse.checkoutUrl,
        transactionId: orderId,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      res.status(500).json({ message: "Échec d'initialisation du paiement" });
    }
  });

  app.get('/api/payment/status/:paymentId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const payment = await storage.getPayment(req.params.paymentId);

      if (!payment || payment.userId !== userId) {
        return res.status(404).json({ message: "Paiement introuvable" });
      }

      if (payment.status === 'completed') {
        return res.json({ status: 'completed', payment });
      }

      if (payment.lygosProductId) {
        const status = await lygosService.getPaymentStatus(payment.lygosProductId);

        if (status.status === 'success' && payment.status !== 'completed') {
          const metadataUpdate = payment.metadata && typeof payment.metadata === 'object' 
            ? { ...payment.metadata as object, ...status.details }
            : status.details;

          const updatedPayment = await storage.updatePayment(payment.id, {
            status: 'completed',
            metadata: metadataUpdate,
          });

          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);

          let subscription = await storage.getSubscriptionByUserId(userId);
          if (subscription) {
            const updatedSub = await storage.updateSubscription(subscription.id, {
              status: 'premium',
              startDate,
              endDate,
              paymentMethod: status.paymentMethod || 'mobile_money',
              amount: 1500,
              transactionId: status.transactionId || payment.lygosTransactionId,
            });

            if (updatedSub) {
              await storage.updatePayment(payment.id, {
                subscriptionId: updatedSub.id,
              });
              return res.json({ status: 'completed', payment: updatedPayment, subscription: updatedSub });
            }
          } else {
            const newSub = await storage.createSubscription({
              userId,
              status: 'premium',
              startDate,
              endDate,
              paymentMethod: status.paymentMethod || 'mobile_money',
              amount: 1500,
              transactionId: status.transactionId || payment.lygosTransactionId,
            });

            await storage.updatePayment(payment.id, {
              subscriptionId: newSub.id,
            });
            return res.json({ status: 'completed', payment: updatedPayment, subscription: newSub });
          }

          return res.json({ status: 'completed', payment: updatedPayment });
        } else if (status.status === 'failed') {
          await storage.updatePayment(payment.id, { status: 'failed' });
          return res.json({ status: 'failed', payment });
        }
      }

      res.json({ status: payment.status, payment });
    } catch (error) {
      console.error("Error checking payment status:", error);
      res.status(500).json({ message: "Échec de vérification du statut" });
    }
  });

  // Lygos Return URL - When user comes back from payment page
  // IMPORTANT: Lygos ONLY redirects to success_url if payment succeeded
  // So if we receive status=success, we trust it and activate Premium immediately
  app.get('/api/payment/return/lygos', async (req: any, res) => {
    try {
      const { status, order_id } = req.query;
      const orderId = order_id as string;
      const urlStatus = status as string;

      if (!orderId) {
        return res.redirect('/dashboard/subscription?error=no_order_id');
      }

      // Find payment by order ID (stored in lygosTransactionId) - optimized direct query
      const [payment] = await db.select().from(payments).where(eq(payments.lygosTransactionId, orderId)).limit(1);

      if (!payment) {
        return res.redirect('/dashboard/subscription?error=payment_not_found');
      }

      // Skip if already completed
      if (payment.status === 'completed') {
        return res.redirect('/dashboard/subscription?success=true');
      }

      // TRUST THE URL STATUS - Lygos only redirects to success_url if payment succeeded
      const isSuccess = urlStatus === 'success';
      const isFailed = urlStatus === 'failed';

      if (isSuccess) {
        // Update payment status
        const metadataUpdate = payment.metadata && typeof payment.metadata === 'object' 
          ? { ...payment.metadata as object, returnStatus: 'success', returnedAt: new Date().toISOString() }
          : { returnStatus: 'success', returnedAt: new Date().toISOString() };

        await storage.updatePayment(payment.id, {
          status: 'completed',
          paymentMethod: 'mobile_money',
          metadata: metadataUpdate,
        });

        // Create or update subscription for Premium access
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        let subscription = await storage.getSubscriptionByUserId(payment.userId);
        if (subscription) {
          await storage.updateSubscription(subscription.id, {
            status: 'premium',
            startDate,
            endDate,
            paymentMethod: 'mobile_money',
            amount: 1500,
            transactionId: orderId,
          });
        } else {
          const newSub = await storage.createSubscription({
            userId: payment.userId,
            status: 'premium',
            startDate,
            endDate,
            paymentMethod: 'mobile_money',
            amount: 1500,
            transactionId: orderId,
          });

          await storage.updatePayment(payment.id, {
            subscriptionId: newSub.id,
          });
        }

        // Send Premium congratulations email
        const user = await storage.getUser(payment.userId);
        if (user) {
          sendPremiumCongratsEmail(user.email, user.firstName, (user.language as 'fr' | 'en') || 'fr')
            .catch(err => console.error('Failed to send premium email:', err));
        }

        return res.redirect('/dashboard/subscription?success=true');
        
      } else if (isFailed) {
        const metadataUpdate = payment.metadata && typeof payment.metadata === 'object' 
          ? { ...payment.metadata as object, returnStatus: 'failed', returnedAt: new Date().toISOString() }
          : { returnStatus: 'failed', returnedAt: new Date().toISOString() };

        await storage.updatePayment(payment.id, {
          status: 'failed',
          metadata: metadataUpdate,
        });

        return res.redirect('/dashboard/subscription?error=payment_failed');
      } else {
        // Unknown status - but if user was redirected here, treat as success
        // because Lygos should only redirect to success_url after payment
        const metadataUpdate = payment.metadata && typeof payment.metadata === 'object' 
          ? { ...payment.metadata as object, returnStatus: urlStatus || 'unknown', returnedAt: new Date().toISOString() }
          : { returnStatus: urlStatus || 'unknown', returnedAt: new Date().toISOString() };

        await storage.updatePayment(payment.id, {
          status: 'completed',
          paymentMethod: 'mobile_money',
          metadata: metadataUpdate,
        });

        // Activate Premium anyway since they were redirected to success URL
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        let subscription = await storage.getSubscriptionByUserId(payment.userId);
        if (subscription) {
          await storage.updateSubscription(subscription.id, {
            status: 'premium',
            startDate,
            endDate,
            paymentMethod: 'mobile_money',
            amount: 1500,
            transactionId: orderId,
          });
        } else {
          const newSub = await storage.createSubscription({
            userId: payment.userId,
            status: 'premium',
            startDate,
            endDate,
            paymentMethod: 'mobile_money',
            amount: 1500,
            transactionId: orderId,
          });
          await storage.updatePayment(payment.id, { subscriptionId: newSub.id });
        }

        // Send Premium congratulations email
        const userForEmail = await storage.getUser(payment.userId);
        if (userForEmail) {
          sendPremiumCongratsEmail(userForEmail.email, userForEmail.firstName, (userForEmail.language as 'fr' | 'en') || 'fr')
            .catch(err => console.error('Failed to send premium email:', err));
        }

        return res.redirect('/dashboard/subscription?success=true');
      }
    } catch (error) {
      return res.redirect('/dashboard/subscription?error=server_error');
    }
  });

  // ===== Shared Stats Routes =====

  // Generate share token and create/update shared stats
  app.post('/api/share-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const user = await storage.getUser(userId);
      
      // Get user's stats
      const quizResults = await storage.getQuizResultsByUserId(userId);
      const courses = await storage.getCoursesByUserId(userId);
      
      const totalQuizzes = quizResults.length;
      const totalCourses = courses.length;
      const averageScore = totalQuizzes > 0
        ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / totalQuizzes)
        : 0;
      const bestScore = totalQuizzes > 0
        ? Math.max(...quizResults.map(r => r.score))
        : 0;

      // Check if user already has a share token
      let sharedStats = await storage.getSharedStatsByUserId(userId);
      
      const userName = user ? `${user.firstName} ${user.lastName}` : undefined;

      if (sharedStats) {
        // Update existing stats
        sharedStats = await storage.updateSharedStats(sharedStats.id, {
          totalQuizzes,
          totalCourses,
          averageScore,
          bestScore,
          userName,
        });
      } else {
        // Generate unique share token
        const shareToken = `${userId.substring(0, 8)}-${Date.now().toString(36)}`;
        
        sharedStats = await storage.createSharedStats({
          userId,
          shareToken,
          totalQuizzes,
          totalCourses,
          averageScore,
          bestScore,
          userName,
        });
      }

      res.json(sharedStats);
    } catch (error) {
      console.error("Error creating share stats:", error);
      res.status(500).json({ message: "Failed to create share link" });
    }
  });

  // Get shared stats by token (public route)
  app.get('/api/shared/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const sharedStats = await storage.getSharedStatsByToken(token);
      
      if (!sharedStats) {
        return res.status(404).json({ message: "Stats not found" });
      }

      res.json(sharedStats);
    } catch (error) {
      console.error("Error fetching shared stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get current user's share stats
  app.get('/api/share-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const sharedStats = await storage.getSharedStatsByUserId(userId);
      res.json(sharedStats || null);
    } catch (error) {
      console.error("Error fetching share stats:", error);
      res.status(500).json({ message: "Failed to fetch share stats" });
    }
  });

  // Server-side OG meta tags for social media sharing
  // This route serves proper HTML with OG tags that social media crawlers can read
  app.get('/share/:token', async (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    
    // Check if this is a social media crawler (Facebook, Twitter, WhatsApp, etc.)
    const isCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedin|telegram|slackbot|discord|pinterest/i.test(userAgent);
    
    if (!isCrawler) {
      // For regular users, let the SPA handle it
      return next();
    }

    try {
      const { token } = req.params;
      const sharedStats = await storage.getSharedStatsByToken(token);
      
      const baseUrl = process.env.CUSTOM_DOMAIN ? `https://${process.env.CUSTOM_DOMAIN}` : `https://${req.headers.host}`;
      
      if (!sharedStats) {
        // Return basic OG tags for not found
        res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Stats non trouvées | Corrige Tes Cours</title>
  <meta property="og:title" content="Stats non trouvées | Corrige Tes Cours" />
  <meta property="og:description" content="Ce lien de partage n'existe plus. Découvre Corrige Tes Cours !" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}/share/${token}" />
  <meta property="og:image" content="${baseUrl}/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${baseUrl}/og-image.png" />
</head>
<body></body>
</html>`);
        return;
      }

      const userName = sharedStats.userName || 'Un étudiant';
      const title = `${userName} - Performances | Corrige Tes Cours`;
      const description = `${userName} a passé ${sharedStats.totalQuizzes} quiz avec une moyenne de ${sharedStats.averageScore}% et un meilleur score de ${sharedStats.bestScore}%. Découvre Corrige Tes Cours !`;

      const ogImage = `${baseUrl}/og-image.png`;
      
      res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}/share/${token}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Corrige Tes Cours" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <p>Quiz passés: ${sharedStats.totalQuizzes}</p>
  <p>Cours actifs: ${sharedStats.totalCourses}</p>
  <p>Moyenne: ${sharedStats.averageScore}%</p>
  <p>Meilleur score: ${sharedStats.bestScore}%</p>
</body>
</html>`);
    } catch (error) {
      console.error("Error serving OG tags:", error);
      next();
    }
  });

  // ==================== EMAIL MARKETING ROUTES ====================
  
  // Rate limiting for admin email endpoint
  let lastBulkEmailTime = 0;
  const BULK_EMAIL_COOLDOWN = 60 * 60 * 1000; // 1 hour minimum between bulk sends
  
  // Send weekly motivation emails to all opted-in users (admin only - for cron job or manual trigger)
  app.post('/api/admin/send-weekly-emails', async (req, res) => {
    try {
      // Admin authentication - require both correct key AND valid session secret
      const adminKey = req.headers['x-admin-key'];
      const expectedKey = `admin-${process.env.SESSION_SECRET}`;
      
      if (!adminKey || adminKey !== expectedKey) {
        console.warn('Unauthorized admin email attempt');
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Rate limiting - prevent abuse
      const now = Date.now();
      if (now - lastBulkEmailTime < BULK_EMAIL_COOLDOWN) {
        const remainingMins = Math.ceil((BULK_EMAIL_COOLDOWN - (now - lastBulkEmailTime)) / 60000);
        return res.status(429).json({ 
          message: `Too many requests. Please wait ${remainingMins} minutes before sending again.` 
        });
      }
      lastBulkEmailTime = now;

      // Get ONLY opted-in users (filter at storage level for efficiency)
      const allUsers = await storage.getAllUsers();
      const optedInUsers = allUsers.filter(u => u.emailMarketing === 'yes');

      console.log(`Sending weekly emails to ${optedInUsers.length} opted-in users`);

      // Prepare users with their stats in batches to avoid overwhelming the DB
      const BATCH_SIZE = 10;
      const usersWithStats: Array<{
        email: string;
        firstName: string;
        language: 'fr' | 'en';
        stats: { coursesCount: number; quizzesCount: number; avgScore: number };
      }> = [];

      for (let i = 0; i < optedInUsers.length; i += BATCH_SIZE) {
        const batch = optedInUsers.slice(i, i + BATCH_SIZE);
        const batchStats = await Promise.all(
          batch.map(async (user) => {
            const courses = await storage.getCoursesByUserId(user.id);
            const quizResults = await storage.getQuizResultsByUserId(user.id);
            
            const avgScore = quizResults.length > 0 
              ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length)
              : 0;

            return {
              email: user.email,
              firstName: user.firstName,
              language: (user.language || 'fr') as 'fr' | 'en',
              stats: {
                coursesCount: courses.length,
                quizzesCount: quizResults.length,
                avgScore
              }
            };
          })
        );
        usersWithStats.push(...batchStats);
      }

      // Send emails in bulk
      const results = await sendBulkWeeklyEmails(usersWithStats);

      // Log results for audit
      console.log(`Weekly email results: sent=${results.sent}, failed=${results.failed}`);

      res.json({
        message: `Weekly emails sent`,
        sent: results.sent,
        failed: results.failed,
        totalOptedIn: optedInUsers.length,
        errors: results.errors.slice(0, 10) // Only show first 10 errors
      });
    } catch (error) {
      console.error("Error sending weekly emails:", error);
      res.status(500).json({ message: "Failed to send weekly emails" });
    }
  });

  // Send test email to the current user
  app.post('/api/email/test-weekly', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user stats
      const courses = await storage.getCoursesByUserId(userId);
      const quizResults = await storage.getQuizResultsByUserId(userId);
      
      const avgScore = quizResults.length > 0 
        ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length)
        : 0;

      const stats = {
        coursesCount: courses.length,
        quizzesCount: quizResults.length,
        avgScore
      };

      const result = await sendWeeklyMotivationEmail(
        user.email,
        user.firstName,
        stats,
        (user.language || 'fr') as 'fr' | 'en'
      );

      if (result.success) {
        res.json({ message: "Email de test envoyé!", messageId: result.messageId });
      } else {
        res.status(500).json({ message: result.error || "Échec de l'envoi" });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  // Update email preferences (also syncs to Resend)
  app.patch('/api/user/email-preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const { emailMarketing } = req.body;

      if (!['yes', 'no'].includes(emailMarketing)) {
        return res.status(400).json({ message: "Invalid value. Use 'yes' or 'no'" });
      }

      const updatedUser = await storage.updateUser(userId, { emailMarketing });
      
      // Sync to Resend - update subscription status
      if (updatedUser) {
        const { updateResendContact } = await import('./email');
        await updateResendContact(updatedUser.email, emailMarketing === 'no');
      }

      res.json({ 
        message: emailMarketing === 'yes' ? "Emails marketing activés" : "Emails marketing désactivés",
        emailMarketing: updatedUser?.emailMarketing 
      });
    } catch (error) {
      console.error("Error updating email preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Sync all users to Resend (admin only - run once or periodically)
  app.post('/api/admin/sync-users-to-resend', async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'];
      const expectedKey = `admin-${process.env.SESSION_SECRET}`;
      
      if (!adminKey || adminKey !== expectedKey) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { syncAllUsersToResend } = await import('./email');
      const allUsers = await storage.getAllUsers();
      
      console.log(`Syncing ${allUsers.length} users to Resend...`);
      
      const results = await syncAllUsersToResend(
        allUsers.map(u => ({
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName || undefined,
          emailMarketing: u.emailMarketing || 'yes'
        }))
      );

      res.json({
        message: "Sync complete",
        added: results.added,
        updated: results.updated,
        skipped: results.skipped,
        errors: results.errors.slice(0, 10)
      });
    } catch (error) {
      console.error("Error syncing users to Resend:", error);
      res.status(500).json({ message: "Failed to sync users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
