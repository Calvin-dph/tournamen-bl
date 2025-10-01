import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "YOUR_SPREADSHEET_ID";

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

export async function GET() {
  try {
    const sheets = await getGoogleAuth();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Pendaftaran TI Billiard CUP!A:K',
    });

    const values = response.data.values || [];

    let registrations: RegistrationData[] = [];
    if (values.length > 1) {
      registrations = values.slice(1).map((row: string[], index: number) => ({
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
        rowIndex: index + 2, // +2 because index is 0-based and we skip header row
      }));
    }

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
    const { email, registrationData } = body;
    console.log('Received POST request with body:', registrationData);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
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
    const { bidang, teamA1, teamB1, phoneA1, teamA2, teamB2, phoneA2, phoneB1, phoneB2 } = registrationData;
    console.log('bidang, teamA1, teamB1, phoneA1:', bidang, teamA1, teamB1, phoneA1); if (!bidang || !teamA1 || !phoneA1 || !teamA2 || !phoneA2) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: bidang, teamA1, phoneA1, teamA2, phoneA2' },
        { status: 400 }
      );
    }

    // First, check if email already exists
    const sheets = await getGoogleAuth();

    const checkResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Pendaftaran TI Billiard CUP!A:K',
    });

    const checkValues = checkResponse.data.values || [];
    console.log('Check data:', checkValues);

    let existingRowIndex: number | null = null;
    if (checkValues.length > 1) {
      const registrations = checkValues.slice(1);
      const existingIndex = registrations.findIndex((row: string[]) =>
        row[1] && row[1].toLowerCase() === email.toLowerCase()
      );
      if (existingIndex !== -1) {
        existingRowIndex = existingIndex + 2; // +2 because of 0-based index and header row
      }
    }

    const timestamp = new Date().toISOString();
    const values = [
      [timestamp, email, bidang, teamA1, phoneA1, teamA2 || '', phoneA2 || '', teamB1 || '', phoneB1 || '', teamB2 || '', phoneB2 || '']
    ];

    let updateResult;
    if (existingRowIndex) {
      // Update existing row
      const range = `Pendaftaran TI Billiard CUP!A${existingRowIndex}:K${existingRowIndex}`;
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
        range: 'Pendaftaran TI Billiard CUP!A:K',
        valueInputOption: 'RAW',
        requestBody: {
          values: values
        }
      });
      console.log('Append result:', updateResult.data);
    }

    // Save to database as well (for admin management)
    await saveToDatabase({
      email,
      bidang,
      teamA1,
      phoneA1,
      teamA2: teamA2 || '',
      phoneA2: phoneA2 || '',
      teamB1: teamB1 || '',
      phoneB1: phoneB1 || '',
      teamB2: teamB2 || '',
      phoneB2: phoneB2 || ''
    }, existingRowIndex ? 'updated' : 'created');

    return NextResponse.json({
      success: true,
      action: existingRowIndex ? 'updated' : 'created',
      registration: {
        timestamp,
        email,
        bidang,
        teamA1,
        phoneA1,
        teamA2: teamA2 || '',
        phoneA2: phoneA2 || '',
        teamB1: teamB1 || '',
        phoneB1: phoneB1 || '',
        teamB2: teamB2 || '',
        phoneB2: phoneB2 || '',
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

// Helper function to save registration to database
async function saveToDatabase(registrationData: {
  email: string;
  bidang: string;
  teamA1: string;
  phoneA1: string;
  teamA2: string;
  phoneA2: string;
  teamB1: string;
  phoneB1: string;
  teamB2: string;
  phoneB2: string;
}, action: 'created' | 'updated') {
  try {
    const dbData = {
      email: registrationData.email.toLowerCase(),
      bidang: registrationData.bidang,
      team_a1: registrationData.teamA1,
      phone_a1: registrationData.phoneA1,
      team_a2: registrationData.teamA2 || null,
      phone_a2: registrationData.phoneA2 || null,
      team_b1: registrationData.teamB1 || null,
      phone_b1: registrationData.phoneB1 || null,
      team_b2: registrationData.teamB2 || null,
      phone_b2: registrationData.phoneB2 || null,
      status: 'pending'
    };

    if (action === 'updated') {
      // Try to update existing record
      const { error } = await supabase
        .from('registrations')
        .update(dbData)
        .eq('email', dbData.email)
        .select()
        .single();

      if (error && error.code === 'PGRST116') {
        // Record doesn't exist, create it
        const { error: insertError } = await supabase
          .from('registrations')
          .insert([dbData]);
        
        if (insertError) {
          console.error('Error inserting to database:', insertError);
        }
      } else if (error) {
        console.error('Error updating database:', error);
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('registrations')
        .insert([dbData]);
      
      if (error) {
        console.error('Error inserting to database:', error);
      }
    }
  } catch (error) {
    console.error('Error saving to database:', error);
  }
}