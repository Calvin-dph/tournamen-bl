import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Player {
  player1Name: string;
  player1Phone: string;
  player2Name: string;
  player2Phone: string;
}

interface SinglePlayer {
  name: string;
  phone: string;
}

export interface ExistingRegistrationData {
  bidang: string;
  single: SinglePlayer;
  double1: Player;
  double2: Player;
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
      single: {
        name: '',
        phone: '',
      },
      double1: {
        player1Name: '',
        player1Phone: '',
        player2Name: '',
        player2Phone: '',
      },
      double2: {
        player1Name: '',
        player1Phone: '',
        player2Name: '',
        player2Phone: '',
      },
    };

    // Separate doubles into an array to handle double1 and double2
    const doubleRegistrations = registrations.filter(reg => reg.type === 'double');

    registrations.forEach(reg => {
      switch (reg.type) {
        case 'single':
          existingRegistration.single.name = reg.player1_name || '';
          existingRegistration.single.phone = reg.player1_phone || '';
          break;
        case 'double':
          // This will be handled separately below
          break;
      }
    });

    // Handle double registrations as array - first goes to double1, second to double2
    if (doubleRegistrations.length > 0) {
      // First double registration
      const firstDouble = doubleRegistrations[0];
      existingRegistration.double1.player1Name = firstDouble.player1_name || '';
      existingRegistration.double1.player1Phone = firstDouble.player1_phone || '';
      existingRegistration.double1.player2Name = firstDouble.player2_name || '';
      existingRegistration.double1.player2Phone = firstDouble.player2_phone || '';

      // Second double registration (if exists)
      if (doubleRegistrations.length > 1) {
        const secondDouble = doubleRegistrations[1];
        existingRegistration.double2.player1Name = secondDouble.player1_name || '';
        existingRegistration.double2.player1Phone = secondDouble.player1_phone || '';
        existingRegistration.double2.player2Name = secondDouble.player2_name || '';
        existingRegistration.double2.player2Phone = secondDouble.player2_phone || '';
      }
    }

    return NextResponse.json({
      success: true,
      exists: true,
      registration: existingRegistration,
      isReadOnly: true
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