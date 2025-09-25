import prisma from "./db";

export async function getNextSubmissionNumber(): Promise<number> {
  try {
    // Get the highest existing submission number
    const lastSubmission = await prisma.submission.findFirst({
      orderBy: { submissionNumber: "desc" },
      select: { submissionNumber: true },
    });

    // Return next number (1 if no submissions exist)
    return lastSubmission ? lastSubmission.submissionNumber + 1 : 1;
  } catch (error) {
    console.error("Error getting next submission number:", error);
    // Fallback: use timestamp as submission number
    return Date.now();
  }
}
