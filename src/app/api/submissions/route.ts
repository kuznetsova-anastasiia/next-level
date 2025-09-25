import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getNextSubmissionNumber } from "@/app/lib/submissionCounter";
import { SyncService } from "@/app/lib/syncService";

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

    // Validate YouTube link format
    const youtubeRegex = /^https:\/\/(www\.)?youtube\.com\/watch\?v=.+/;
    if (!youtubeRegex.test(youtubeLink)) {
      return NextResponse.json(
        {
          error:
            "Посилання має бути у форматі YouTube (https://www.youtube.com/watch?v=...)",
        },
        { status: 400 }
      );
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

    // Sync to Airtable
    try {
      await SyncService.syncSubmissionToAirtable(submission.id);
    } catch (airtableError) {
      console.error("Airtable sync failed:", airtableError);
      // Don't fail the request if Airtable sync fails
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
      orderBy: { createdAt: "desc" },
    });

    // Get current status from Airtable for each submission
    const submissionsWithCurrentStatus = await Promise.all(
      submissions.map(async (submission) => {
        if (submission.airtableId) {
          try {
            const currentSubmission =
              await SyncService.getSubmissionWithCurrentStatus(submission.id);
            return currentSubmission || submission;
          } catch (error) {
            console.error(
              "Error getting current status for submission:",
              submission.id,
              error
            );
            return submission;
          }
        }
        return submission;
      })
    );

    return NextResponse.json({ submissions: submissionsWithCurrentStatus });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
