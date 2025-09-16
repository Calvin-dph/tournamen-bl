import { NextResponse } from 'next/server';

interface RegistrationData {
  timestamp?: string;
  email: string;
  bidang: string;
  teamA1: string;
  teamB1?: string;
  phoneA1: string;
  teamA2: string;
  teamB2?: string;
  phoneA2: string;
  phoneB1?: string;
}

// Google Sheets API configuration
const SPREADSHEET_ID = '1nKMVP2UqA-61JC97dcHB4yy1EkQdXE0RYiH3iHGdtXY';
const API_KEY = '';
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

function validateRegistrationData(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return 'Data tidak valid';
  }

  const validData = data as Record<string, unknown>;

  // Email validation
  if (!validData.email || typeof validData.email !== 'string') {
    return 'Email harus diisi';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(validData.email)) {
    return 'Format email tidak valid';
  }

  if (!validData.bidang || typeof validData.bidang !== 'string') {
    return 'Bidang harus diisi';
  }

  if (!validData.teamA1 || typeof validData.teamA1 !== 'string') {
    return 'Team A1 harus diisi';
  }

  if (!validData.teamA2 || typeof validData.teamA2 !== 'string') {
    return 'Team A2 harus diisi';
  }

  if (!validData.phoneA1 || typeof validData.phoneA1 !== 'string') {
    return 'Nomor handphone A1 harus diisi';
  }

  if (!validData.phoneA2 || typeof validData.phoneA2 !== 'string') {
    return 'Nomor handphone A2 harus diisi';
  }

  // Validate phone number format
  const phonePattern = /^[\d\s+()-]+$/;
  
  if (!phonePattern.test(validData.phoneA1)) {
    return 'Format nomor handphone A1 tidak valid';
  }

  if (!phonePattern.test(validData.phoneA2)) {
    return 'Format nomor handphone A2 tidak valid';
  }

  // Validate optional Team B fields if provided
  if (validData.teamB1 && typeof validData.teamB1 === 'string' && validData.teamB1.trim() !== '') {
    if (validData.teamB1.trim().length < 2) {
      return 'Team B1 harus minimal 2 karakter';
    }
  }

  if (validData.teamB2 && typeof validData.teamB2 === 'string' && validData.teamB2.trim() !== '') {
    if (validData.teamB2.trim().length < 2) {
      return 'Team B2 harus minimal 2 karakter';
    }
  }

  // Validate optional phone B fields if provided
  if (validData.phoneB1 && typeof validData.phoneB1 === 'string' && validData.phoneB1.trim() !== '') {
    if (!phonePattern.test(validData.phoneB1)) {
      return 'Format nomor handphone B1 tidak valid';
    }
  }

  if (validData.phoneB2 && typeof validData.phoneB2 === 'string' && validData.phoneB2.trim() !== '') {
    if (!phonePattern.test(validData.phoneB2)) {
      return 'Format nomor handphone B2 tidak valid';
    }
  }

  return null;
}

function sanitizeData(data: RegistrationData): RegistrationData {
  return {
    email: data.email.trim().toLowerCase(),
    bidang: data.bidang.trim(),
    teamA1: data.teamA1.trim(),
    teamB1: data.teamB1?.trim() || '',
    phoneA1: data.phoneA1.trim(),
    teamA2: data.teamA2.trim(),
    teamB2: data.teamB2?.trim() || '',
    phoneA2: data.phoneA2.trim(),
    phoneB1: data.phoneB1?.trim() || '',
  };
}

