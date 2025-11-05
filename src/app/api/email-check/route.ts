import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface ExistingRegistrationData {
  email: string;
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

// GET - Fetch all existing emails for client-side validation
export async function GET() {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('email')
      .order('email');

    if (error) {
      console.error('Error fetching emails:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal mengambil data email'
        },
        { status: 500 }
      );
    }

    // Extract unique emails
    const emails = [...new Set(registrations?.map(reg => reg.email.toLowerCase()) || [])];

    return NextResponse.json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data email'
      },
      { status: 500 }
    );
  }
}

// POST - Check specific email and return full registration data if exists
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Fetch all registrations for this email
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', emailLower)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error checking email:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal memeriksa email'
        },
        { status: 500 }
      );
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({
        success: true,
        exists: false,
        registration: null
      });
    }

    // Convert the separate registration records back to form format
    // Group by bidang and get the most recent registration for each type
    const registrationsByBidang: { [key: string]: ExistingRegistrationData } = {};

    registrations.forEach(reg => {
      if (!registrationsByBidang[reg.bidang]) {
        registrationsByBidang[reg.bidang] = {
          email: reg.email,
          bidang: reg.bidang,
          singleWomanName: '',
          singleWomanPhone: '',
          singleManName: '',
          singleManPhone: '',
          doublePlayer1Name: '',
          doublePlayer1Phone: '',
          doublePlayer2Name: '',
          doublePlayer2Phone: '',
        };
      }

      const formData = registrationsByBidang[reg.bidang];

      switch (reg.type) {
        case 'single_women':
          formData.singleWomanName = reg.player1_name || '';
          formData.singleWomanPhone = reg.player1_phone || '';
          break;
        case 'single_men':
          formData.singleManName = reg.player1_name || '';
          formData.singleManPhone = reg.player1_phone || '';
          break;
        case 'double':
          formData.doublePlayer1Name = reg.player1_name || '';
          formData.doublePlayer1Phone = reg.player1_phone || '';
          formData.doublePlayer2Name = reg.player2_name || '';
          formData.doublePlayer2Phone = reg.player2_phone || '';
          break;
      }
    });

    // Return the most recent bidang's data (first in the array since we ordered by created_at desc)
    const mostRecentBidang = registrations[0].bidang;
    const existingRegistration = registrationsByBidang[mostRecentBidang];

    return NextResponse.json({
      success: true,
      exists: true,
      registration: existingRegistration
    });
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal memeriksa email'
      },
      { status: 500 }
    );
  }
}