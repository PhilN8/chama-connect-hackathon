import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  phoneNumber: text("phone_number").unique(),
  globalRole: text("global_role").$type<"USER" | "SYSTEM_ADMIN">().notNull().default("USER"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id),
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const chamas = sqliteTable("chama", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  minContributionAmount: integer("min_contribution_amount").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const chamaMemberships = sqliteTable("chama_membership", {
  id: text("id").primaryKey(),
  chamaId: text("chama_id").notNull().references(() => chamas.id),
  userId: text("user_id").notNull().references(() => users.id),
  role: text("role").$type<"ADMIN" | "TREASURER" | "SECRETARY" | "MEMBER">().notNull().default("MEMBER"),
  status: text("status").$type<"ACTIVE" | "DEACTIVATED" | "PENDING">().notNull().default("PENDING"),
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
}, (table) => ({
  unq: uniqueIndex("membership_unq").on(table.chamaId, table.userId),
}));

export const invitations = sqliteTable("invitation", {
  id: text("id").primaryKey(),
  chamaId: text("chama_id").notNull().references(() => chamas.id),
  inviterId: text("inviter_id").notNull().references(() => users.id),
  email: text("email"),
  phoneNumber: text("phone_number"),
  role: text("role").$type<"ADMIN" | "TREASURER" | "SECRETARY" | "MEMBER">().notNull().default("MEMBER"),
  status: text("status").$type<"PENDING" | "ACCEPTED" | "EXPIRED">().notNull().default("PENDING"),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const contributions = sqliteTable("contribution", {
  id: text("id").primaryKey(),
  chamaId: text("chama_id").notNull().references(() => chamas.id),
  memberId: text("member_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").$type<"CASH" | "MPESA">().notNull(),
  status: text("status").$type<"PENDING" | "VERIFIED" | "REJECTED" | "SELF_VERIFIED">().notNull().default("PENDING"),
  description: text("description"),
  rejectionReason: text("rejection_reason"),
  verifiedById: text("verified_by_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
