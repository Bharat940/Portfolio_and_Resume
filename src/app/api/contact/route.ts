import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

// Validation schema for the contact form
const contactSchema = z.object({
  name: z
    .string()
    .pipe(z.string().min(2, { message: "Name must be at least 2 characters" })),
  email: z.email({ message: "Invalid email address" }),
  message: z
    .string()
    .pipe(
      z.string().min(10, { message: "Message must be at least 10 characters" }),
    ),
});

export async function POST(req: Request) {
  try {
    // 0. Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const limitResult = await rateLimit(ip);

    if (!limitResult.success) {
      return NextResponse.json(
        { error: "Too many transmissions. Please wait before trying again." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limitResult.limit.toString(),
            "X-RateLimit-Remaining": limitResult.remaining.toString(),
            "X-RateLimit-Reset": limitResult.reset.toString(),
          },
        },
      );
    }

    const body = await req.json();

    // 1. Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, message } = result.data;

    // 2. Setup Nodemailer Transporter using unified ENV variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Define Email Options
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sent to your configured admin email
      replyTo: email, // Reply-To set to visitor's email
      subject: `[Portfolio Signal] Transmission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; background: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #cba6f7; border-bottom: 2px solid #cba6f7; padding-bottom: 10px;">New Transmission Received</h2>
          <p><strong>Identity:</strong> ${name}</p>
          <p><strong>Signal (Email):</strong> ${email}</p>
          <div style="margin-top: 20px; padding: 15px; background: white; border-left: 4px solid #cba6f7; border-radius: 5px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">Sent from Bharat Dangi's Portfolio</p>
        </div>
      `,
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Transmission successfully received" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Failed to process transmission." },
      { status: 500 },
    );
  }
}
