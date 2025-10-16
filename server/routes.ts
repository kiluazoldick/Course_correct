import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertCourseSchema, insertQuizSchema, insertQuizResultSchema, insertSummarySchema } from "@shared/schema";
import { generateCourseSummary, generateQuiz, evaluateOpenAnswer, chatWithAI } from "./ai";
import multer from "multer";
import { processUploadedFile } from "./fileProcessor";

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

  // File upload route
  app.post('/api/courses/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier n'a été uploadé" });
      }

      const userId = (req.user as any).id;
      const { text, title } = await processUploadedFile(req.file.buffer, req.file.mimetype);

      if (!text || text.length < 50) {
        return res.status(400).json({ 
          message: "Le fichier ne contient pas assez de texte exploitable" 
        });
      }

      // Create course from extracted text
      const course = await storage.createCourse({
        userId,
        title: title,
        content: text,
        subject: req.body.subject || '',
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
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const summaryContent = await generateCourseSummary(course.content, course.title);
      
      const summary = await storage.createSummary({
        courseId: course.id,
        userId,
        content: summaryContent,
      });

      res.json(summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(500).json({ message: "Failed to generate summary", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // AI-powered quiz generation
  app.post('/api/courses/:id/generate-quiz', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const { type = 'mixed' } = req.body;
      const course = await storage.getCourse(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const quizData = await generateQuiz(course.content, course.title, type);
      
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
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      if (quiz.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

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
            question.explanation
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

      // Get AI response
      const aiResponse = await chatWithAI(message, conversationHistory);

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
      const user = req.user as any;
      const { lygosService } = await import('./lygos');

      const DOMAIN = process.env.CUSTOM_DOMAIN || process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
      const protocol = DOMAIN.includes('localhost') ? 'http' : 'https';
      const baseUrl = `${protocol}://${DOMAIN}`;

      const paymentResponse = await lygosService.createPayment({
        title: 'Abonnement Premium - Corrige Tes Cours',
        amount: 1500,
        description: `Abonnement mensuel Premium pour ${user.firstName} ${user.lastName}`,
        successUrl: `${baseUrl}/dashboard/subscription/success`,
        failureUrl: `${baseUrl}/dashboard/subscription/failed`,
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
        lygosProductId: paymentResponse.productId || null,
        lygosTransactionId: paymentResponse.orderId || null,
        metadata: { checkoutUrl: paymentResponse.checkoutUrl },
      });

      res.json({
        paymentId: payment.id,
        checkoutUrl: paymentResponse.checkoutUrl,
        orderId: paymentResponse.orderId,
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

      if (payment.lygosTransactionId) {
        const { lygosService } = await import('./lygos');
        const status = await lygosService.getPaymentStatus(payment.lygosTransactionId);

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

  const httpServer = createServer(app);
  return httpServer;
}
