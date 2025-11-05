import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'upcoming';

    // Fetch recent matches with team information using foreign key relationships
    const { data: matches, error } = await  supabase
      .from('matches')
      .select(`
        id,
        team1_score,
        team2_score,
        status,
        played_at,
        scheduled_at,
        updated_at,
        team1:team1_id(id, name),
        team2:team2_id(id, name)
      `)
      .eq('status', type === 'lastMatches' ? 'completed' : 'pending')
      .not(type === 'lastMatches' ? 'updated_at' : 'scheduled_at', 'is', null)
      .order(type === 'lastMatches' ? 'updated_at' : 'scheduled_at', { ascending: type === 'lastMatches'? false : true })
      .limit(3);

    if (error) {
      console.error('Error fetching matches:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal mengambil data pertandingan'
        },
        { status: 500 }
      );
    }

    // If no matches found, return empty array
    if (!matches || matches.length === 0) {
      return NextResponse.json({
        success: true,
        matches: []
      });
    }

    // Transform the data to match the expected format
    const transformedMatches = matches.map(match => ({
      id: match.id,
      team1_name: match.team1?.name || 'TBA',
      team2_name: match.team2?.name || 'TBA',
      team1_score: match.team1_score,
      team2_score: match.team2_score,
      status: match.status,
      scheduled_time: match.scheduled_at || match.played_at,
      updated_at: match.updated_at
    }));

    return NextResponse.json({
      success: true,
      matches: transformedMatches
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}