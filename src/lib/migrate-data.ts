/**
 * Data Migration Script: Google Sheets to Database
 * 
 * This script helps migrate existing registration data from Google Sheets
 * to the new registrations table in the database.
 * 
 * Run this script once to migrate your existing data:
 * 1. Make sure your Supabase is configured
 * 2. Run the SQL migration to create the registrations table
 * 3. Run this script from your Next.js API endpoint or Node.js environment
 */

import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';

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

interface SheetRegistrationData {
  timestamp: string;
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
}

export async function migrateDataFromSheetsToDatabase() {
  console.log('Starting migration from Google Sheets to Database...');
  
  try {
    // 1. Fetch data from Google Sheets
    console.log('Fetching data from Google Sheets...');
    const sheets = await getGoogleAuth();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Pendaftaran TI Billiard CUP!A:K',
    });

    const values = response.data.values || [];
    
    if (values.length <= 1) {
      console.log('No data found in Google Sheets (only header row)');
      return { success: true, migrated: 0, skipped: 0, errors: [] };
    }

    // 2. Process the data (skip header row)
    const sheetData: SheetRegistrationData[] = values.slice(1).map((row: string[]) => ({
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
      phoneB2: row[10] || ''
    }));

    console.log(`Found ${sheetData.length} registrations in Google Sheets`);

    // 3. Check which registrations already exist in database
    const { data: existingRegistrations, error: fetchError } = await supabase
      .from('registrations')
      .select('email');

    if (fetchError) {
      throw new Error(`Failed to fetch existing registrations: ${fetchError.message}`);
    }

    const existingEmails = new Set(existingRegistrations?.map(r => r.email.toLowerCase()) || []);

    // 4. Prepare data for database insertion
    const toInsert = [];
    const skipped = [];
    
    for (const registration of sheetData) {
      if (!registration.email || !registration.bidang || !registration.teamA1 || !registration.phoneA1) {
        skipped.push({ email: registration.email, reason: 'Missing required fields' });
        continue;
      }

      if (existingEmails.has(registration.email.toLowerCase())) {
        skipped.push({ email: registration.email, reason: 'Already exists in database' });
        continue;
      }

      // Convert sheet data to database format
      toInsert.push({
        email: registration.email.toLowerCase(),
        bidang: registration.bidang,
        team_a1: registration.teamA1,
        phone_a1: registration.phoneA1,
        team_a2: registration.teamA2 || null,
        phone_a2: registration.phoneA2 || null,
        team_b1: registration.teamB1 || null,
        phone_b1: registration.phoneB1 || null,
        team_b2: registration.teamB2 || null,
        phone_b2: registration.phoneB2 || null,
        status: 'pending', // Default status for migrated data
        created_at: registration.timestamp ? new Date(registration.timestamp).toISOString() : new Date().toISOString()
      });
    }

    console.log(`Inserting ${toInsert.length} new registrations, skipping ${skipped.length}`);

    // 5. Insert new registrations
    let inserted = 0;
    const errors = [];

    if (toInsert.length > 0) {
      // Insert in batches to avoid overwhelming the database
      const batchSize = 50;
      for (let i = 0; i < toInsert.length; i += batchSize) {
        const batch = toInsert.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('registrations')
          .insert(batch)
          .select('email');

        if (error) {
          console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
          errors.push({
            batch: i / batchSize + 1,
            error: error.message,
            count: batch.length
          });
        } else {
          inserted += data?.length || 0;
          console.log(`Inserted batch ${i / batchSize + 1}: ${data?.length || 0} records`);
        }
      }
    }

    const result = {
      success: true,
      migrated: inserted,
      skipped: skipped.length,
      errors: errors,
      skippedDetails: skipped
    };

    console.log('Migration completed:', result);
    return result;

  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      migrated: 0,
      skipped: 0,
      errors: []
    };
  }
}

// Usage example for API endpoint:
/*
// Create /api/admin/migrate-data/route.ts
import { NextResponse } from 'next/server';
import { migrateDataFromSheetsToDatabase } from '@/lib/migrate-data';

export async function POST() {
  const result = await migrateDataFromSheetsToDatabase();
  return NextResponse.json(result);
}
*/