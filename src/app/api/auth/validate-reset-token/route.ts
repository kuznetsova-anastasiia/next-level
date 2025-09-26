import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Токен скидання пароля не надано" },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Недійсне посилання для скидання пароля" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Посилання для скидання пароля застаріло" },
        { status: 400 }
      );
    }

    // Check if token is already used
    if (resetToken.used) {
      return NextResponse.json(
        { error: "Посилання для скидання пароля вже використано" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Токен валідний",
      user: {
        id: resetToken.user.id,
        name: resetToken.user.name,
        email: resetToken.user.email,
      },
    });
  } catch (error) {
    console.error("Validate reset token error:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
