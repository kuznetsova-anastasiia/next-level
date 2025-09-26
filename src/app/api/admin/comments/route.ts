import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { emailService } from "@/app/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const { submissionId, content } = await request.json();

    if (!submissionId || !content) {
      return NextResponse.json(
        { error: "Submission ID and content are required" },
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

    // For now, we'll use a hardcoded admin ID. In a real app, you'd get this from the session
    // You should create an admin user in your database and use their ID here
    const adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
      select: { id: true },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "No admin user found" },
        { status: 500 }
      );
    }

    // Create the admin comment
    const comment = await prisma.adminComment.create({
      data: {
        content,
        submissionId,
        adminId: adminUser.id,
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
        adminName: comment.admin.name,
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
