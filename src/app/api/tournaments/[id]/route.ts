import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to access its properties
    const { id } = await params
    const tournamentId = id

    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      // Return mock data when Supabase is not configured
      if (tournamentId === '1') {
        const mockData = {
          tournament: {
            id: '1',
            name: 'TI Billiard Cup 2025',
            format: 'group_knockout',
            max_teams: 16,
            group_size: 4,
            status: 'group_stage',
            description: 'Tournament billiard tahunan TI dengan sistem grup dan knockout',
            start_date: '2025-10-13T18:00:00+07:00',
            end_date: '2025-10-18T20:00:00+07:00',
            location: 'Greenlight Cafe & Billiard, Jl. Purnawarman No.3, Bandung',
            rules: 'Maksimal 2 tim (4 karyawan) per bidang',
            created_at: '2025-10-01T00:00:00Z'
          },
          teams: [
            {
              id: '1',
              tournament_id: '1',
              name: 'Team Alpha TI',
              captain: 'John Doe',
              players: ['John Doe', 'Jane Smith'],
              group_name: 'Group A',
              created_at: '2025-10-01T00:00:00Z'
            },
            {
              id: '2',
              tournament_id: '1',
              name: 'Team Beta Finance',
              captain: 'Mike Johnson',
              players: ['Mike Johnson', 'Sarah Wilson'],
              group_name: 'Group A',
              created_at: '2025-10-01T00:00:00Z'
            },
            {
              id: '3',
              tournament_id: '1',
              name: 'Team Gamma HR',
              captain: 'David Brown',
              players: ['David Brown', 'Lisa Davis'],
              group_name: 'Group B',
              created_at: '2025-10-01T00:00:00Z'
            },
            {
              id: '4',
              tournament_id: '1',
              name: 'Team Delta Marketing',
              captain: 'Chris Miller',
              players: ['Chris Miller', 'Anna Taylor'],
              group_name: 'Group B',
              created_at: '2025-10-01T00:00:00Z'
            }
          ],
          matches: [],
          groupStandings: [
            {
              id: '1',
              tournament_id: '1',
              team_id: '1',
              group_name: 'Group A',
              team: {
                id: '1',
                name: 'Team Alpha TI',
                captain: 'John Doe',
                players: ['John Doe', 'Jane Smith']
              },
              matches_played: 2,
              wins: 2,
              draws: 0,
              losses: 0,
              goals_for: 6,
              goals_against: 2,
              goal_difference: 4,
              points: 6
            },
            {
              id: '2',
              tournament_id: '1',
              team_id: '2',
              group_name: 'Group A',
              team: {
                id: '2',
                name: 'Team Beta Finance',
                captain: 'Mike Johnson',
                players: ['Mike Johnson', 'Sarah Wilson']
              },
              matches_played: 2,
              wins: 1,
              draws: 0,
              losses: 1,
              goals_for: 4,
              goals_against: 4,
              goal_difference: 0,
              points: 3
            },
            {
              id: '3',
              tournament_id: '1',
              team_id: '3',
              group_name: 'Group B',
              team: {
                id: '3',
                name: 'Team Gamma HR',
                captain: 'David Brown',
                players: ['David Brown', 'Lisa Davis']
              },
              matches_played: 2,
              wins: 1,
              draws: 1,
              losses: 0,
              goals_for: 5,
              goals_against: 3,
              goal_difference: 2,
              points: 4
            },
            {
              id: '4',
              tournament_id: '1',
              team_id: '4',
              group_name: 'Group B',
              team: {
                id: '4',
                name: 'Team Delta Marketing',
                captain: 'Chris Miller',
                players: ['Chris Miller', 'Anna Taylor']
              },
              matches_played: 2,
              wins: 0,
              draws: 1,
              losses: 1,
              goals_for: 3,
              goals_against: 5,
              goal_difference: -2,
              points: 1
            }
          ]
        };

        return NextResponse.json({
          success: true,
          ...mockData
        })
      } else {
        return NextResponse.json(
          { success: false, error: 'Tournament not found' },
          { status: 404 }
        )
      }
    }

    // Fetch tournament details
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single()

    if (tournamentError || !tournament) {
      return NextResponse.json(
        { success: false, error: 'Tournament not found' },
        { status: 404 }
      )
    }

    // Fetch teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true })

    if (teamsError) {
      throw teamsError
    }

    // Fetch matches
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams!matches_team1_id_fkey(id, name, captain),
        team2:teams!matches_team2_id_fkey(id, name, captain),
        winner:teams!matches_winner_id_fkey(id, name, captain)
      `)
      .eq('tournament_id', tournamentId)
      .order('round_number', { ascending: true })

    if (matchesError) {
      throw matchesError
    }

    // Fetch group standings if it's a group tournament
    let groupStandings = null
    if (tournament.format === 'group_knockout') {
      const { data: standings, error: standingsError } = await supabase
        .from('group_standings')
        .select(`
          *,
          team:teams(id, name, captain)
        `)
        .eq('tournament_id', tournamentId)
        .order('group_name', { ascending: true })

      if (!standingsError) {
        groupStandings = standings
      }
    }

    return NextResponse.json({
      success: true,
      tournament,
      teams,
      matches,
      groupStandings
    })
  } catch (error) {
    console.error('Error fetching tournament details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tournament details' },
      { status: 500 }
    )
  }
}