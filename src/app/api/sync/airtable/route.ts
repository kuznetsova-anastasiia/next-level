import { NextRequest, NextResponse } from "next/server";
import { SyncService } from "@/app/lib/syncService";

export async function POST(request: NextRequest) {
  try {
    const { action, submissionId, airtableId } = await request.json();

    switch (action) {
      case "sync_all":
        // Sync all submissions from Airtable to MongoDB
        const syncedCount = await SyncService.syncAllFromAirtable();
        return NextResponse.json({
          message: `Synced ${syncedCount} submissions from Airtable`,
          syncedCount,
        });

      case "sync_submission":
        // Sync a specific submission to Airtable
        if (!submissionId) {
          return NextResponse.json(
            { error: "Submission ID is required for sync_submission action" },
            { status: 400 }
          );
        }
        const airtableId = await SyncService.syncSubmissionToAirtable(
          submissionId
        );
        return NextResponse.json({
          message: "Submission synced to Airtable",
          airtableId,
        });

      case "sync_status":
        // Sync status from Airtable to MongoDB
        if (!airtableId) {
          return NextResponse.json(
            { error: "Airtable ID is required for sync_status action" },
            { status: 400 }
          );
        }
        const updatedSubmission = await SyncService.syncStatusFromAirtable(
          airtableId
        );
        return NextResponse.json({
          message: "Status synced from Airtable",
          submission: updatedSubmission,
        });

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Use 'sync_all', 'sync_submission', or 'sync_status'",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get sync status - could be used to check if sync is needed
    return NextResponse.json({
      message: "Sync API is running",
      availableActions: ["sync_all", "sync_submission", "sync_status"],
    });
  } catch (error) {
    console.error("Sync status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
