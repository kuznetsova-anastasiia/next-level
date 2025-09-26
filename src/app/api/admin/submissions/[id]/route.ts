import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = params.id;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
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
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = params.id;
    const { status, level, adminId } = await request.json();

    // Get the current submission to track changes
    const currentSubmission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!currentSubmission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Update the submission
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        ...(status && { status }),
        ...(level !== undefined && { level }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
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
    });

    // Send email notification if status or level changed
    if (
      (status && status !== currentSubmission.status) ||
      (level !== undefined && level !== currentSubmission.level)
    ) {
      try {
        const { emailService } = await import("@/app/lib/emailService");
        await emailService.sendStatusUpdateNotification({
          userEmail: currentSubmission.user.email,
          userName: currentSubmission.user.name,
          submissionNumber: currentSubmission.submissionNumber,
          oldStatus: currentSubmission.status,
          newStatus: status || currentSubmission.status,
          oldLevel: currentSubmission.level,
          newLevel: level !== undefined ? level : currentSubmission.level,
        });
        console.log(
          `Status update email sent to ${currentSubmission.user.email} for submission #${currentSubmission.submissionNumber}`
        );
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the request if email sending fails
      }
    }

    return NextResponse.json({ submission: updatedSubmission });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
