import Airtable from "airtable";

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

// Get the base and table
const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const submissionsTable = base(
  process.env.AIRTABLE_SUBMISSIONS_TABLE_NAME || "Submissions"
);

export interface AirtableSubmission {
  id: string;
  fields: {
    "Submission Number": number;
    Name: string;
    Nickname: string;
    "Phone Number": string;
    Category: string;
    "Song Name": string;
    "Song Duration": string;
    "Google Drive Link": string;
    "Has Backdancers": boolean;
    "Participants with Submissions": string;
    "Has Props": boolean;
    "Using Background": boolean;
    Comment: string;
    Status: string;
    Level: string;
    "User Email": string;
    "Created At": string;
    "Updated At": string;
  };
}

interface SubmissionData {
  submissionNumber: number;
  name: string;
  nickname: string;
  phoneNumber: string;
  category: string;
  songName: string;
  songMinutes: number;
  songSeconds: number;
  youtubeLink: string;
  hasBackdancers: boolean;
  participants: string[];
  participantSubmissionNumbers: number[];
  hasProps: boolean;
  usingBackground: boolean;
  comment?: string;
  level?: string;
  userEmail: string;
}

export class AirtableService {
  // Create a new submission in Airtable
  static async createSubmission(submissionData: SubmissionData) {
    try {
      const airtableRecord = await submissionsTable.create({
        "Submission Number": submissionData.submissionNumber,
        Name: submissionData.name,
        Nickname: submissionData.nickname,
        "Phone Number": submissionData.phoneNumber,
        Category: submissionData.category,
        "Song Name": submissionData.songName,
        "Song Duration": `${
          submissionData.songMinutes
        }:${submissionData.songSeconds.toString().padStart(2, "0")}`,
        "YouTube Link": submissionData.youtubeLink,
        "Has Backdancers": submissionData.hasBackdancers,
        "Participants with Submissions": submissionData.participants
          .map((participant, index) => {
            const submissionCount =
              submissionData.participantSubmissionNumbers[index] || 0;
            return `${participant} (${submissionCount})`;
          })
          .join(", "),
        "Has Props": submissionData.hasProps,
        "Using Background": submissionData.usingBackground,
        Comment: submissionData.comment || "",
        "User Email": submissionData.userEmail,
        "Created At": new Date().toISOString(),
        "Updated At": new Date().toISOString(),
      });

      return airtableRecord;
    } catch (error) {
      console.error("Error creating Airtable submission:", error);
      throw error;
    }
  }

  // Get all submissions from Airtable
  static async getAllSubmissions(): Promise<AirtableSubmission[]> {
    try {
      const records = await submissionsTable.select().all();
      return records.map((record) => ({
        id: record.id,
        fields: record.fields as AirtableSubmission["fields"],
      }));
    } catch (error) {
      console.error("Error fetching Airtable submissions:", error);
      throw error;
    }
  }

  // Get submission by ID from Airtable
  static async getSubmissionById(
    airtableId: string
  ): Promise<AirtableSubmission | null> {
    try {
      const record = await submissionsTable.find(airtableId);
      return {
        id: record.id,
        fields: record.fields as AirtableSubmission["fields"],
      };
    } catch (error) {
      console.error("Error fetching Airtable submission by ID:", error);
      return null;
    }
  }

  // Update submission status in Airtable
  static async updateSubmissionStatus(airtableId: string, status: string) {
    try {
      const record = await submissionsTable.update(airtableId, {
        Status: status,
        "Updated At": new Date().toISOString(),
      });
      return record;
    } catch (error) {
      console.error("Error updating Airtable submission status:", error);
      throw error;
    }
  }

  // Update submission level in Airtable
  static async updateSubmissionLevel(airtableId: string, level: string) {
    try {
      const record = await submissionsTable.update(airtableId, {
        Level: level,
        "Updated At": new Date().toISOString(),
      });
      return record;
    } catch (error) {
      console.error("Error updating Airtable submission level:", error);
      throw error;
    }
  }

  // Update submission in Airtable
  static async updateSubmission(
    airtableId: string,
    submissionData: SubmissionData
  ) {
    try {
      const record = await submissionsTable.update(airtableId, {
        Name: submissionData.name,
        Nickname: submissionData.nickname,
        "Phone Number": submissionData.phoneNumber,
        Category: submissionData.category,
        "Song Name": submissionData.songName,
        "Song Duration": `${
          submissionData.songMinutes
        }:${submissionData.songSeconds.toString().padStart(2, "0")}`,
        "YouTube Link": submissionData.youtubeLink,
        "Has Backdancers": submissionData.hasBackdancers,
        "Participants with Submissions": submissionData.participants
          .map((participant, index) => {
            const submissionCount =
              submissionData.participantSubmissionNumbers[index] || 0;
            return `${participant} (${submissionCount})`;
          })
          .join(", "),
        "Has Props": submissionData.hasProps,
        "Using Background": submissionData.usingBackground,
        Comment: submissionData.comment || "",
        Level: submissionData.level || "",
        "Updated At": new Date().toISOString(),
      });
      return record;
    } catch (error) {
      console.error("Error updating Airtable submission:", error);
      throw error;
    }
  }

  // Delete submission from Airtable
  static async deleteSubmission(airtableId: string) {
    try {
      const record = await submissionsTable.destroy(airtableId);
      return record;
    } catch (error) {
      console.error("Error deleting Airtable submission:", error);
      throw error;
    }
  }
}

export default airtable;
