import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface RegistrationData {
  bidang: string;
  type: 'single' | 'double';
  player1_name: string;
  player1_phone: string;
  player2_name?: string;
  player2_phone?: string;
}

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

export interface FormRegistrationData {
  bidang: string;
  single: SinglePlayer;
  double1: Player;
  double2: Player;
}

export async function GET() {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal mengambil data pendaftaran'
        },
        { status: 500 }
      );
    }

    // Calculate total player count
    let totalPlayers = 0;
    registrations?.forEach(registration => {
      // For single type registrations, count as 1 player
      if (registration.type === 'single') {
        totalPlayers += 1;
      }
      // For double type registrations, count as 2 players
      else if (registration.type === 'double') {
        totalPlayers += 2;
      }
    });

    return NextResponse.json({
      success: true,
      registrations: registrations || [],
      totalPlayers: totalPlayers
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data pendaftaran'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationData } = body;
    console.log('Received POST request with body:', registrationData);

    if (!registrationData) {
      return NextResponse.json(
        { success: false, error: 'Registration data is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { bidang, single, double1, double2 } = registrationData as FormRegistrationData;

    console.log('Received registration data:', { bidang, double1: double1?.player1Name, double1Phone: double1?.player1Phone });
    
    if (!bidang || !double1?.player1Name || !double1?.player1Phone || !double1?.player2Name || !double1?.player2Phone) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: bidang and double1 (with both players)' },
        { status: 400 }
      );
    }

    // Prepare registration records for each type
    const registrationsToProcess: RegistrationData[] = [];

    // Double team 1 (required)
    registrationsToProcess.push({
      bidang,
      type: 'double',
      player1_name: double1.player1Name,
      player1_phone: double1.player1Phone,
      player2_name: double1.player2Name,
      player2_phone: double1.player2Phone,
    });

    // Double team 2 (optional)
    if (double2?.player1Name && double2?.player1Phone && double2?.player2Name && double2?.player2Phone) {
      registrationsToProcess.push({
        bidang,
        type: 'double',
        player1_name: double2.player1Name,
        player1_phone: double2.player1Phone,
        player2_name: double2.player2Name,
        player2_phone: double2.player2Phone,
      });
    }

    // Single player (optional)
    if (single?.name && single?.phone) {
      registrationsToProcess.push({
        bidang,
        type: 'single',
        player1_name: single.name,
        player1_phone: single.phone,
      });
    }

    // Check if any registrations exist for this email and bidang
    const { data: existingRegistrations, error: checkError } = await supabase
      .from('registrations')
      .select('*')
      .eq('bidang', bidang);

    if (checkError) {
      console.error('Error checking existing registrations:', checkError);
      return NextResponse.json(
        { success: false, error: 'Gagal memeriksa pendaftaran yang sudah ada' },
        { status: 500 }
      );
    }

    const isUpdate = existingRegistrations && existingRegistrations.length > 0;
    let processedRegistrations: RegistrationData[] = [];

    if (isUpdate) {
      // Delete existing registrations for this email and bidang
      const { error: deleteError } = await supabase
        .from('registrations')
        .delete()
        .eq('bidang', bidang);

      if (deleteError) {
        console.error('Error deleting existing registrations:', deleteError);
        return NextResponse.json(
          { success: false, error: 'Gagal memperbarui pendaftaran yang sudah ada' },
          { status: 500 }
        );
      }
    }

    // Insert new registrations
    const { data: insertedRegistrations, error: insertError } = await supabase
      .from('registrations')
      .insert(registrationsToProcess)
      .select();

    if (insertError) {
      console.error('Error inserting registrations:', insertError);
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan pendaftaran' },
        { status: 500 }
      );
    }

    processedRegistrations = insertedRegistrations || [];

    return NextResponse.json({
      success: true,
      action: 'created',
      registrations: processedRegistrations,
      message: `Successfully created ${processedRegistrations.length} registration(s) for bidang ${bidang}`
    });

  } catch (error) {
    console.error('Error in registrations API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal memproses permintaan pendaftaran'
      },
      { status: 500 }
    );
  }
}