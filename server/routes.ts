import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCourseSchema, insertQuizSchema, insertQuizResultSchema, insertSummarySchema } from "@shared/schema";
import { generateCourseSummary, generateQuiz, evaluateOpenAnswer } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Courses routes
  app.get('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      if (course.userId !== req.user.claims.sub) {
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
      const userId = req.user.claims.sub;
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
      if (course.userId !== req.user.claims.sub) {
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
      if (course.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Forbidden" });
      }
      await storage.deleteCourse(req.params.id);
      res.json({ message: "Course deleted" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Quiz routes
  app.get('/api/quizzes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      if (quiz.userId !== req.user.claims.sub) {
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const results = await storage.getQuizResultsByUserId(userId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  app.post('/api/quiz-results', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const summaries = await storage.getSummariesByUserId(userId);
      res.json(summaries);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      res.status(500).json({ message: "Failed to fetch summaries" });
    }
  });

  app.post('/api/summaries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  const httpServer = createServer(app);
  return httpServer;
}
