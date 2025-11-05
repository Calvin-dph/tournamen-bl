import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface RegistrationData {
  bidang: string;
  type: 'single_women' | 'single_men' | 'double';
  player1_name: string;
  player1_phone: string;
  player2_name?: string;
  player2_phone?: string;
}

export interface FormRegistrationData {
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
      if (registration.type === 'single_women' || registration.type === 'single_men') {
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
    const { 
      bidang, 
      singleWomanName, 
      singleWomanPhone, 
      singleManName, 
      singleManPhone, 
      doublePlayer1Name, 
      doublePlayer1Phone, 
      doublePlayer2Name, 
      doublePlayer2Phone 
    } = registrationData as FormRegistrationData;

    console.log('Received registration data:', { bidang, doublePlayer1Name, doublePlayer1Phone, doublePlayer2Name, doublePlayer2Phone });
    
    if (!bidang || !doublePlayer1Name || !doublePlayer1Phone || !doublePlayer2Name || !doublePlayer2Phone) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: bidang, doublePlayer1Name, doublePlayer1Phone, doublePlayer2Name, doublePlayer2Phone' },
        { status: 400 }
      );
    }

    // Prepare registration records for each type
    const registrationsToProcess: RegistrationData[] = [];

    // Double team (required)
    registrationsToProcess.push({
      bidang,
      type: 'double',
      player1_name: doublePlayer1Name,
      player1_phone: doublePlayer1Phone,
      player2_name: doublePlayer2Name,
      player2_phone: doublePlayer2Phone,
    });

    // Single woman (optional)
    if (singleWomanName && singleWomanPhone) {
      registrationsToProcess.push({
        bidang,
        type: 'single_women',
        player1_name: singleWomanName,
        player1_phone: singleWomanPhone,
      });
    }

    // Single man (optional)
    if (singleManName && singleManPhone) {
      registrationsToProcess.push({
        bidang,
        type: 'single_men',
        player1_name: singleManName,
        player1_phone: singleManPhone,
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