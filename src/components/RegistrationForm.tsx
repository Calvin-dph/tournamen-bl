'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
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

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Phone number formatting function
const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');

  // Limit to 12 digits (Indonesian phone numbers)
  const limited = numbers.slice(0, 12);

  return limited;
};

// Check if field is a phone number field
const isPhoneField = (fieldName: string): boolean => {
  return fieldName.includes('Phone');
};

// Function to mask phone number for display
const maskPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber || phoneNumber.length < 4) return phoneNumber;
  const firstTwo = phoneNumber.substring(0, 4);
  const lastTwo = phoneNumber.substring(phoneNumber.length - 4);
  const masked = '*'.repeat(phoneNumber.length - 8);
  return `${firstTwo}${masked}${lastTwo}`;
};

export default function RegistrationForm() {
  const router = useRouter();
  const [bidangOptions, setBidangOptions] = useState<string[]>([]);
  const [isLoadingBidang, setIsLoadingBidang] = useState(true);
  const [isCheckingBidang, setIsCheckingBidang] = useState(false);
  const [existingData, setExistingData] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    bidang: '',
    singleWomanName: '',
    singleWomanPhone: '',
    singleManName: '',
    singleManPhone: '',
    doublePlayer1Name: '',
    doublePlayer1Phone: '',
    doublePlayer2Name: '',
    doublePlayer2Phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Debounce bidang input
  const debouncedBidang = useDebounce(formData.bidang, 500);

  // Check if form fields should be disabled
  const isFormDisabled = isCheckingBidang;

  // Helper functions to check if specific sections are disabled due to existing data
  const isDoubleDisabled = existingData && (
    (existingData.doublePlayer1Name ?? '') !== '' ||
    (existingData.doublePlayer1Phone ?? '') !== '' ||
    (existingData.doublePlayer2Name ?? '') !== '' ||
    (existingData.doublePlayer2Phone ?? '') !== ''
  );

  const isSingleWomanDisabled = existingData && (
    (existingData.singleWomanName ?? '') !== '' ||
    (existingData.singleWomanPhone ?? '') !== ''
  );

  const isSingleManDisabled = existingData && (
    (existingData.singleManName ?? '') !== '' ||
    (existingData.singleManPhone ?? '') !== ''
  );

  // Fetch bidang options and existing emails on component mount
  useEffect(() => {
    const fetchBidangOptions = async () => {
      try {
        const bidangResponse = await fetch('/api/bidang-options');

        if (bidangResponse.ok) {
          const bidangData = await bidangResponse.json();
          setBidangOptions(bidangData.options || []);
        } else {
          console.error('Failed to fetch bidang options');
          setBidangOptions([]);
        }
      } catch (error) {
        console.error('Error fetching bidang options:', error);
        setBidangOptions([]);
      } finally {
        setIsLoadingBidang(false);
      }
    };

    fetchBidangOptions();
  }, []);

  // Check if bidang exists and has registrations
  const checkBidangExists = useCallback(async (bidang: string) => {
    if (!bidang || bidang.trim() === '') {
      setExistingData(null);
      return;
    }

    setIsCheckingBidang(true);
    try {
      const response = await fetch('/api/bidang-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidang: bidang.trim() }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.exists && result.registration) {
          setExistingData(result.registration);
          // Prefill form with existing data
          setFormData(prev => ({
            ...prev,
            singleWomanName: result.registration.singleWomanName || '',
            singleWomanPhone: result.registration.singleWomanPhone || '',
            singleManName: result.registration.singleManName || '',
            singleManPhone: result.registration.singleManPhone || '',
            doublePlayer1Name: result.registration.doublePlayer1Name || '',
            doublePlayer1Phone: result.registration.doublePlayer1Phone || '',
            doublePlayer2Name: result.registration.doublePlayer2Name || '',
            doublePlayer2Phone: result.registration.doublePlayer2Phone || '',
          }));
        } else {
          setExistingData(null);
          setFormData(prev => ({
            ...prev,
            singleWomanName: '',
            singleWomanPhone: '',
            singleManName: '',
            singleManPhone: '',
            doublePlayer1Name: '',
            doublePlayer1Phone: '',
            doublePlayer2Name: '',
            doublePlayer2Phone: '',
          }));
        }
      }
    } catch (error) {
      console.error('Error checking bidang:', error);
    } finally {
      setIsCheckingBidang(false);
    }
  }, []);

  // Effect to check bidang when debounced value changes
  useEffect(() => {
    if (debouncedBidang && debouncedBidang.trim() !== '') {
      checkBidangExists(debouncedBidang);
    } else {
      setExistingData(null);
    }
  }, [debouncedBidang, checkBidangExists]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.bidang.trim()) {
      newErrors.bidang = 'Bidang harus dipilih';
    }

    // Double team validation (required)
    if (!formData.doublePlayer1Name.trim()) {
      newErrors.doublePlayer1Name = 'Nama pemain double 1 harus diisi';
    } else if (formData.doublePlayer1Name.trim().length < 2) {
      newErrors.doublePlayer1Name = 'Nama pemain harus minimal 2 karakter';
    }

    if (!formData.doublePlayer2Name.trim()) {
      newErrors.doublePlayer2Name = 'Nama pemain double 2 harus diisi';
    } else if (formData.doublePlayer2Name.trim().length < 2) {
      newErrors.doublePlayer2Name = 'Nama pemain harus minimal 2 karakter';
    }

    if (!formData.doublePlayer1Phone.trim()) {
      newErrors.doublePlayer1Phone = 'Nomor handphone pemain double 1 harus diisi';
    }

    if (!formData.doublePlayer2Phone.trim()) {
      newErrors.doublePlayer2Phone = 'Nomor handphone pemain double 2 harus diisi';
    }

    // Single woman validation (optional, but if name is filled, phone is required)
    if (formData.singleWomanName.trim()) {
      if (formData.singleWomanName.trim().length < 2) {
        newErrors.singleWomanName = 'Nama pemain harus minimal 2 karakter';
      }
      if (!formData.singleWomanPhone.trim()) {
        newErrors.singleWomanPhone = 'Nomor handphone wajib diisi jika nama diisi';
      }
    }

    // Single man validation (optional, but if name is filled, phone is required)
    if (formData.singleManName.trim()) {
      if (formData.singleManName.trim().length < 2) {
        newErrors.singleManName = 'Nama pemain harus minimal 2 karakter';
      }
      if (!formData.singleManPhone.trim()) {
        newErrors.singleManPhone = 'Nomor handphone wajib diisi jika nama diisi';
      }
    }

    // Phone number validation - Indonesian format
    const phoneFields = ['doublePlayer1Phone', 'doublePlayer2Phone', 'singleWomanPhone', 'singleManPhone'] as const;

    phoneFields.forEach(field => {
      const phoneValue = formData[field].trim();
      if (phoneValue) {
        // Check if it's a valid Indonesian phone number (starts with 08 and has 10-12 digits)
        if (phoneValue.length < 10) {
          newErrors[field] = 'Nomor handphone minimal 10 digit';
        } else if (!phoneValue.startsWith('08')) {
          newErrors[field] = 'Nomor handphone harus dimulai dengan 08';
        } else if (!/^\d+$/.test(phoneValue)) {
          newErrors[field] = 'Nomor handphone hanya boleh berisi angka';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Format phone number fields
    let formattedValue = value;
    if (isPhoneField(name)) {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setErrors({});

    // Validate form
    if (!validateForm()) {
      setMessage('Silakan perbaiki kesalahan pada form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine current form data with existing data to ensure complete payload
      const completeData = {
        bidang: formData.bidang,
        singleWomanName: formData.singleWomanName || (existingData?.singleWomanName || ''),
        singleWomanPhone: formData.singleWomanPhone || (existingData?.singleWomanPhone || ''),
        singleManName: formData.singleManName || (existingData?.singleManName || ''),
        singleManPhone: formData.singleManPhone || (existingData?.singleManPhone || ''),
        doublePlayer1Name: formData.doublePlayer1Name || (existingData?.doublePlayer1Name || ''),
        doublePlayer1Phone: formData.doublePlayer1Phone || (existingData?.doublePlayer1Phone || ''),
        doublePlayer2Name: formData.doublePlayer2Name || (existingData?.doublePlayer2Name || ''),
        doublePlayer2Phone: formData.doublePlayer2Phone || (existingData?.doublePlayer2Phone || ''),
      };

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationData: completeData
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const isUpdate = result.action === 'updated';
        setMessage(
          isUpdate
            ? 'Data berhasil diperbarui! Mengarahkan ke halaman konfirmasi...'
            : 'Pendaftaran berhasil! Mengarahkan ke halaman konfirmasi...'
        );
        setFormData({
          bidang: '',
          singleWomanName: '',
          singleWomanPhone: '',
          singleManName: '',
          singleManPhone: '',
          doublePlayer1Name: '',
          doublePlayer1Phone: '',
          doublePlayer2Name: '',
          doublePlayer2Phone: '',
        });
        // Reset bidang status
        setExistingData(null);
        setTimeout(() => {
          router.push('/success');
        }, 2000);
      } else {
        setMessage(result.error || 'Terjadi kesalahan saat mendaftar.');
      }
    } catch (error) {
      console.log('Registration error:', error);
      setMessage('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-2xl mx-auto bg-gradient-to-b from-card to-secondary rounded-2xl shadow-2xl overflow-hidden border border-accent/50">
      {/* Form Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary p-6 text-center relative overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-accent via-accent to-accent rounded-full mx-auto mb-3 flex items-center justify-center text-2xl shadow-[0_8px_25px_rgba(212,175,55,0.4)] border-2 border-white/30">
            📝
          </div>
          <h2 className="text-2xl font-bold mb-2 text-accent">FORM PENDAFTARAN</h2>
          <p className="text-sm opacity-90 text-accent">TI Billiard Cup 2025</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        {/* Instructions */}
        <div className="bg-secondary border-l-4 border-accent p-4 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-accent mb-2">📋 Petunjuk Pendaftaran:</h3>
          <ul className="text-sm text-foreground space-y-1">
            <li>• Pilih bidang Anda dari dropdown menu yang tersedia</li>
            <li>• <strong>Wajib diisi:</strong> Kategori Double (2 pemain dengan nomor handphone masing-masing)</li>
            <li>• <strong>Opsional:</strong> Kategori Single Woman (1 pemain) dan/atau Single Man (1 pemain)</li>
            <li>• Maksimal 4 peserta per bidang: 2 double + 1 single woman + 1 single man</li>
            <li>• Minimal harus mengisi kategori Double untuk dapat mendaftar</li>
            <li>• Nomor handphone harus aktif WhatsApp untuk komunikasi turnamen</li>
            <li>• Format nomor handphone: dimulai dengan 08, contoh 08123456789 (10-12 digit, hanya angka)</li>
          </ul>
        </div>

        {/* Tournament Information */}
        <div className="bg-secondary border-l-4 border-accent p-4 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-accent mb-2">📅 Informasi Turnamen:</h3>
          <div className="text-sm text-foreground space-y-2 mb-4">
            <p><strong>Tanggal:</strong> 22 November 2025 - Selesai</p>
            <p><strong>Waktu:</strong> 18.00 - 20.00 WIB</p>
            <p><strong>Lokasi:</strong> Greenlight Cafe & Billiard</p>
            <p><strong>Alamat:</strong> Jl. Purnawarman No.3, Bandung</p>
          </div>

          {/* Google Maps Embed */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-accent/50 mb-2">
            <iframe
              width="100%"
              height="100%"
              src="https://maps.google.com/maps?q=greenlight+cafe+%26+billiard&t=&z=15&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              className="w-full h-full"
              title="Lokasi Greenlight Cafe & Billiard"
            ></iframe>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields Disabled Message */}
          <div className="bg-gradient-to-r from-secondary/50 to-muted/30 border border-accent/30 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-accent flex items-center gap-2">
              <span>🔒</span>
              {isCheckingBidang
                ? 'Mengecek ketersediaan bidang...'
                : (formData.bidang.trim() === ''
                  ? 'Silakan pilih bidang untuk melanjutkan pendaftaran.'
                  : 'Silakan lengkapi form di bawah ini untuk mendaftar.'
                )
              }
            </p>
          </div>

          {/* Bidang Selection */}
          <div className="form-input">
            <label htmlFor="bidang" className="block text-sm font-semibold text-accent mb-2">
              Bidang <span className="text-accent">*</span>
            </label>
            <select
              id="bidang"
              name="bidang"
              value={formData.bidang}
              onChange={handleInputChange}
              required
              disabled={isLoadingBidang}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground bg-input backdrop-blur-sm placeholder-muted-foreground ${errors.bidang ? 'border-destructive' : 'border-border'} ${isLoadingBidang || isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="" className="bg-background text-foreground">
                {isLoadingBidang ? 'Memuat bidang...' : 'Pilih Bidang'}
              </option>
              {bidangOptions.length === 0 && !isLoadingBidang ? (
                <option value="" className="bg-background text-foreground" disabled>
                  Tidak ada bidang tersedia
                </option>
              ) : (
                bidangOptions.map((bidang) => (
                  <option key={bidang} value={bidang} className="bg-background text-foreground">
                    {bidang}
                  </option>
                ))
              )}
            </select>
            {errors.bidang && (
              <p className="mt-1 text-sm text-red-400">{errors.bidang}</p>
            )}
          </div>

          {/* Double Category - Required */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-secondary/30 to-muted/30 rounded-lg border border-accent/20">
            <h4 className="text-lg font-semibold text-accent">ⓘ Kategori Double (Wajib)</h4>

            {/* Contact message for disabled section */}
            {isDoubleDisabled && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded flex items-start gap-2.5">
                <span className="text-amber-600 font-bold text-lg flex-shrink-0 mt-0.5">⚠️</span>
                <span className="text-amber-800 text-sm leading-relaxed">
                  Silahkan hubungi kontak di bawah untuk mengubah peserta yang sudah didaftarkan
                </span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Double Player 1 */}
              <div className="form-input">
                <label htmlFor="doublePlayer1Name" className="block text-sm font-semibold text-accent mb-2">
                  Nama Pemain 1 <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="doublePlayer1Name"
                  name="doublePlayer1Name"
                  value={formData.doublePlayer1Name}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap pemain 1"
                  required
                  disabled={isFormDisabled || (existingData?.doublePlayer1Name ?? '') !== ''}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${errors.doublePlayer1Name ? 'border-red-400' : 'border-border'
                    } ${isFormDisabled ?
                      'opacity-30 cursor-not-allowed bg-input/50' :
                      (existingData?.doublePlayer1Name ?? '') !== '' ? 'opacity-30 cursor-not-allowed' :
                        'bg-input/50'
                    }`}
                />
                {errors.doublePlayer1Name && (
                  <p className="mt-1 text-sm text-red-400">{errors.doublePlayer1Name}</p>
                )}
              </div>

              <div className="form-input">
                <label htmlFor="doublePlayer1Phone" className="block text-sm font-semibold text-accent mb-2">
                  No. HP Pemain 1 <span className="text-accent">*</span>
                </label>
                <input
                  type="tel"
                  id="doublePlayer1Phone"
                  name="doublePlayer1Phone"
                  value={
                    (existingData?.doublePlayer1Phone ?? '') !== ''
                      ? maskPhoneNumber(existingData?.doublePlayer1Phone || '')
                      : formData.doublePlayer1Phone
                  }
                  onChange={handleInputChange}
                  placeholder="08xxxxxxxxxx"
                  pattern="08[0-9]{8,10}"
                  inputMode="numeric"
                  required
                  disabled={isFormDisabled || (existingData?.doublePlayer1Phone ?? '') !== ''}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${errors.doublePlayer1Phone ? 'border-red-400' : 'border-border'
                    } ${isFormDisabled ? 'opacity-50 cursor-not-allowed bg-input/50' :
                      (existingData?.doublePlayer1Phone ?? '') !== '' ? 'opacity-30 cursor-not-allowed' :
                        'bg-input/50'
                    }`}
                />
                {errors.doublePlayer1Phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.doublePlayer1Phone}</p>
                )}
              </div>

              {/* Double Player 2 */}
              <div className="form-input">
                <label htmlFor="doublePlayer2Name" className="block text-sm font-semibold text-accent mb-2">
                  Nama Pemain 2 <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="doublePlayer2Name"
                  name="doublePlayer2Name"
                  value={formData.doublePlayer2Name}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap pemain 2"
                  required
                  disabled={isFormDisabled || (existingData?.doublePlayer2Name ?? '') !== ''}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${errors.doublePlayer2Name ? 'border-red-400' : 'border-border'
                    } ${isFormDisabled ? 'opacity-50 cursor-not-allowed bg-input' :
                      (existingData?.doublePlayer2Name ?? '') !== '' ? 'opacity-30 cursor-not-allowed' :
                        'bg-input/50'
                    }`}
                />
                {errors.doublePlayer2Name && (
                  <p className="mt-1 text-sm text-red-400">{errors.doublePlayer2Name}</p>
                )}
              </div>

              <div className="form-input">
                <label htmlFor="doublePlayer2Phone" className="block text-sm font-semibold text-accent mb-2">
                  No. HP Pemain 2 <span className="text-accent">*</span>
                </label>
                <input
                  type="tel"
                  id="doublePlayer2Phone"
                  name="doublePlayer2Phone"
                  value={
                    (existingData?.doublePlayer2Phone ?? '') !== ''
                      ? maskPhoneNumber(existingData?.doublePlayer2Phone || '')
                      : formData.doublePlayer2Phone
                  }
                  onChange={handleInputChange}
                  placeholder="08xxxxxxxxxx"
                  pattern="08[0-9]{8,10}"

                  inputMode="numeric"
                  required
                  disabled={isFormDisabled || (existingData?.doublePlayer2Phone ?? '') !== ''}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${errors.doublePlayer2Phone ? 'border-red-400' : 'border-border'
                    } ${isFormDisabled ? 'opacity-50 cursor-not-allowed bg-input/50' :
                      (existingData?.doublePlayer2Phone ?? '') !== '' ? 'opacity-30 cursor-not-allowed' :
                        'bg-input/50'
                    }`}
                />
                {errors.doublePlayer2Phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.doublePlayer2Phone}</p>
                )}
              </div>
            </div>
          </div>



          {/* Single Woman - Optional */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-secondary/20 to-muted/20 rounded-lg border border-accent/10">
            <h4 className="text-lg font-semibold text-accent">� Single Putri (Opsional)</h4>

            {/* Contact message for disabled section */}
            {isSingleWomanDisabled && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded flex items-start gap-2.5">
                <span className="text-amber-600 font-bold text-lg flex-shrink-0 mt-0.5">⚠️</span>
                <span className="text-amber-800 text-sm leading-relaxed">
                  Silahkan hubungi kontak di bawah untuk mengubah peserta yang sudah didaftarkan
                </span>
              </div>
            )}

            <div className="form-input">
              <label htmlFor="singleWomanName" className="block text-sm font-semibold text-accent mb-2">
                Nama Lengkap <span className="text-muted-foreground">(Opsional)</span>
              </label>
              <input
                type="text"
                id="singleWomanName"
                name="singleWomanName"
                value={formData.singleWomanName}
                onChange={handleInputChange}
                placeholder="Nama lengkap peserta putri (opsional)"
                disabled={isFormDisabled || (existingData?.singleWomanName ?? '') !== ''}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${errors.singleWomanName ? 'border-red-400' : 'border-border'
                  } ${isFormDisabled ? 'opacity-50 cursor-not-allowed bg-input/50' :
                    (existingData?.singleWomanName ?? '') !== '' ? 'opacity-30 cursor-not-allowed' :
                      'bg-input/50'
                  }`}
              />
              {errors.singleWomanName && (
                <p className="mt-1 text-sm text-red-400">{errors.singleWomanName}</p>
              )}
            </div>

            <div className="form-input">
              <label htmlFor="singleWomanPhone" className="block text-sm font-semibold text-accent mb-2">
                Nomor Handphone (WA) <span className="text-muted-foreground">(Opsional)</span>
              </label>
              <input
                type="tel"
                id="singleWomanPhone"
                name="singleWomanPhone"
                value={
                  (existingData?.singleWomanPhone ?? '') !== ''
                    ? maskPhoneNumber(existingData?.singleWomanPhone || '')
                    : formData.singleWomanPhone
                }
                onChange={handleInputChange}
                placeholder="08xxxxxxxxxx (opsional)"
                pattern="08[0-9]{8,10}"

                inputMode="numeric"
                disabled={isFormDisabled || (existingData?.singleWomanPhone ?? '') !== ''}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${errors.singleWomanPhone ? 'border-red-400' : 'border-border'
                  } ${isFormDisabled ? 'opacity-50 cursor-not-allowed bg-input/50' :
                    (existingData?.singleWomanPhone ?? '') !== '' ? 'opacity-30 cursor-not-allowed' :
                      'bg-input/50'
                  }`}
              />
              {errors.singleWomanPhone && (
                <p className="mt-1 text-sm text-red-400">{errors.singleWomanPhone}</p>
              )}
            </div>
          </div>

          {/* Single Man - Optional */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-secondary/20 to-muted/20 rounded-lg border border-accent/10">
            <h4 className="text-lg font-semibold text-accent">� Single Putra (Opsional)</h4>

            {/* Contact message for disabled section */}
            {isSingleManDisabled && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded flex items-start gap-2.5">
                <span className="text-amber-600 font-bold text-lg flex-shrink-0 mt-0.5">⚠️</span>
                <span className="text-amber-800 text-sm leading-relaxed">
                  Silahkan hubungi kontak di bawah untuk mengubah peserta yang sudah didaftarkan
                </span>
              </div>
            )}

            <div className="form-input">
              <label htmlFor="singleManName" className="block text-sm font-semibold text-accent mb-2">
                Nama Lengkap <span className="text-muted-foreground">(Opsional)</span>
              </label>
              <input
                type="text"
                id="singleManName"
                name="singleManName"
                value={formData.singleManName}
                onChange={handleInputChange}
                placeholder="Nama lengkap peserta putra (opsional)"
                disabled={isFormDisabled || (existingData?.singleManName ?? '') !== ''}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${errors.singleManName ? 'border-red-400' : 'border-border'
                  } ${isFormDisabled ? 'opacity-50 cursor-not-allowed bg-input/50' :
                    (existingData?.singleManName ?? '') !== '' ? 'opacity-30 cursor-not-allowed' :
                      'bg-input/50'
                  }`}
              />
              {errors.singleManName && (
                <p className="mt-1 text-sm text-red-400">{errors.singleManName}</p>
              )}
            </div>

            <div className="form-input">
              <label htmlFor="singleManPhone" className="block text-sm font-semibold text-accent mb-2">
                Nomor Handphone (WA) <span className="text-muted-foreground">(Opsional)</span>
              </label>
              <input
                type="tel"
                id="singleManPhone"
                name="singleManPhone"
                value={
                  (existingData?.singleManPhone ?? '') !== ''
                    ? maskPhoneNumber(existingData?.singleManPhone || '')
                    : formData.singleManPhone
                }
                onChange={handleInputChange}
                placeholder="08xxxxxxxxxx (opsional)"
                pattern="08[0-9]{8,10}"

                inputMode="numeric"
                disabled={isFormDisabled || (existingData?.singleManPhone ?? '') !== ''}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${errors.singleManPhone ? 'border-red-400' : 'border-border'
                  } ${isFormDisabled ? 'opacity-50 cursor-not-allowed bg-input/50' :
                    (existingData?.singleManPhone ?? '') !== '' ? 'opacity-30 cursor-not-allowed' :
                      'bg-input/50'
                  }`}
              />
              {errors.singleManPhone && (
                <p className="mt-1 text-sm text-red-400">{errors.singleManPhone}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isFormDisabled}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all transform border border-accent-400/50 ${isSubmitting || isFormDisabled
              ? 'bg-input cursor-not-allowed text-muted-foreground'
              : 'bg-gradient-to-r from-accent to-accent hover:from-accent hover:to-accent hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl hover:shadow-accent/25 text-accent-foreground'
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-border border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </div>
            ) : isFormDisabled ? (
              isCheckingBidang ? 'Mengecek Bidang...' : formData.bidang.trim() === '' ? 'Pilih Bidang' : 'Bidang Error'
            ) : (
              '🚀 DAFTAR SEKARANG'
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className="bg-black rounded-lg">
            <div className={`mt-6 p-4 rounded-lg backdrop-blur-sm ${message.includes('berhasil')
              ? 'bg-green-900/50 border border-green-400/50 text-green-300'
              : 'bg-red-900/70 border border-red-400/50 text-red-300'
              }`}>
              {message}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            📞 Butuh bantuan? Hubungi:
          </p>
          <div className="space-y-2">
            <a
              href="https://wa.me/+6285189970998"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-accent transition-colors duration-300 block"
            >
              📱 085189970998 (Michael Sean - TI)
            </a>
            <a
              href="https://wa.me/+6285624055869"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-accent transition-colors duration-300 block"
            >
              📱 085624055869 (Novi - TI)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}