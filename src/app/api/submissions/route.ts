import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getNextSubmissionNumber } from "@/app/lib/submissionCounter";
import { emailService } from "@/app/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      nickname,
      phoneNumber,
      category,
      songName,
      songMinutes,
      songSeconds,
      youtubeLink,
      hasBackdancers,
      participants,
      participantSubmissionNumbers,
      hasProps,
      usingBackground,
      comment,
      userId,
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !nickname ||
      !phoneNumber ||
      !category ||
      !songName ||
      !youtubeLink ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone number format (Ukrainian format: 0971856972)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            "Номер телефону має бути у форматі 0971856972 (10 цифр, починаючи з 0)",
        },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["solo", "duo/trio", "team", "unformat"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Validate song duration
    if (songMinutes < 0 || songSeconds < 0 || songSeconds >= 60) {
      return NextResponse.json(
        { error: "Invalid song duration" },
        { status: 400 }
      );
    }

    // Validate participant submission numbers don't exceed 4
    if (
      participantSubmissionNumbers &&
      participantSubmissionNumbers.some((num: number) => num > 4)
    ) {
      return NextResponse.json(
        { error: "Кількість номерів учасника не може перевищувати 4" },
        { status: 400 }
      );
    }

    // Get next submission number
    const submissionNumber = await getNextSubmissionNumber();

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        submissionNumber,
        name,
        nickname,
        phoneNumber,
        category,
        songName,
        songMinutes: parseInt(songMinutes),
        songSeconds: parseInt(songSeconds),
        youtubeLink,
        hasBackdancers: hasBackdancers || false,
        participants: participants || [],
        participantSubmissionNumbers: participantSubmissionNumbers || [],
        hasProps: hasProps || false,
        usingBackground: usingBackground || false,
        comment: comment || null,
        userId,
      },
    });

    // Send confirmation email
    try {
      // Get user email for sending confirmation
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user) {
        await emailService.sendSubmissionConfirmation({
          userEmail: user.email,
          userName: user.name,
          submissionNumber,
          category,
          songName,
          participants: participants || [],
        });
        console.log(
          `Confirmation email sent to ${user.email} for submission #${submissionNumber}`
        );
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json(
      {
        message: "Submission created successfully",
        submission: {
          ...submission,
          submissionNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        adminComments: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
