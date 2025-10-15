import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import {
  type User,
  type UpsertUser,
  type InsertLocalUser,
  type InsertGoogleUser,
  type Course,
  type InsertCourse,
  type Summary,
  type InsertSummary,
  type Quiz,
  type InsertQuiz,
  type QuizResult,
  type InsertQuizResult,
  users,
  courses,
  summaries,
  quizzes,
  quizResults,
} from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createLocalUser(user: InsertLocalUser): Promise<User>;
  createGoogleUser(user: InsertGoogleUser): Promise<User>;
  linkGoogleAccount(userId: string, googleId: string): Promise<User>;

  // Courses
  getCourse(id: string): Promise<Course | undefined>;
  getCoursesByUserId(userId: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<void>;

  // Summaries
  getSummary(id: string): Promise<Summary | undefined>;
  getSummariesByCourseId(courseId: string): Promise<Summary[]>;
  getSummariesByUserId(userId: string): Promise<Summary[]>;
  createSummary(summary: InsertSummary): Promise<Summary>;
  deleteSummary(id: string): Promise<void>;

  // Quizzes
  getQuiz(id: string): Promise<Quiz | undefined>;
  getQuizzesByCourseId(courseId: string): Promise<Quiz[]>;
  getQuizzesByUserId(userId: string): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  deleteQuiz(id: string): Promise<void>;

  // Quiz Results
  getQuizResult(id: string): Promise<QuizResult | undefined>;
  getQuizResultsByUserId(userId: string): Promise<QuizResult[]>;
  getQuizResultsByCourseId(courseId: string): Promise<QuizResult[]>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createLocalUser(userData: InsertLocalUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async createGoogleUser(userData: InsertGoogleUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ googleId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Courses
  async getCourse(id: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return result[0];
  }

  async getCoursesByUserId(userId: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.userId, userId)).orderBy(desc(courses.updatedAt));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  async updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const updatedCourse = { ...course, updatedAt: new Date() };
    const result = await db.update(courses).set(updatedCourse).where(eq(courses.id, id)).returning();
    return result[0];
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Summaries
  async getSummary(id: string): Promise<Summary | undefined> {
    const result = await db.select().from(summaries).where(eq(summaries.id, id)).limit(1);
    return result[0];
  }

  async getSummariesByCourseId(courseId: string): Promise<Summary[]> {
    return await db.select().from(summaries).where(eq(summaries.courseId, courseId)).orderBy(desc(summaries.createdAt));
  }

  async getSummariesByUserId(userId: string): Promise<Summary[]> {
    return await db.select().from(summaries).where(eq(summaries.userId, userId)).orderBy(desc(summaries.createdAt));
  }

  async createSummary(summary: InsertSummary): Promise<Summary> {
    const result = await db.insert(summaries).values(summary).returning();
    return result[0];
  }

  async deleteSummary(id: string): Promise<void> {
    await db.delete(summaries).where(eq(summaries.id, id));
  }

  // Quizzes
  async getQuiz(id: string): Promise<Quiz | undefined> {
    const result = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
    return result[0];
  }

  async getQuizzesByCourseId(courseId: string): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.courseId, courseId)).orderBy(desc(quizzes.createdAt));
  }

  async getQuizzesByUserId(userId: string): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.userId, userId)).orderBy(desc(quizzes.createdAt));
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const result = await db.insert(quizzes).values(quiz).returning();
    return result[0];
  }

  async deleteQuiz(id: string): Promise<void> {
    await db.delete(quizzes).where(eq(quizzes.id, id));
  }

  // Quiz Results
  async getQuizResult(id: string): Promise<QuizResult | undefined> {
    const result = await db.select().from(quizResults).where(eq(quizResults.id, id)).limit(1);
    return result[0];
  }

  async getQuizResultsByUserId(userId: string): Promise<QuizResult[]> {
    return await db.select().from(quizResults).where(eq(quizResults.userId, userId)).orderBy(desc(quizResults.createdAt));
  }

  async getQuizResultsByCourseId(courseId: string): Promise<QuizResult[]> {
    return await db.select().from(quizResults).where(eq(quizResults.courseId, courseId)).orderBy(desc(quizResults.createdAt));
  }

  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const inserted = await db.insert(quizResults).values(result).returning();
    return inserted[0];
  }
}

export const storage = new DbStorage();
