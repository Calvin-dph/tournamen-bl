import { NextRequest, NextResponse } from 'next/server';

interface RegistrationData {
  bidang: string;
  team1: string;
  team2?: string;
  phoneNumbers: string;
}

// Google Form configuration
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdJNoRz1vlNlj9x1PC_gO0JCWdM6YcD1wBpOrlU8TKu2DEMMA/formResponse';

// Google Form field mappings - updated with actual entry IDs from the form
const FORM_FIELDS = {
  phoneNumbers: 'entry.254771778',  // Phone numbers field
  team2: 'entry.2130038964',        // Team 2 field  
  team1: 'entry.130929675',         // Team 1 field
  bidang: 'entry.1805682831',       // Department/Bidang field
};

function validateRegistrationData(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return 'Data tidak valid';
  }
  
  const validData = data as Record<string, unknown>;
  
  if (!validData.bidang || typeof validData.bidang !== 'string') {
    return 'Bidang harus diisi';
  }
  
  if (!validData.team1 || typeof validData.team1 !== 'string') {
    return 'Team 1 harus diisi';
  }
  
  if (!validData.phoneNumbers || typeof validData.phoneNumbers !== 'string') {
    return 'Nomor handphone harus diisi';
  }
  
  // Validate phone numbers format (should contain numbers and &)
  const phonePattern = /^[\d\s&+()-]+$/;
  if (!phonePattern.test(validData.phoneNumbers)) {
    return 'Format nomor handphone tidak valid';
  }
  
  return null;
}

function sanitizeData(data: RegistrationData): RegistrationData {
  return {
    bidang: data.bidang.trim(),
    team1: data.team1.trim(),
    team2: data.team2?.trim() || '',
    phoneNumbers: data.phoneNumbers.trim(),
  };
}

async function submitToGoogleForm(data: RegistrationData): Promise<boolean> {
  try {
    const formData = new FormData();
    
    // Map our data to Google Form entry IDs (matching the curl format)
    formData.append(FORM_FIELDS.bidang, data.bidang);
    formData.append(FORM_FIELDS.team1, data.team1);
    if (data.team2) {
      formData.append(FORM_FIELDS.team2, data.team2);
    }
    formData.append(FORM_FIELDS.phoneNumbers, data.phoneNumbers);

    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: formData,
    });

    // Google Forms typically returns 200 even for successful submissions
    // Check for redirect or success indicators
    return response.status === 200 || response.status === 302;
  } catch (error) {
    console.error('Error submitting to Google Form:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request data
    const validationError = validateRegistrationData(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    
    // Sanitize data
    const sanitizedData = sanitizeData(body);
    
    // Submit to Google Form
    const submitted = await submitToGoogleForm(sanitizedData);
    
    if (!submitted) {
      return NextResponse.json(
        { error: 'Gagal mengirim data pendaftaran. Silakan coba lagi.' },
        { status: 500 }
      );
    }
    
    // Log registration for monitoring
    console.log('New registration submitted to Google Form:', {
      bidang: sanitizedData.bidang,
      team1: sanitizedData.team1,
      team2: sanitizedData.team2,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Pendaftaran berhasil dikirim ke Google Form!',
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// GET method for basic API health check
export async function GET() {
  try {
    return NextResponse.json({
      message: 'Registration API is working. Data is submitted to Google Forms.',
      googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdJNoRz1vlNlj9x1PC_gO0JCWdM6YcD1wBpOrlU8TKu2DEMMA/viewform',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Get API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}