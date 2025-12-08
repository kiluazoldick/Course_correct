import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (supports local auth + Google OAuth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  password: varchar("password"), // Nullable for Google OAuth users
  googleId: varchar("google_id").unique(), // Nullable for local auth users
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phone: varchar("phone"), // Phone number for payments
  language: varchar("language").notNull().default("fr"), // User's preferred language (fr or en)
  profileImageUrl: varchar("profile_image_url"),
  emailMarketing: varchar("email_marketing").notNull().default("yes"), // yes/no for marketing emails
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema for local registration (email + password)
export const insertLocalUserSchema = createInsertSchema(users, {
  email: z.string().email("Email invalide"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  googleId: true,
  profileImageUrl: true,
});

// Schema for Google OAuth registration
export const insertGoogleUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  password: true,
});

export type InsertLocalUser = z.infer<typeof insertLocalUserSchema>;
export type InsertGoogleUser = z.infer<typeof insertGoogleUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Schema for updating user profile
export const updateUserProfileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").optional(),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
  phone: z.string().regex(/^\+?[0-9]{9,15}$/, "Numéro de téléphone invalide (ex: +237670000000)").optional().or(z.literal("")),
  profileImageUrl: z.string().url().optional().or(z.literal("")),
  emailMarketing: z.enum(["yes", "no"]).optional(),
});

export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  subject: text("subject"),
  isUpload: integer("is_upload").notNull().default(0), // 1 if created from file upload, 0 otherwise
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export const summaries = pgTable("summaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSummarySchema = createInsertSchema(summaries).omit({
  id: true,
  createdAt: true,
});

export type InsertSummary = z.infer<typeof insertSummarySchema>;
export type Summary = typeof summaries.$inferSelect;

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  questions: jsonb("questions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export const quizResults = pgTable("quiz_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  answers: jsonb("answers").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  createdAt: true,
});

export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;

// Subscriptions table for premium features
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  status: varchar("status").notNull().default("free"), // 'free' | 'premium' | 'cancelled'
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  paymentMethod: varchar("payment_method"), // 'mtn' | 'orange' | 'card'
  amount: integer("amount"), // Amount in XAF
  transactionId: varchar("transaction_id"), // Lygos transaction ID
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Chatbot sessions table for conversation history
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  messages: jsonb("messages").notNull().default([]), // Array of {role: 'user'|'assistant', content: string, timestamp: string}
  messageCount: integer("message_count").notNull().default(0),
  lastMessageAt: timestamp("last_message_at"),
  resetAt: timestamp("reset_at"), // When the 3h cooldown ends
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

// Payment transactions table for Lygos payments
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id, { onDelete: 'set null' }),
  amount: integer("amount").notNull(), // Amount in XAF
  currency: varchar("currency").notNull().default("XAF"),
  status: varchar("status").notNull().default("pending"), // 'pending' | 'completed' | 'failed'
  paymentMethod: varchar("payment_method").notNull(), // 'mtn' | 'orange' | 'card'
  lygosTransactionId: varchar("lygos_transaction_id"), // Lygos transaction ID
  lygosProductId: varchar("lygos_product_id"), // Lygos product ID
  metadata: jsonb("metadata"), // Additional payment data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Anonymous uploads table for onboarding flow (test before signup)
export const anonymousUploads = pgTable("anonymous_uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(), // Cookie/localStorage identifier
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"), // AI-generated summary
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(), // Auto-delete after 48h if not claimed
});

export const insertAnonymousUploadSchema = createInsertSchema(anonymousUploads).omit({
  id: true,
  createdAt: true,
});

export type InsertAnonymousUpload = z.infer<typeof insertAnonymousUploadSchema>;
export type AnonymousUpload = typeof anonymousUploads.$inferSelect;

// Shared stats for social sharing
export const sharedStats = pgTable("shared_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  shareToken: varchar("share_token").notNull().unique(), // Unique token for sharing
  totalQuizzes: integer("total_quizzes").notNull().default(0),
  totalCourses: integer("total_courses").notNull().default(0),
  averageScore: integer("average_score").notNull().default(0),
  bestScore: integer("best_score").notNull().default(0),
  userName: varchar("user_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiration
});

export const insertSharedStatsSchema = createInsertSchema(sharedStats).omit({
  id: true,
  createdAt: true,
});

export type InsertSharedStats = z.infer<typeof insertSharedStatsSchema>;
export type SharedStats = typeof sharedStats.$inferSelect;
