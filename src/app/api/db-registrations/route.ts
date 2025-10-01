import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Registration } from '@/lib/supabase';

// GET - Fetch all registrations with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const bidang = searchParams.get('bidang');
    const tournamentId = searchParams.get('tournament_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('registrations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (bidang) {
      query = query.eq('bidang', bidang);
    }
    if (tournamentId) {
      query = query.eq('tournament_id', tournamentId);
    }

    const { data: registrations, error, count } = await query;

    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch registrations', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      registrations: registrations || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error in registrations API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      bidang, 
      team_a1, 
      phone_a1, 
      team_a2, 
      phone_a2, 
      team_b1, 
      phone_b1, 
      team_b2, 
      phone_b2,
      status = 'pending',
      tournament_id,
      notes
    } = body;

    // Validate required fields
    if (!email || !bidang || !team_a1 || !phone_a1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: email, bidang, team_a1, phone_a1' 
        },
        { status: 400 }
      );
    }

    // Check if registration already exists
    const { data: existingRegistration, error: checkError } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking existing registration:', checkError);
      return NextResponse.json(
        { success: false, error: 'Failed to check existing registration' },
        { status: 500 }
      );
    }

    const registrationData = {
      email: email.toLowerCase(),
      bidang,
      team_a1,
      phone_a1,
      team_a2: team_a2 || null,
      phone_a2: phone_a2 || null,
      team_b1: team_b1 || null,
      phone_b1: phone_b1 || null,
      team_b2: team_b2 || null,
      phone_b2: phone_b2 || null,
      status,
      tournament_id: tournament_id || null,
      notes: notes || null
    };

    let result;
    let action;

    if (existingRegistration) {
      // Update existing registration
      const { data, error } = await supabase
        .from('registrations')
        .update(registrationData)
        .eq('id', existingRegistration.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating registration:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to update registration', details: error.message },
          { status: 500 }
        );
      }

      result = data;
      action = 'updated';
    } else {
      // Create new registration
      const { data, error } = await supabase
        .from('registrations')
        .insert([registrationData])
        .select()
        .single();

      if (error) {
        console.error('Error creating registration:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to create registration', details: error.message },
          { status: 500 }
        );
      }

      result = data;
      action = 'created';
    }

    return NextResponse.json({
      success: true,
      action,
      registration: result
    });

  } catch (error) {
    console.error('Error in registrations API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update registration status (for admin operations)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, tournament_id, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const updateData: Partial<Registration> = {};
    
    if (status) updateData.status = status;
    if (tournament_id !== undefined) updateData.tournament_id = tournament_id;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('registrations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating registration:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update registration', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      registration: data
    });

  } catch (error) {
    console.error('Error in registrations API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}