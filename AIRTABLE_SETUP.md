# Airtable Integration Setup

This document explains how to set up Airtable integration for managing submission statuses.

## Environment Variables

Add these variables to your `.env.local` file:

```env
# Airtable Configuration
AIRTABLE_API_KEY="your_airtable_api_key_here"
AIRTABLE_BASE_ID="your_airtable_base_id_here"
AIRTABLE_SUBMISSIONS_TABLE_NAME="Submissions"
```

## Airtable Setup

### 1. Create Airtable Base

1. Go to [Airtable](https://airtable.com) and create a new base
2. Name it "Submissions" or your preferred name
3. Copy the Base ID from the URL (starts with `app...`)

### 2. Create Submissions Table

Create a table with the following fields:

| Field Name                    | Field Type       | Description                                                                |
| ----------------------------- | ---------------- | -------------------------------------------------------------------------- |
| Submission Number             | Number           | Auto-generated submission number                                           |
| Name                          | Single line text | Full name of submitter                                                     |
| Nickname                      | Single line text | Nickname or team name                                                      |
| Phone Number                  | Phone number     | Contact phone number                                                       |
| Category                      | Single select    | solo, duo/trio, team, unformat                                             |
| Song Name                     | Single line text | Name of the song                                                           |
| Song Duration                 | Single line text | Duration in format "MM:SS" (e.g., "3:45")                                  |
| Google Drive Link             | URL              | Link to Google Drive files                                                 |
| Has Backdancers               | Checkbox         | Whether solo has backdancers                                               |
| Participants with Submissions | Long text        | Participants with submission counts in format "Name (Count), Name (Count)" |
| Has Props                     | Checkbox         | Whether performance has props                                              |
| Using Background              | Checkbox         | Whether using background video/photo                                       |
| Comment                       | Long text        | Additional comments                                                        |
| Status                        | Single select    | pending, payment, accepted, rejected                                       |
| Level                         | Single select    | pro, middle, new (set by organizers)                                       |
| User Email                    | Email            | Email of the submitter                                                     |
| Created At                    | Date             | When submission was created                                                |
| Updated At                    | Date             | When submission was last updated                                           |

### 3. Get API Key

1. Go to [Airtable Account](https://airtable.com/account)
2. Generate a new Personal Access Token
3. Copy the token to your environment variables

## How It Works

### Data Flow

1. **User submits form** → Data saved to MongoDB
2. **Auto-sync to Airtable** → Submission appears in Airtable
3. **Organizers manage in Airtable** → Change statuses, add notes
4. **Status sync back to MongoDB** → Users see updated statuses

### Sync Operations

#### Automatic Sync

- New submissions are automatically synced to Airtable
- Status changes in Airtable are reflected in the user interface

#### Manual Sync (for organizers)

- `POST /api/sync/airtable` with `action: "sync_all"` - Sync all data from Airtable
- `POST /api/sync/airtable` with `action: "sync_submission"` - Sync specific submission
- `POST /api/sync/airtable` with `action: "sync_status"` - Sync status from Airtable

### Status Management

Organizers can change submission statuses in Airtable:

- **pending** - Newly submitted, awaiting review
- **payment** - Submission accepted, awaiting payment
- **accepted** - Submission fully accepted
- **rejected** - Submission declined

### Level Management

Organizers can set participant levels in Airtable:

- **pro** - Professional level
- **middle** - Intermediate level
- **new** - Beginner level

## Database Schema Updates

The MongoDB schema has been updated to include:

- `airtableId` - Links MongoDB record to Airtable record
- Automatic sync on submission creation
- Status updates from Airtable

## Troubleshooting

### Common Issues

1. **Airtable sync fails** - Check API key and base ID
2. **Status not updating** - Run manual sync or check Airtable permissions
3. **Missing fields** - Ensure Airtable table has all required fields

### Testing

1. Create a test submission
2. Check if it appears in Airtable
3. Change status in Airtable
4. Verify status updates in the user interface

## Security Notes

- Keep your Airtable API key secure
- Use environment variables for all sensitive data
- Consider setting up Airtable webhooks for real-time updates
