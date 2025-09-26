import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/app/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Всі поля є обов'язковими" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Неправильний формат email адреси" },
        { status: 400 }
      );
    }

    // Send contact email
    try {
      await emailService.sendContactEmail({
        senderName: name,
        senderEmail: email,
        subject,
        message,
      });

      return NextResponse.json({
        message: "Повідомлення успішно надіслано",
      });
    } catch (emailError) {
      console.error("Error sending contact email:", emailError);
      return NextResponse.json(
        { error: "Помилка надсилання email. Спробуйте пізніше." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
