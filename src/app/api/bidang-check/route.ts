import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface ExistingRegistrationData {
  bidang: string;
  singleWomanName: string;
  singleWomanPhone: string;
  singleManName: string;
  singleManPhone: string;
  doublePlayer1Name: string;
  doublePlayer1Phone: string;
  doublePlayer2Name: string;
  doublePlayer2Phone: string;
}

// GET - Fetch all existing bidangs for validation
export async function GET() {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('bidang')
      .order('bidang');

    if (error) {
      console.error('Error fetching bidangs:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal mengambil data bidang'
        },
        { status: 500 }
      );
    }

    // Extract unique bidangs
    const bidangs = [...new Set(registrations?.map(reg => reg.bidang) || [])];

    return NextResponse.json({
      success: true,
      bidangs
    });
  } catch (error) {
    console.error('Error fetching bidangs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data bidang'
      },
      { status: 500 }
    );
  }
}

// POST - Check specific bidang and return full registration data if exists
export async function POST(request: Request) {
  try {
    const { bidang } = await request.json();

    if (!bidang) {
      return NextResponse.json(
        { success: false, error: 'Bidang is required' },
        { status: 400 }
      );
    }

    // Fetch all registrations for this bidang
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('bidang', bidang)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error checking bidang:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal memeriksa bidang'
        },
        { status: 500 }
      );
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({
        success: true,
        exists: false,
        registration: null,
        isReadOnly: false
      });
    }

    // Convert the separate registration records back to form format
    const existingRegistration: ExistingRegistrationData = {
      bidang,
      singleWomanName: '',
      singleWomanPhone: '',
      singleManName: '',
      singleManPhone: '',
      doublePlayer1Name: '',
      doublePlayer1Phone: '',
      doublePlayer2Name: '',
      doublePlayer2Phone: '',
    };

    registrations.forEach(reg => {
      switch (reg.type) {
        case 'single_women':
          existingRegistration.singleWomanName = reg.player1_name || '';
          existingRegistration.singleWomanPhone = reg.player1_phone || '';
          break;
        case 'single_men':
          existingRegistration.singleManName = reg.player1_name || '';
          existingRegistration.singleManPhone = reg.player1_phone || '';
          break;
        case 'double':
          existingRegistration.doublePlayer1Name = reg.player1_name || '';
          existingRegistration.doublePlayer1Phone = reg.player1_phone || '';
          existingRegistration.doublePlayer2Name = reg.player2_name || '';
          existingRegistration.doublePlayer2Phone = reg.player2_phone || '';
          break;
      }
    });

    return NextResponse.json({
      success: true,
      exists: true,
      registration: existingRegistration,
      isReadOnly: true // Always read-only since bidang cannot be updated
    });
  } catch (error) {
    console.error('Error checking bidang:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal memeriksa bidang'
      },
      { status: 500 }
    );
  }
}