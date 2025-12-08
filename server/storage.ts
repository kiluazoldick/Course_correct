import { eq, desc, and, gte, sql } from "drizzle-orm";
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
  type Subscription,
  type InsertSubscription,
  type ChatSession,
  type InsertChatSession,
  type Payment,
  type InsertPayment,
  type AnonymousUpload,
  type InsertAnonymousUpload,
  type SharedStats,
  type InsertSharedStats,
  users,
  courses,
  summaries,
  quizzes,
  quizResults,
  subscriptions,
  chatSessions,
  payments,
  anonymousUploads,
  sharedStats,
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
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  createLocalUser(user: InsertLocalUser): Promise<User>;
  createGoogleUser(user: InsertGoogleUser): Promise<User>;
  linkGoogleAccount(userId: string, googleId: string): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Courses
  getCourse(id: string): Promise<Course | undefined>;
  getCoursesByUserId(userId: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<void>;
  getUploadCountThisMonth(userId: string, startOfMonth: Date): Promise<number>;

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

  // Subscriptions
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionByUserId(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;

  // Chat Sessions
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getChatSessionByUserId(userId: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, session: Partial<InsertChatSession>): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<void>;

  // Payments
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;

  // Anonymous Uploads (for onboarding flow)
  getAnonymousUpload(id: string): Promise<AnonymousUpload | undefined>;
  getAnonymousUploadBySessionId(sessionId: string): Promise<AnonymousUpload | undefined>;
  createAnonymousUpload(upload: InsertAnonymousUpload): Promise<AnonymousUpload>;
  updateAnonymousUpload(id: string, upload: Partial<InsertAnonymousUpload>): Promise<AnonymousUpload | undefined>;
  deleteAnonymousUpload(id: string): Promise<void>;
  deleteExpiredAnonymousUploads(): Promise<number>;
  migrateAnonymousUploadToUser(uploadId: string, userId: string): Promise<Course>;

  // Shared Stats (for social sharing)
  getSharedStatsByToken(shareToken: string): Promise<SharedStats | undefined>;
  getSharedStatsByUserId(userId: string): Promise<SharedStats | undefined>;
  createSharedStats(stats: InsertSharedStats): Promise<SharedStats>;
  updateSharedStats(id: string, stats: Partial<InsertSharedStats>): Promise<SharedStats | undefined>;
  deleteSharedStats(id: string): Promise<void>;
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

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
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

  async getUploadCountThisMonth(userId: string, startOfMonth: Date): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(and(
        eq(courses.userId, userId),
        eq(courses.isUpload, 1),
        gte(courses.createdAt, startOfMonth)
      ));
    return Number(result[0]?.count || 0);
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

  // Subscriptions
  async getSubscription(id: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    return result[0];
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
    return result[0];
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptions).values(subscription).returning();
    return result[0];
  }

  async updateSubscription(id: string, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const updated = { ...subscription, updatedAt: new Date() };
    const result = await db.update(subscriptions).set(updated).where(eq(subscriptions.id, id)).returning();
    return result[0];
  }

  // Chat Sessions
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const result = await db.select().from(chatSessions).where(eq(chatSessions.id, id)).limit(1);
    return result[0];
  }

  async getChatSessionByUserId(userId: string): Promise<ChatSession | undefined> {
    const result = await db.select().from(chatSessions).where(eq(chatSessions.userId, userId)).limit(1);
    return result[0];
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const result = await db.insert(chatSessions).values(session).returning();
    return result[0];
  }

  async updateChatSession(id: string, session: Partial<InsertChatSession>): Promise<ChatSession | undefined> {
    const updated = { ...session, updatedAt: new Date() };
    const result = await db.update(chatSessions).set(updated).where(eq(chatSessions.id, id)).returning();
    return result[0];
  }

  async deleteChatSession(id: string): Promise<void> {
    await db.delete(chatSessions).where(eq(chatSessions.id, id));
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0];
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
    const updated = { ...payment, updatedAt: new Date() };
    const result = await db.update(payments).set(updated).where(eq(payments.id, id)).returning();
    return result[0];
  }

  // Anonymous Uploads (for onboarding flow)
  async getAnonymousUpload(id: string): Promise<AnonymousUpload | undefined> {
    const result = await db.select().from(anonymousUploads).where(eq(anonymousUploads.id, id)).limit(1);
    return result[0];
  }

  async getAnonymousUploadBySessionId(sessionId: string): Promise<AnonymousUpload | undefined> {
    const result = await db.select().from(anonymousUploads).where(eq(anonymousUploads.sessionId, sessionId)).limit(1);
    return result[0];
  }

  async createAnonymousUpload(upload: InsertAnonymousUpload): Promise<AnonymousUpload> {
    const result = await db.insert(anonymousUploads).values(upload).returning();
    return result[0];
  }

  async updateAnonymousUpload(id: string, upload: Partial<InsertAnonymousUpload>): Promise<AnonymousUpload | undefined> {
    const result = await db.update(anonymousUploads).set(upload).where(eq(anonymousUploads.id, id)).returning();
    return result[0];
  }

  async deleteAnonymousUpload(id: string): Promise<void> {
    await db.delete(anonymousUploads).where(eq(anonymousUploads.id, id));
  }

  async deleteExpiredAnonymousUploads(): Promise<number> {
    const now = new Date();
    const result = await db.delete(anonymousUploads).where(sql`${anonymousUploads.expiresAt} < ${now}`).returning();
    return result.length;
  }

  async migrateAnonymousUploadToUser(uploadId: string, userId: string): Promise<Course> {
    const upload = await this.getAnonymousUpload(uploadId);
    if (!upload) {
      throw new Error("Upload anonyme introuvable");
    }

    const course = await this.createCourse({
      userId,
      title: upload.title,
      content: upload.content,
      subject: null,
      isUpload: 1,
    });

    if (upload.summary) {
      await this.createSummary({
        courseId: course.id,
        userId,
        content: upload.summary,
      });
    }

    await this.deleteAnonymousUpload(uploadId);

    return course;
  }

  // Shared Stats
  async getSharedStatsByToken(shareToken: string): Promise<SharedStats | undefined> {
    const result = await db.select().from(sharedStats).where(eq(sharedStats.shareToken, shareToken)).limit(1);
    return result[0];
  }

  async getSharedStatsByUserId(userId: string): Promise<SharedStats | undefined> {
    const result = await db.select().from(sharedStats).where(eq(sharedStats.userId, userId)).limit(1);
    return result[0];
  }

  async createSharedStats(stats: InsertSharedStats): Promise<SharedStats> {
    const result = await db.insert(sharedStats).values(stats).returning();
    return result[0];
  }

  async updateSharedStats(id: string, stats: Partial<InsertSharedStats>): Promise<SharedStats | undefined> {
    const result = await db.update(sharedStats).set(stats).where(eq(sharedStats.id, id)).returning();
    return result[0];
  }

  async deleteSharedStats(id: string): Promise<void> {
    await db.delete(sharedStats).where(eq(sharedStats.id, id));
  }
}

export const storage = new DbStorage();
