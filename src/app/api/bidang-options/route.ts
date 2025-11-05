import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('department_options')
      .select('name')
      .order('name');

    if (error) {
      console.error('Error fetching department options:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal mengambil opsi bidang'
        },
        { status: 500 }
      );
    }

    const options = data.map(item => item.name);

    return NextResponse.json({
      success: true,
      options
    });
  } catch (error) {
    console.error('Error fetching department options:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil opsi bidang'
      },
      { status: 500 }
    );
  }
}