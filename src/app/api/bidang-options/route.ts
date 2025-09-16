import { NextResponse } from 'next/server';

const SPREADSHEET_ID = '1nKMVP2UqA-61JC97dcHB4yy1EkQdXE0RYiH3iHGdtXY';
const API_KEY = '';
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/values/Bidang%20Opsi!A:A?key=${API_KEY}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch bidang options');
    }
    
    let options: string[] = [];
    if (data.values && data.values.length > 1) {
      options = data.values.slice(1).map((row: string[]) => row[0]).filter(Boolean);
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
        error: 'Failed to fetch bidang options' 
      },
      { status: 500 }
    );
  }
}