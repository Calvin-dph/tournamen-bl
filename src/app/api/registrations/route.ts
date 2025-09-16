import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = '1nKMVP2UqA-61JC97dcHB4yy1EkQdXE0RYiH3iHGdtXY';

// Google Service Account credentials - will be provided later
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
  bidang: string;
  teamA1: string;
  phoneA1: string;
  teamA2: string;
  phoneA2: string;
  teamB1: string;
  phoneB1: string;
  teamB2: string;
  phoneB2: string;
  rowIndex: number;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bidang = url.searchParams.get('bidang');

    const sheets = await getGoogleAuth();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Pendaftaran TI Billiard CUP!A:J',
    });

    const values = response.data.values || [];

    let registrations: RegistrationData[] = [];
    if (values.length > 1) {
      registrations = values.slice(1).map((row: string[], index: number) => ({
        timestamp: row[0] || '',
        bidang: row[1] || '',
        teamA1: row[2] || '',
        phoneA1: row[3] || '',
        teamA2: row[4] || '',
        phoneA2: row[5] || '',
        teamB1: row[6] || '',
        phoneB1: row[7] || '',
        teamB2: row[8] || '',
        phoneB2: row[9] || '',
        rowIndex: index + 2, // +2 because index is 0-based and we skip header row
      }));
    }

    // If bidang query parameter is provided, return specific registration
    if (bidang) {
      const foundRegistration = registrations.find(reg =>
        reg.bidang.toLowerCase() === bidang.toLowerCase()
      );

      return NextResponse.json({
        success: true,
        registration: foundRegistration || null
      });
    }

    // Otherwise return all registrations
    return NextResponse.json({
      success: true,
      registrations
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch registrations'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bidang, registrationData } = body;
    console.log('Received POST request with body:', { bidang, registrationData });

    if (!bidang) {
      return NextResponse.json(
        { success: false, error: 'Bidang is required' },
        { status: 400 }
      );
    }

    if (!registrationData) {
      return NextResponse.json(
        { success: false, error: 'Registration data is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { teamA1, teamA2, phoneA1, phoneA2 } = registrationData;
    console.log('teamA1, teamA2, phoneA1, phoneA2:', teamA1, teamA2, phoneA1, phoneA2);

    if (!teamA1 || !phoneA1 || !teamA2 || !phoneA2) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: teamA1, phoneA1, teamA2, phoneA2' },
        { status: 400 }
      );
    }

    // First, check if bidang already exists
    const sheets = await getGoogleAuth();

    const checkResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Pendaftaran TI Billiard CUP!A:J',
    });

    const checkValues = checkResponse.data.values || [];
    console.log('Check data:', checkValues);

    let existingRowIndex: number | null = null;
    if (checkValues.length > 1) {
      const registrations = checkValues.slice(1);
      const existingIndex = registrations.findIndex((row: string[]) =>
        row[1] && row[1].toLowerCase() === bidang.toLowerCase()
      );
      if (existingIndex !== -1) {
        existingRowIndex = existingIndex + 2; // +2 because of 0-based index and header row
      }
    }

    const timestamp = new Date().toISOString();
    const values = [
      [
        timestamp,
        bidang,
        registrationData.teamA1,
        registrationData.phoneA1,
        registrationData.teamA2,
        registrationData.phoneA2,
        registrationData.teamB1 || '',
        registrationData.phoneB1 || '',
        registrationData.teamB2 || '',
        registrationData.phoneB2 || ''
      ]
    ];

    let updateResult;
    if (existingRowIndex) {
      // Update existing row
      const range = `Pendaftaran TI Billiard CUP!A${existingRowIndex}:J${existingRowIndex}`;
      updateResult = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
          values: values
        }
      });
      console.log('Update result:', updateResult.data);
    } else {
      // Append new row
      updateResult = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Pendaftaran TI Billiard CUP!A:J',
        valueInputOption: 'RAW',
        requestBody: {
          values: values
        }
      });
      console.log('Append result:', updateResult.data);
    }

    return NextResponse.json({
      success: true,
      action: existingRowIndex ? 'updated' : 'created',
      registration: {
        timestamp,
        bidang,
        teamA1: registrationData.teamA1,
        phoneA1: registrationData.phoneA1,
        teamA2: registrationData.teamA2,
        phoneA2: registrationData.phoneA2,
        teamB1: registrationData.teamB1 || '',
        phoneB1: registrationData.phoneB1 || '',
        teamB2: registrationData.teamB2 || '',
        phoneB2: registrationData.phoneB2 || '',
        rowIndex: existingRowIndex || 0
      }
    });

  } catch (error) {
    console.error('Error in registrations API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process registration request'
      },
      { status: 500 }
    );
  }
}