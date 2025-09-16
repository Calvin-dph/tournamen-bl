import { NextResponse } from 'next/server';

interface RegistrationData {
  bidang: string;
  teamA1: string;
  teamA2: string;
  teamB1?: string;
  teamB2?: string;
  phoneA1: string;
  phoneA2: string;
  phoneB1?: string;
  phoneB2?: string;
}

// Google Form configuration
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdJNoRz1vlNlj9x1PC_gO0JCWdM6YcD1wBpOrlU8TKu2DEMMA/formResponse';

// Google Form field mappings
const FORM_FIELDS = {
  bidang: 'entry.1805682831',       // Department/Bidang field (Teknologi Informasi)
  teamA1: 'entry.130929675',        // Team A1 field
  teamA2: 'entry.335460507',        // Team A2 field  
  teamB1: 'entry.2130038964',       // Team B1 field
  teamB2: 'entry.1046935416',       // Team B2 field
  phoneA1: 'entry.254771778',       // Phone A1 field (nomor a1)
  phoneA2: 'entry.387092963',       // Phone A2 field (nomor a2)
  phoneB1: 'entry.1365565988',      // Phone B1 field (nomor b1)
  phoneB2: 'entry.2143741650',      // Phone B2 field (nomor b2)
};

function validateRegistrationData(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return 'Data tidak valid';
  }

  const validData = data as Record<string, unknown>;

  if (!validData.bidang || typeof validData.bidang !== 'string') {
    return 'Bidang harus diisi';
  }

  if (!validData.teamA1 || typeof validData.teamA1 !== 'string') {
    return 'Team A1 harus diisi';
  }

  if (!validData.teamA2 || typeof validData.teamA2 !== 'string') {
    return 'Team A2 harus diisi';
  }

  if (!validData.phoneA1 || typeof validData.phoneA1 !== 'string') {
    return 'Nomor handphone A1 harus diisi';
  }

  if (!validData.phoneA2 || typeof validData.phoneA2 !== 'string') {
    return 'Nomor handphone A2 harus diisi';
  }

  // Validate phone number format
  const phonePattern = /^[\d\s+()-]+$/;
  
  if (!phonePattern.test(validData.phoneA1)) {
    return 'Format nomor handphone A1 tidak valid';
  }

  if (!phonePattern.test(validData.phoneA2)) {
    return 'Format nomor handphone A2 tidak valid';
  }

  // Validate optional Team B fields if provided
  if (validData.teamB1 && typeof validData.teamB1 === 'string' && validData.teamB1.trim() !== '') {
    if (validData.teamB1.trim().length < 2) {
      return 'Team B1 harus minimal 2 karakter';
    }
  }

  if (validData.teamB2 && typeof validData.teamB2 === 'string' && validData.teamB2.trim() !== '') {
    if (validData.teamB2.trim().length < 2) {
      return 'Team B2 harus minimal 2 karakter';
    }
  }

  // Validate optional phone B fields if provided
  if (validData.phoneB1 && typeof validData.phoneB1 === 'string' && validData.phoneB1.trim() !== '') {
    if (!phonePattern.test(validData.phoneB1)) {
      return 'Format nomor handphone B1 tidak valid';
    }
  }

  if (validData.phoneB2 && typeof validData.phoneB2 === 'string' && validData.phoneB2.trim() !== '') {
    if (!phonePattern.test(validData.phoneB2)) {
      return 'Format nomor handphone B2 tidak valid';
    }
  }

  return null;
}

function sanitizeData(data: RegistrationData): RegistrationData {
  return {
    bidang: data.bidang.trim(),
    teamA1: data.teamA1.trim(),
    teamA2: data.teamA2.trim(),
    teamB1: data.teamB1?.trim() || '',
    teamB2: data.teamB2?.trim() || '',
    phoneA1: data.phoneA1.trim(),
    phoneA2: data.phoneA2.trim(),
    phoneB1: data.phoneB1?.trim() || '',
    phoneB2: data.phoneB2?.trim() || '',
  };
}

async function submitToGoogleForm(data: RegistrationData): Promise<boolean> {
  try {
    const formData = new FormData();

    // Map our data to Google Form entry IDs
    formData.append(FORM_FIELDS.bidang, data.bidang);
    formData.append(FORM_FIELDS.teamA1, data.teamA1);
    formData.append(FORM_FIELDS.teamA2, data.teamA2);
    formData.append(FORM_FIELDS.phoneA1, data.phoneA1);
    formData.append(FORM_FIELDS.phoneA2, data.phoneA2);
    
    // Optional fields
    if (data.teamB1) {
      formData.append(FORM_FIELDS.teamB1, data.teamB1);
    }
    if (data.teamB2) {
      formData.append(FORM_FIELDS.teamB2, data.teamB2);
    }
    if (data.phoneB1) {
      formData.append(FORM_FIELDS.phoneB1, data.phoneB1);
    }
    if (data.phoneB2) {
      formData.append(FORM_FIELDS.phoneB2, data.phoneB2);
    }

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
      teamA1: sanitizedData.teamA1,
      teamA2: sanitizedData.teamA2,
      teamB1: sanitizedData.teamB1,
      teamB2: sanitizedData.teamB2,
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