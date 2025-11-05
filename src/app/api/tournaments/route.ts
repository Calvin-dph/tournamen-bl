import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      // Return mock data when Supabase is not configured
      const mockTournaments = [
        {
          id: '1',
          name: 'TI Billiard Cup 2025',
          format: 'group_knockout',
          max_teams: 16,
          status: 'group_stage',
          description: 'Tournament billiard tahunan TI dengan sistem grup dan knockout',
          start_date: '2025-10-13T18:00:00+07:00',
          end_date: '2025-10-18T20:00:00+07:00',
          location: 'Greenlight Cafe & Billiard, Jl. Purnawarman No.3, Bandung',
          participant_count: 8,
          created_at: '2025-10-01T00:00:00Z'
        }
      ];

      return NextResponse.json({ 
        success: true, 
        tournaments: mockTournaments
      })
    }

    const { data: tournaments, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        teams(count)
      `)
      .is('is_active', true)
      .in('status', ['group_stage', 'knockout', 'completed'])
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Transform the data to include participant count
    const tournamentsWithCount = tournaments.map(tournament => ({
      ...tournament,
      participant_count: tournament.teams?.length || 0
    }))

    return NextResponse.json({ 
      success: true, 
      tournaments: tournamentsWithCount
    })
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    
    // Return mock data as fallback
    const mockTournaments = [
      {
        id: '1',
        name: 'TI Billiard Cup 2025',
        format: 'group_knockout',
        max_teams: 16,
        status: 'group_stage',
        description: 'Tournament billiard tahunan TI dengan sistem grup dan knockout',
        start_date: '2025-10-13T18:00:00+07:00',
        end_date: '2025-10-18T20:00:00+07:00',
        location: 'Greenlight Cafe & Billiard, Jl. Purnawarman No.3, Bandung',
        participant_count: 8,
        created_at: '2025-10-01T00:00:00Z'
      }
    ];

    return NextResponse.json({ 
      success: true, 
      tournaments: mockTournaments
    })
  }
}