import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db";
import * as schema from "./db/schema";
import { admin, emailOTP, testUtils } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";

// Configuration for OTP email delivery
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  // Required for OAuth redirects and session management
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "Auth <auth@yourdomain.com>",
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },

  plugins: [
    // Admin plugin for blog management
    admin({
      // We can hardcode your ID here later or assign via role management
      adminRoles: ["admin"],
    }),
    // Email OTP for passwordless and secure login
    emailOTP({
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in"
            ? "Your Login Code"
            : type === "email-verification"
              ? "Verify Your Email"
              : "Reset Your Password";

        const text = `Your verification code is: ${otp}. This code will expire in 5 minutes.`;

        // If in test environment, we don't send real emails
        if (process.env.NODE_ENV === "test") {
          console.log(`[TEST] OTP for ${email}: ${otp}`);
          return;
        }

        try {
          await transporter.sendMail({
            from: process.env.EMAIL_FROM || "Auth <auth@yourdomain.com>",
            to: email,
            subject,
            text,
          });
        } catch (error) {
          console.error("Failed to send OTP email:", error);
          // In a production app, you might want to handle this more gracefully
        }
      },
    }),
    // Test utilities for Vitest integration
    ...(process.env.NODE_ENV === "test" ||
    process.env.ENABLE_TEST_UTILS === "true"
      ? [testUtils({ captureOTP: true })]
      : []),
    nextCookies(),
  ],
});