async function checkEmailExists(email: string): Promise<{ exists: boolean; rowIndex?: number }> {
  try {
    const response = await fetch(`${BASE_URL}/values/Pendaftaran%20TI%20Billiard%20CUP!A:J?key=${API_KEY}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to check email');
    }

    if (data.values && data.values.length > 1) {
      const existingIndex = data.values.findIndex((row: string[], index: number) => 
        index > 0 && row[1] && row[1].toLowerCase() === email.toLowerCase() // Email is in column B (index 1)
      );

      if (existingIndex > 0) {
        return { exists: true, rowIndex: existingIndex + 1 }; // +1 because findIndex is 0-based but we need 1-based for sheets
      }
    }

    return { exists: false };
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
}

async function appendNewRow(data: RegistrationData): Promise<boolean> {
  try {
    const values = [[
      new Date().toISOString(), // Timestamp (Column A)
      data.email,               // Email (Column B)
      data.bidang,              // Bidang (Column C)
      data.teamA1,              // Team A1 (Column D)
      data.teamB1,              // Team B1 (Column E)
      data.phoneA1,             // Phone A1 (Column F)
      data.teamA2,              // Team A2 (Column G)
      data.teamB2,              // Team B2 (Column H)
      data.phoneA2,             // Phone A2 (Column I)
      data.phoneB1              // Phone B1 (Column J)
    ]];

    const response = await fetch(`${BASE_URL}/values/Pendaftaran%20TI%20Billiard%20CUP!A:J:append?valueInputOption=USER_ENTERED&key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to append new row');
    }

    return true;
  } catch (error) {
    console.error('Error appending new row:', error);
    return false;
  }
}

async function updateExistingRow(data: RegistrationData, rowIndex: number): Promise<boolean> {
  try {
    const values = [[
      new Date().toISOString(), // Timestamp (Column A) - update timestamp
      data.email,               // Email (Column B)
      data.bidang,              // Bidang (Column C)
      data.teamA1,              // Team A1 (Column D)
      data.teamB1,              // Team B1 (Column E)
      data.phoneA1,             // Phone A1 (Column F)
      data.teamA2,              // Team A2 (Column G)
      data.teamB2,              // Team B2 (Column H)
      data.phoneA2,             // Phone A2 (Column I)
      data.phoneB1              // Phone B1 (Column J)
    ]];

    const response = await fetch(`${BASE_URL}/values/Pendaftaran%20TI%20Billiard%20CUP!A${rowIndex}:J${rowIndex}?valueInputOption=USER_ENTERED&key=${API_KEY}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update existing row');
    }

    return true;
  } catch (error) {
    console.error('Error updating existing row:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationError = validateRegistrationData(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Sanitize data
    const sanitizedData = sanitizeData(body);

    // Check if email already exists
    const emailCheck = await checkEmailExists(sanitizedData.email);
    
    let success = false;
    let isUpdate = false;

    if (emailCheck.exists && emailCheck.rowIndex) {
      // Update existing row
      success = await updateExistingRow(sanitizedData, emailCheck.rowIndex);
      isUpdate = true;
    } else {
      // Append new row
      success = await appendNewRow(sanitizedData);
      isUpdate = false;
    }

    if (!success) {
      return NextResponse.json(
        { error: `Gagal ${isUpdate ? 'memperbarui' : 'menyimpan'} data pendaftaran. Silakan coba lagi.` },
        { status: 500 }
      );
    }

    // Log registration for monitoring
    console.log(`${isUpdate ? 'Updated' : 'New'} registration submitted to Google Sheets:`, {
      email: sanitizedData.email,
      bidang: sanitizedData.bidang,
      teamA1: sanitizedData.teamA1,
      teamA2: sanitizedData.teamA2,
      teamB1: sanitizedData.teamB1,
      teamB2: sanitizedData.teamB2,
      timestamp: new Date().toISOString(),
      isUpdate,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Pendaftaran berhasil ${isUpdate ? 'diperbarui' : 'disimpan'} ke Google Sheets!`,
        isUpdate,
        timestamp: new Date().toISOString()
      },
      { status: isUpdate ? 200 : 201 }
    );

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// GET method for basic API health check
export async function GET() {
  try {
    return NextResponse.json({
      message: 'Registration API is working. Data is submitted to Google Sheets.',
      spreadsheetId: SPREADSHEET_ID,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Get API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}