import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import crypto from "crypto";
import { emailService } from "@/app/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email адреса обов'язкова" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message:
          "Якщо акаунт з таким email існує, ми надіслали вам посилання для скидання пароля.",
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id },
      data: { used: true },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail({
        userEmail: user.email,
        userName: user.name,
        resetToken: token,
      });
      console.log(`Password reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email sending fails
      // The user will still get a success message for security reasons
    }

    return NextResponse.json({
      message:
        "Якщо акаунт з таким email існує, ми надіслали вам посилання для скидання пароля.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
