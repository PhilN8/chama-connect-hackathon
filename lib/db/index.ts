import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

function getDatabaseUrl(): string {
  // If in production (Vercel) and Turso credentials exist, use Turso
  if (process.env.VERCEL && process.env.TURSO_CONNECTION_URL) {
    return process.env.TURSO_CONNECTION_URL;
  }
  // Fallback to local SQLite for development
  return process.env.DATABASE_URL || "file:local.db";
}

function getAuthToken(): string | undefined {
  if (process.env.VERCEL && process.env.TURSO_AUTH_TOKEN) {
    return process.env.TURSO_AUTH_TOKEN;
  }
  return undefined;
}

export const db = drizzle({
  connection: {
    url: getDatabaseUrl(),
    authToken: getAuthToken(),
  }
});