import { NextResponse } from 'next/server';

const SPREADSHEET_ID = '1nKMVP2UqA-61JC97dcHB4yy1EkQdXE0RYiH3iHGdtXY';
const API_KEY = '';
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

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
  rowIndex: number;
}

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/values/Pendaftaran%20TI%20Billiard%20CUP!A:J?key=${API_KEY}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch registrations');
    }
    
    let registrations: RegistrationData[] = [];
    if (data.values && data.values.length > 1) {
      registrations = data.values.slice(1).map((row: string[], index: number) => ({
        timestamp: row[0] || '',
        email: row[1] || '',
        bidang: row[2] || '',
        teamA1: row[3] || '',
        teamB1: row[4] || '',
        phoneA1: row[5] || '',
        teamA2: row[6] || '',
        teamB2: row[7] || '',
        phoneA2: row[8] || '',
        phoneB1: row[9] || '',
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
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Fetch all registrations to check if email exists
    const response = await fetch(`${BASE_URL}/values/Pendaftaran%20TI%20Billiard%20CUP!A:J?key=${API_KEY}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to check email');
    }
    
    let existingRegistration: RegistrationData | null = null;
    if (data.values && data.values.length > 1) {
      const registrations = data.values.slice(1).map((row: string[], index: number) => ({
        timestamp: row[0] || '',
        email: row[1] || '',
        bidang: row[2] || '',
        teamA1: row[3] || '',
        teamB1: row[4] || '',
        phoneA1: row[5] || '',
        teamA2: row[6] || '',
        teamB2: row[7] || '',
        phoneA2: row[8] || '',
        phoneB1: row[9] || '',
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