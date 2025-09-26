import { NextResponse } from "next/server";
import { emailService } from "@/app/lib/emailService";

export async function GET() {
  try {
    console.log("Testing email service...");

    // Test email connection
    const isConnected = await emailService.testEmailConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          error: "Email service connection failed",
          details: "Check your SMTP configuration and environment variables",
        },
        { status: 500 }
      );
    }

    // Test sending a simple email
    try {
      await emailService.sendPasswordResetEmail({
        userEmail: "test@example.com",
        userName: "Test User",
        resetToken: "test-token-123",
      });

      return NextResponse.json({
        success: true,
        message: "Email service is working correctly",
        connectionStatus: "Connected",
      });
    } catch (emailError) {
      return NextResponse.json(
        {
          error: "Email sending failed",
          details:
            emailError instanceof Error ? emailError.message : "Unknown error",
          connectionStatus: "Connected but sending failed",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      {
        error: "Email service test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        environmentCheck: {
          SMTP_HOST: process.env.SMTP_HOST ? "SET" : "NOT SET",
          SMTP_PORT: process.env.SMTP_PORT ? "SET" : "NOT SET",
          SMTP_SECURE: process.env.SMTP_SECURE ? "SET" : "NOT SET",
          SMTP_USER: process.env.SMTP_USER ? "SET" : "NOT SET",
          SMTP_PASS: process.env.SMTP_PASS ? "SET" : "NOT SET",
        },
      },
      { status: 500 }
    );
  }
}
