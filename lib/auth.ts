import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { z } from "zod";
import { compareSync, hashSync } from "bcryptjs";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  phoneNumber?: string | null;
  globalRole: "USER" | "SYSTEM_ADMIN";
  createdAt: Date;
  updatedAt: Date;
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      async hash(password) {
        return hashSync(password, 10)
      },
      async verify(data) {
        return compareSync(data.password, data.hash)
      },
    }
  },
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      console.log(`Verification email for\n${user.email}: ${url}`);
    },
  },
  advanced: {
    cookiePrefix: "chama-connect",
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  },
  user: {
    additionalFields: {
      globalRole: {
        type: "string",
        defaultValue: "USER",
        validator: {
          input: z
            .enum(["USER", "SYSTEM_ADMIN"], "Invalid user role"),
        },
      },
      phoneNumber: {
        type: "string",
        unique: true,
        validator: {
          input: z
            .string()
            .regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, "Invalid Kenyan phone number")
            .optional(),
        },
      },
    }
  },
});
