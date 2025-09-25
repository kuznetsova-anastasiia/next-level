import prisma from "./db";
import { AirtableService } from "./airtable";

export class SyncService {
  // Sync submission from MongoDB to Airtable
  static async syncSubmissionToAirtable(submissionId: string) {
    try {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { user: true },
      });

      if (!submission) {
        throw new Error("Submission not found");
      }

      // Prepare submission data for Airtable
      const submissionData = {
        submissionNumber: submission.submissionNumber,
        name: submission.name,
        nickname: submission.nickname,
        phoneNumber: submission.phoneNumber,
        category: submission.category,
        songName: submission.songName,
        songMinutes: submission.songMinutes,
        songSeconds: submission.songSeconds,
        youtubeLink: submission.youtubeLink,
        hasBackdancers: submission.hasBackdancers,
        participants: submission.participants,
        participantSubmissionNumbers: submission.participantSubmissionNumbers,
        hasProps: submission.hasProps,
        usingBackground: submission.usingBackground,
        comment: submission.comment || undefined,
        level: submission.level || undefined,
        userEmail: submission.user.email,
      };

      // If already synced, update existing record
      if (submission.airtableId) {
        await AirtableService.updateSubmission(
          submission.airtableId,
          submissionData
        );
        return submission.airtableId;
      }

      // Create new Airtable record
      const airtableRecord = await AirtableService.createSubmission(
        submissionData
      );

      // Update MongoDB with Airtable ID
      await prisma.submission.update({
        where: { id: submissionId },
        data: { airtableId: airtableRecord.id },
      });

      return airtableRecord.id;
    } catch (error) {
      console.error("Error syncing submission to Airtable:", error);
      throw error;
    }
  }

  // Sync status from Airtable to MongoDB
  static async syncStatusFromAirtable(airtableId: string) {
    try {
      const airtableSubmission = await AirtableService.getSubmissionById(
        airtableId
      );

      if (!airtableSubmission) {
        throw new Error("Airtable submission not found");
      }

      // Update MongoDB with new status and level
      const updatedSubmission = await prisma.submission.update({
        where: { airtableId },
        data: {
          status: airtableSubmission.fields.Status,
          level: airtableSubmission.fields.Level || null,
          updatedAt: new Date(),
        },
      });

      return updatedSubmission;
    } catch (error) {
      console.error("Error syncing status from Airtable:", error);
      throw error;
    }
  }

  // Sync all submissions from Airtable to MongoDB
  static async syncAllFromAirtable() {
    try {
      const airtableSubmissions = await AirtableService.getAllSubmissions();

      for (const airtableSubmission of airtableSubmissions) {
        await prisma.submission.upsert({
          where: { airtableId: airtableSubmission.id },
          update: {
            status: airtableSubmission.fields.Status,
            level: airtableSubmission.fields.Level || null,
            updatedAt: new Date(),
          },
          create: {
            submissionNumber: airtableSubmission.fields["Submission Number"],
            name: airtableSubmission.fields.Name,
            nickname: airtableSubmission.fields.Nickname,
            phoneNumber: airtableSubmission.fields["Phone Number"],
            category: airtableSubmission.fields.Category,
            songName: airtableSubmission.fields["Song Name"],
            songMinutes: parseInt(
              airtableSubmission.fields["Song Duration"].split(":")[0]
            ),
            songSeconds: parseInt(
              airtableSubmission.fields["Song Duration"].split(":")[1]
            ),
            youtubeLink: airtableSubmission.fields["YouTube Link"],
            hasBackdancers: airtableSubmission.fields["Has Backdancers"],
            participants: airtableSubmission.fields[
              "Participants with Submissions"
            ]
              .split(", ")
              .filter((p) => p.trim())
              .map((p) => p.split(" (")[0].trim()),
            participantSubmissionNumbers: airtableSubmission.fields[
              "Participants with Submissions"
            ]
              .split(", ")
              .filter((p) => p.trim())
              .map((p) => {
                const match = p.match(/\((\d+)\)/);
                return match ? parseInt(match[1]) : 0;
              }),
            hasProps: airtableSubmission.fields["Has Props"],
            usingBackground: airtableSubmission.fields["Using Background"],
            comment: airtableSubmission.fields.Comment || null,
            status: airtableSubmission.fields.Status,
            level: airtableSubmission.fields.Level || null,
            airtableId: airtableSubmission.id,
            userId: "000000000000000000000000", // Placeholder ObjectId - this should be handled properly in production
            createdAt: new Date(airtableSubmission.fields["Created At"]),
            updatedAt: new Date(airtableSubmission.fields["Updated At"]),
          },
        });
      }

      return airtableSubmissions.length;
    } catch (error) {
      console.error("Error syncing all from Airtable:", error);
      throw error;
    }
  }

  // Get submission with current status from Airtable
  static async getSubmissionWithCurrentStatus(submissionId: string) {
    try {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { user: true },
      });

      if (!submission || !submission.airtableId) {
        return submission;
      }

      // Get latest status from Airtable
      const airtableSubmission = await AirtableService.getSubmissionById(
        submission.airtableId
      );

      if (airtableSubmission) {
        // Update local status and level if different
        if (
          submission.status !== airtableSubmission.fields.Status ||
          submission.level !== (airtableSubmission.fields.Level || null)
        ) {
          await prisma.submission.update({
            where: { id: submissionId },
            data: {
              status: airtableSubmission.fields.Status,
              level: airtableSubmission.fields.Level || null,
              updatedAt: new Date(),
            },
          });

          submission.status = airtableSubmission.fields.Status;
          submission.level = airtableSubmission.fields.Level || null;
        }
      }

      return submission;
    } catch (error) {
      console.error("Error getting submission with current status:", error);
      throw error;
    }
  }
}
