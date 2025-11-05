import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to access its properties
    const { id } = await params

    // Get tournament details
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single()

    if (tournamentError) {
      console.error('Tournament fetch error:', tournamentError)
      return NextResponse.json({
        success: false,
        error: 'Tournament not found or database error',
        details: tournamentError.message
      }, { status: 404 })
    }

    if (!tournament) {
      return NextResponse.json({
        success: false,
        error: 'Tournament not found'
      }, { status: 404 })
    }

    // Get teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('tournament_id', id)
      .order('name')

    if (teamsError) {
      console.error('Teams fetch error:', teamsError)
      return NextResponse.json({
        success: false,
        error: 'Gagal mengambil data tim',
        details: teamsError.message
      }, { status: 500 })
    }

    // Get matches
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .eq('tournament_id', id)
      .order('round_number')
      .order('match_number')

    if (matchesError) {
      console.error('Matches fetch error:', matchesError)
      return NextResponse.json({
        success: false,
        error: 'Gagal mengambil data pertandingan',
        details: matchesError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tournament,
      teams: teams || [],
      matches: matches || []
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}