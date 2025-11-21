import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'upcoming';

    // Fetch recent matches with team information using foreign key relationships
    const baseQuery = supabase
      .from('matches')
      .select(`
      id,
      team1_score,
      team2_score,
      status,
      played_at,
      scheduled_at,
      updated_at,
      table_number,
      team1:team1_id(id, name),
      team2:team2_id(id, name)
      `)
      .eq('status', type === 'lastMatches' ? 'completed' : 'pending')
      .not(type === 'lastMatches' ? 'updated_at' : 'scheduled_at', 'is', null);

    // Order by updated_at for lastMatches, otherwise order by scheduled_at then table_number
    let query = baseQuery;
    if (type === 'lastMatches') {
      query = query.order('updated_at', { ascending: false }).limit(3);
    } else {
      query = query
        .order('scheduled_at', { ascending: true })
        .order('table_number', { ascending: true })
        .limit(3);
    }

    const { data: matches, error } = await query;

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
      team1_name: (match.team1 as { name?: string })?.name ?? 'TBA',
      team2_name: (match.team2 as { name?: string })?.name ?? 'TBA',
      team1_score: match.team1_score,
      team2_score: match.team2_score,
      table_number: match.table_number ?? null,
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