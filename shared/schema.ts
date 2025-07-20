import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  puterId: text("puter_id").notNull().unique(),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  keyword: text("keyword"),
  contentType: text("content_type").notNull(),
  seoScore: integer("seo_score"),
  seoAnalysis: jsonb("seo_analysis"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"),
  wordCount: integer("word_count"),
  publishedTo: text("published_to").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wordpressConnections = pgTable("wordpress_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  authType: text("auth_type").notNull(),
  credentials: jsonb("credentials").notNull(),
  isActive: boolean("is_active").default(true),
  lastTestAt: timestamp("last_test_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  puterId: true,
  preferences: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWordPressConnectionSchema = createInsertSchema(wordpressConnections).omit({
  id: true,
  createdAt: true,
  lastTestAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type WordPressConnection = typeof wordpressConnections.$inferSelect;
export type InsertWordPressConnection = z.infer<typeof insertWordPressConnectionSchema>;

// Additional types for the application
export interface ContentBrief {
  keyword: string;
  contentType: string;
  targetLength: number;
  tone: string;
  audience: string;
  outline: OutlineItem[];
}

export interface OutlineItem {
  level: string;
  heading: string;
  wordCount: number;
}

export interface SEOAnalysis {
  overallScore: number;
  titleScore: number;
  metaScore: number;
  keywordScore: number;
  readabilityScore: number;
  headingScore: number;
  lengthScore: number;
  suggestions: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultAIModel: string;
  defaultWordCount: number;
  autoSaveInterval: number;
}
