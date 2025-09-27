import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { emailService } from "@/app/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const { submissionId, content, adminId } = await request.json();

    if (!submissionId || !content || !adminId) {
      return NextResponse.json(
        { error: "Submission ID, content, and admin ID are required" },
        { status: 400 }
      );
    }

    // Get the submission and user info
    const submission = await prisma.submission.findUnique({
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

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Verify the admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      select: { id: true, name: true, role: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Invalid admin user" },
        { status: 403 }
      );
    }

    // Create the admin comment
    const comment = await prisma.adminComment.create({
      data: {
        content,
        submissionId,
        adminId: adminId,
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Send email notification about the new comment
    try {
      await emailService.sendCommentNotification({
        userEmail: submission.user.email,
        userName: submission.user.name,
        submissionNumber: submission.submissionNumber,
        commentContent: content,
        adminName: adminUser.name,
      });
      console.log(
        `Comment notification email sent to ${submission.user.email}`
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
