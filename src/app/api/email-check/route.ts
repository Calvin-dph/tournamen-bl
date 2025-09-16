import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = '1nKMVP2UqA-61JC97dcHB4yy1EkQdXE0RYiH3iHGdtXY';

// Google Service Account credentials
const getGoogleAuth = async () => {
    const auth = await google.auth.getClient({
        projectId: process.env.GOOGLE_PROJECT_ID || "YOUR_PROJECT_ID",
        credentials: {
            type: "service_account",
            project_id: process.env.GOOGLE_PROJECT_ID || "YOUR_PROJECT_ID",
            private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID || "YOUR_PRIVATE_KEY_ID",
            private_key: (process.env.GOOGLE_PRIVATE_KEY || "YOUR_PRIVATE_KEY").replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_CLIENT_EMAIL || "YOUR_CLIENT_EMAIL",
            universe_domain: "googleapis.com"
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: 'v4', auth });
};

export interface RegistrationData {
    timestamp: string;
    email: string;
    bidang: string;
    teamA1: string;
    teamB1: string;
    phoneA1: string;
    teamA2: string;
    teamB2: string;
    phoneA2: string;
    phoneB1: string;
    phoneB2: string;
    rowIndex: number;
}

// GET - Fetch all existing emails for client-side validation
export async function GET() {
    try {
        const sheets = await getGoogleAuth();

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Pendaftaran TI Billiard CUP!B:B', // Only email column
        });

        const values = response.data.values || [];

        // Extract emails (skip header)
        const emails = values.slice(1)
            .map(row => row[0])
            .filter(email => email && email.trim() !== '')
            .map(email => email.toLowerCase().trim());

        return NextResponse.json({
            success: true,
            emails: [...new Set(emails)] // Remove duplicates
        });
    } catch (error) {
        console.error('Error fetching emails:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch emails'
            },
            { status: 500 }
        );
    }
}

// POST - Check specific email and return full registration data if exists
export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            );
        }

        const sheets = await getGoogleAuth();

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Pendaftaran TI Billiard CUP!A:K',
        });

        const values = response.data.values || [];

        let existingRegistration: RegistrationData | null = null;
        if (values.length > 1) {
            const registrations = values.slice(1).map((row: string[], index: number) => ({
                timestamp: row[0] || '',
                email: row[1] || '',
                bidang: row[2] || '',
                teamA1: row[3] || '',
                phoneA1: row[4] || '',
                teamA2: row[5] || '',
                phoneA2: row[6] || '',
                teamB1: row[7] || '',
                phoneB1: row[8] || '',
                teamB2: row[9] || '',
                phoneB2: row[10] || '',
                rowIndex: index + 2,
            }));

            existingRegistration = registrations.find((reg: RegistrationData) =>
                reg.email.toLowerCase() === email.toLowerCase()
            ) || null;
        }

        return NextResponse.json({
            success: true,
            exists: !!existingRegistration,
            registration: existingRegistration
        });
    } catch (error) {
        console.error('Error checking email:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to check email'
            },
            { status: 500 }
        );
    }
}