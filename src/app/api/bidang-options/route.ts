import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "YOUR_SPREADSHEET_ID";

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

export async function GET() {
  try {
    const sheets = await getGoogleAuth();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Bidang Opsi!A:A',
    });

    const values = response.data.values || [];

    let options: string[] = [];
    if (values.length > 1) {
      options = values.slice(1).map((row: string[]) => row[0]).filter(Boolean);
    }

    return NextResponse.json({
      success: true,
      options
    });
  } catch (error) {
    console.error('Error fetching bidang options:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil opsi bidang'
      },
      { status: 500 }
    );
  }
}