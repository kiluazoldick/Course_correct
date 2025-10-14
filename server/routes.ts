import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

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
      const course = await storage.createCourse({
        ...req.body,
        userId,
      });
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
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
      const updated = await storage.updateCourse(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating course:", error);
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
      const quiz = await storage.createQuiz({
        ...req.body,
        userId,
      });
      res.json(quiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
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
      const result = await storage.createQuizResult({
        ...req.body,
        userId,
      });
      res.json(result);
    } catch (error) {
      console.error("Error creating quiz result:", error);
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
      const summary = await storage.createSummary({
        ...req.body,
        userId,
      });
      res.json(summary);
    } catch (error) {
      console.error("Error creating summary:", error);
      res.status(500).json({ message: "Failed to create summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
