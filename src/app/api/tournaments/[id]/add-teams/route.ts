import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Add registered teams to tournament
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tournamentId, registrationIds } = body;

    if (!tournamentId || !registrationIds || !Array.isArray(registrationIds)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tournament ID and array of registration IDs are required' 
        },
        { status: 400 }
      );
    }

    // Fetch the tournament to verify it exists
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (tournamentError || !tournament) {
      return NextResponse.json(
        { success: false, error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Fetch the registrations
    const { data: registrations, error: registrationsError } = await supabase
      .from('registrations')
      .select('*')
      .in('id', registrationIds)
      .eq('status', 'approved');

    if (registrationsError) {
      console.error('Error fetching registrations:', registrationsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch registrations' },
        { status: 500 }
      );
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No approved registrations found' },
        { status: 404 }
      );
    }

    // Check if tournament has space
    const { data: existingTeams, error: teamsError } = await supabase
      .from('teams')
      .select('id')
      .eq('tournament_id', tournamentId);

    if (teamsError) {
      console.error('Error checking existing teams:', teamsError);
      return NextResponse.json(
        { success: false, error: 'Failed to check tournament capacity' },
        { status: 500 }
      );
    }

    const currentTeamCount = existingTeams?.length || 0;
    const remainingSlots = tournament.max_teams - currentTeamCount;

    if (registrations.length > remainingSlots) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Tournament only has ${remainingSlots} slots remaining, but ${registrations.length} teams were selected` 
        },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Process each registration
    for (const registration of registrations) {
      try {
        // Create teams based on registration data
        const teams = [];

        // Team A (required)
        const teamAPlayers = [registration.team_a1];
        if (registration.team_a2) {
          teamAPlayers.push(registration.team_a2);
        }

        teams.push({
          tournament_id: tournamentId,
          name: `${registration.bidang} - Team A`,
          captain: registration.team_a1,
          players: teamAPlayers
        });

        // Team B (optional)
        if (registration.team_b1) {
          const teamBPlayers = [registration.team_b1];
          if (registration.team_b2) {
            teamBPlayers.push(registration.team_b2);
          }

          teams.push({
            tournament_id: tournamentId,
            name: `${registration.bidang} - Team B`,
            captain: registration.team_b1,
            players: teamBPlayers
          });
        }

        // Insert teams
        const { data: createdTeams, error: createTeamsError } = await supabase
          .from('teams')
          .insert(teams)
          .select();

        if (createTeamsError) {
          throw createTeamsError;
        }

        // Update registration status
        const { error: updateError } = await supabase
          .from('registrations')
          .update({ 
            status: 'added_to_tournament', 
            tournament_id: tournamentId 
          })
          .eq('id', registration.id);

        if (updateError) {
          throw updateError;
        }

        results.push({
          registration_id: registration.id,
          email: registration.email,
          bidang: registration.bidang,
          teams_created: createdTeams?.length || 0,
          teams: createdTeams
        });

      } catch (error) {
        console.error(`Error processing registration ${registration.id}:`, error);
        errors.push({
          registration_id: registration.id,
          email: registration.email,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    }

    return NextResponse.json({
      success: true,
      tournament: tournament,
      results: results,
      errors: errors,
      summary: {
        processed: results.length,
        failed: errors.length,
        teams_created: results.reduce((sum, r) => sum + r.teams_created, 0)
      }
    });

  } catch (error) {
    console.error('Error adding teams to tournament:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get registrations that can be added to a specific tournament
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournament_id');

    if (!tournamentId) {
      return NextResponse.json(
        { success: false, error: 'Tournament ID is required' },
        { status: 400 }
      );
    }

    // Get approved registrations that haven't been added to any tournament yet
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('status', 'approved')
      .is('tournament_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching available registrations:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch registrations' },
        { status: 500 }
      );
    }

    // Get tournament info
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (tournamentError) {
      console.error('Error fetching tournament:', tournamentError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch tournament' },
        { status: 500 }
      );
    }

    // Get current team count
    const { data: existingTeams, error: teamsError } = await supabase
      .from('teams')
      .select('id')
      .eq('tournament_id', tournamentId);

    if (teamsError) {
      console.error('Error checking existing teams:', teamsError);
      return NextResponse.json(
        { success: false, error: 'Failed to check tournament capacity' },
        { status: 500 }
      );
    }

    const currentTeamCount = existingTeams?.length || 0;
    const remainingSlots = tournament.max_teams - currentTeamCount;

    return NextResponse.json({
      success: true,
      registrations: registrations || [],
      tournament: tournament,
      capacity: {
        max_teams: tournament.max_teams,
        current_teams: currentTeamCount,
        remaining_slots: remainingSlots
      }
    });

  } catch (error) {
    console.error('Error in add-teams API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}