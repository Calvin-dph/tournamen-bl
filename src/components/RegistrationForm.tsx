'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Player {
  player1Name: string;
  player1Phone: string;
  player2Name: string;
  player2Phone: string;
  [key: string]: string; // Add index signature for dynamic access
}

interface SinglePlayer {
  name: string;
  phone: string;
  [key: string]: string; // Add index signature for dynamic access
}

interface FormData {
  bidang: string;
  single: SinglePlayer;
  double1: Player;
  double2: Player;
}

interface FormErrors {
  bidang?: string;
  single?: {
    name?: string;
    phone?: string;
  };
  double1?: {
    player1Name?: string;
    player1Phone?: string;
    player2Name?: string;
    player2Phone?: string;
  };
  double2?: {
    player1Name?: string;
    player1Phone?: string;
    player2Name?: string;
    player2Phone?: string;
  };
}

// Configuration for form sections
interface SectionConfig {
  key: keyof FormData;
  title: string;
  icon: string;
  required: boolean;
  type: 'single' | 'double';
  fields: Array<{
    key: string;
    label: string;
    required: boolean;
    type: 'text' | 'tel';
    placeholder: string;
  }>;
}

const setErrorForField = (
  errors: FormErrors,
  sectionKey: keyof FormData,
  fieldKey: string,
  message: string
): void => {
  if (!errors[sectionKey]) {
    if (sectionKey === 'single') {
      errors.single = {};
    } else if (sectionKey === 'double1') {
      errors.double1 = {};
    } else if (sectionKey === 'double2') {
      errors.double2 = {};
    }
  }
  
  const sectionErrors = errors[sectionKey];
  if (sectionErrors) {
    (sectionErrors as Record<string, string>)[fieldKey] = message;
  }
};

const getErrorForField = (
  errors: FormErrors,
  sectionKey: keyof FormData,
  fieldKey: string
): string | undefined => {
  const sectionErrors = errors[sectionKey];
  if (!sectionErrors) return undefined;
  return (sectionErrors as Record<string, string>)[fieldKey];
};

const formSections: SectionConfig[] = [
  {
    key: 'double1',
    title: 'Kategori Ganda 1 (Wajib)',
    icon: 'ⓘ',
    required: true,
    type: 'double',
    fields: [
      { key: 'player1Name', label: 'Nama Pemain 1', required: true, type: 'text', placeholder: 'Nama lengkap pemain 1' },
      { key: 'player1Phone', label: 'No. HP Pemain 1', required: true, type: 'tel', placeholder: '08xxxxxxxxxx' },
      { key: 'player2Name', label: 'Nama Pemain 2', required: true, type: 'text', placeholder: 'Nama lengkap pemain 2' },
      { key: 'player2Phone', label: 'No. HP Pemain 2', required: true, type: 'tel', placeholder: '08xxxxxxxxxx' },
    ]
  },
  {
    key: 'double2',
    title: 'Kategori Ganda 2 (Opsional)',
    icon: '⚬',
    required: false,
    type: 'double',
    fields: [
      { key: 'player1Name', label: 'Nama Pemain 1', required: false, type: 'text', placeholder: 'Nama lengkap pemain 1 (opsional)' },
      { key: 'player1Phone', label: 'No. HP Pemain 1', required: false, type: 'tel', placeholder: '08xxxxxxxxxx (opsional)' },
      { key: 'player2Name', label: 'Nama Pemain 2', required: false, type: 'text', placeholder: 'Nama lengkap pemain 2 (opsional)' },
      { key: 'player2Phone', label: 'No. HP Pemain 2', required: false, type: 'tel', placeholder: '08xxxxxxxxxx (opsional)' },
    ]
  },
  {
    key: 'single',
    title: 'Kategori Single (Opsional)',
    icon: '◉',
    required: false,
    type: 'single',
    fields: [
      { key: 'name', label: 'Nama Lengkap', required: false, type: 'text', placeholder: 'Nama lengkap peserta (opsional)' },
      { key: 'phone', label: 'Nomor Handphone (WA)', required: false, type: 'tel', placeholder: '08xxxxxxxxxx (opsional)' },
    ]
  }
];

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
    single: {
      name: '',
      phone: '',
    },
    double1: {
      player1Name: '',
      player1Phone: '',
      player2Name: '',
      player2Phone: '',
    },
    double2: {
      player1Name: '',
      player1Phone: '',
      player2Name: '',
      player2Phone: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);

  // Debounce bidang input
  const debouncedBidang = useDebounce(formData.bidang, 500);

  // Check if form fields should be disabled
  const isFormDisabled = isCheckingBidang || formData.bidang.trim() === '';

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
            single: {
              name: result.registration.single?.name || '',
              phone: result.registration.single?.phone || '',
            },
            double1: {
              player1Name: result.registration.double1?.player1Name || '',
              player1Phone: result.registration.double1?.player1Phone || '',
              player2Name: result.registration.double1?.player2Name || '',
              player2Phone: result.registration.double1?.player2Phone || '',
            },
            double2: {
              player1Name: result.registration.double2?.player1Name || '',
              player1Phone: result.registration.double2?.player1Phone || '',
              player2Name: result.registration.double2?.player2Name || '',
              player2Phone: result.registration.double2?.player2Phone || '',
            },
          }));
        } else {
          setExistingData(null);
          setFormData(prev => ({
            ...prev,
            single: {
              name: '',
              phone: '',
            },
            double1: {
              player1Name: '',
              player1Phone: '',
              player2Name: '',
              player2Phone: '',
            },
            double2: {
              player1Name: '',
              player1Phone: '',
              player2Name: '',
              player2Phone: '',
            },
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
    const newErrors: FormErrors = {};

    if (!formData.bidang.trim()) {
      newErrors.bidang = 'Bidang harus dipilih';
    }

    // Validate each section based on configuration
    formSections.forEach(section => {
      const sectionData = formData[section.key] as Player | SinglePlayer;
      const hasAnyData = section.fields.some(field => {
        const value = sectionData[field.key];
        return value && value.trim() !== '';
      });

      // If section is required OR has any data, validate all required fields in that section
      if (section.required || hasAnyData) {
        section.fields.forEach(field => {
          const value = sectionData[field.key];
          const trimmedValue = value ? value.trim() : '';

          // Check if field is required (either section is required and field is required, or section has data and field is required for consistency)
          const isFieldRequired = (section.required && field.required) || (hasAnyData && field.required);

          if (isFieldRequired && !trimmedValue) {
            setErrorForField(newErrors, section.key, field.key, `${field.label} harus diisi`);
          } else if (trimmedValue && field.type === 'text' && trimmedValue.length < 2) {
            setErrorForField(newErrors, section.key, field.key, 'Nama pemain harus minimal 2 karakter');
          } else if (trimmedValue && field.type === 'tel') {
            // Phone number validation
            if (trimmedValue.length < 10) {
              setErrorForField(newErrors, section.key, field.key, 'Nomor handphone minimal 10 digit');
            } else if (!trimmedValue.startsWith('08')) {
              setErrorForField(newErrors, section.key, field.key, 'Nomor handphone harus dimulai dengan 08');
            } else if (!/^\d+$/.test(trimmedValue)) {
              setErrorForField(newErrors, section.key, field.key, 'Nomor handphone hanya boleh berisi angka');
            }
          }
        });
      }

      // Special validation for single: if name is filled, phone is required
      if (section.key === 'single' && !section.required) {
        const singleData = sectionData as SinglePlayer;
        const nameValue = singleData.name?.trim();
        const phoneValue = singleData.phone?.trim();

        if (nameValue && !phoneValue) {
          setErrorForField(newErrors, section.key, 'phone', 'Nomor handphone wajib diisi jika nama diisi');
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).filter(key => key !== 'bidang' || newErrors.bidang).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle bidang field separately
    if (name === 'bidang') {
      setFormData(prev => ({
        ...prev,
        bidang: value
      }));
      return;
    }

    // Parse nested field names like "double1.player1Name" or "single.name"
    const [section, field] = name.split('.');
    
    // Format phone number fields
    let formattedValue = value;
    if (field && field.includes('Phone')) {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof FormData] as Player | SinglePlayer),
        [field]: formattedValue
      }
    }));
  };

  // Function to handle actual form submission
  const submitRegistration = async () => {
    setIsSubmitting(true);
    setShowTermsModal(false);

    try {
      // Combine current form data with existing data to ensure complete payload
      const completeData = {
        bidang: formData.bidang,
        single: {
          name: formData.single.name || (existingData?.single?.name || ''),
          phone: formData.single.phone || (existingData?.single?.phone || ''),
        },
        double1: {
          player1Name: formData.double1.player1Name || (existingData?.double1?.player1Name || ''),
          player1Phone: formData.double1.player1Phone || (existingData?.double1?.player1Phone || ''),
          player2Name: formData.double1.player2Name || (existingData?.double1?.player2Name || ''),
          player2Phone: formData.double1.player2Phone || (existingData?.double1?.player2Phone || ''),
        },
        double2: {
          player1Name: formData.double2.player1Name || (existingData?.double2?.player1Name || ''),
          player1Phone: formData.double2.player1Phone || (existingData?.double2?.player1Phone || ''),
          player2Name: formData.double2.player2Name || (existingData?.double2?.player2Name || ''),
          player2Phone: formData.double2.player2Phone || (existingData?.double2?.player2Phone || ''),
        },
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
          single: {
            name: '',
            phone: '',
          },
          double1: {
            player1Name: '',
            player1Phone: '',
            player2Name: '',
            player2Phone: '',
          },
          double2: {
            player1Name: '',
            player1Phone: '',
            player2Name: '',
            player2Phone: '',
          },
        });
        // Reset bidang status
        setExistingData(null);
        setAgreedToTerms(false);
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
      setPendingSubmission(false);
    }
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

    // Show terms modal instead of submitting directly
    setPendingSubmission(true);
    setShowTermsModal(true);
  };

  // Terms & Conditions Modal Component
  const TermsModal = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [modalScrolledToBottom, setModalScrolledToBottom] = useState(false);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Reset scroll state when modal opens
    useEffect(() => {
      if (showTermsModal) {
        setModalScrolledToBottom(false);
      }
    }, []); // Remove showTermsModal dependency

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      
      // Check if scrolled to bottom (with 30px tolerance for better UX)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30;
      
      // Clear previous timeout to prevent multiple updates
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Immediate update for scroll to bottom, debounced for scroll away
      if (isAtBottom && !modalScrolledToBottom) {
        setModalScrolledToBottom(true);
      } else if (!isAtBottom && modalScrolledToBottom) {
        // Small delay when scrolling away from bottom
        scrollTimeoutRef.current = setTimeout(() => {
          setModalScrolledToBottom(false);
        }, 100);
      }
    };

    const handleApprove = () => {
      setAgreedToTerms(true);
      submitRegistration();
    };

    const handleCancel = () => {
      // Clear timeout when closing
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      setShowTermsModal(false);
      setPendingSubmission(false);
      setModalScrolledToBottom(false);
    };

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${showTermsModal ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleCancel}
        ></div>
        
        {/* Modal Content */}
        <div className="relative bg-card border border-accent/30 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary p-4 border-b border-accent/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-accent">📋 Syarat & Ketentuan</h3>
              <button
                onClick={handleCancel}
                className="text-accent hover:text-accent/80 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-accent/80 mt-2">
              Silakan baca seluruh syarat dan ketentuan hingga selesai untuk melanjutkan pendaftaran
            </p>
          </div>

          {/* Content */}
          <div 
            ref={contentRef}
            className="p-6 overflow-y-auto flex-1"
            onScroll={handleScroll}
            style={{ 
              scrollBehavior: 'auto',
              overscrollBehavior: 'contain',
              position: 'relative'
            }}
          >
          <div className="space-y-6 text-foreground">
            <div>
              <h4 className="font-bold text-accent mb-2">🏆 TI Billiard Cup 2025 - Syarat & Ketentuan</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Dalam rangka menjaga sportifitas, kenyamanan, dan ketertiban selama kegiatan TI Billiard Cup 2025, peserta diwajibkan mematuhi seluruh peraturan berikut:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-accent mb-2">🧾 A. Ketentuan Umum</h5>
                <ul className="text-sm space-y-1 text-foreground ml-4">
                  <li>• Peserta wajib merupakan staf aktif Ganesha Operation Pusat.</li>
                  <li>• Setiap bidang maksimal mendaftarkan 2 tim Ganda (boleh mix pria/wanita) dan 1 peserta untuk kategori Single (pria).</li>
                  <li>• Peserta wajib hadir tepat waktu sesuai jadwal pertandingan yang telah ditentukan.</li>
                  <li>• Peserta yang tidak hadir 10 menit setelah jadwal pertandingan dimulai akan dianggap gugur (walk out).</li>
                  <li>• Dilarang melakukan protes tidak sopan kepada panitia, wasit, atau peserta lain.</li>
                  <li>• Semua keputusan panitia dan wasit bersifat final dan tidak dapat diganggu gugat.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-accent mb-2">🚫 B. Larangan Selama Kegiatan</h5>
                <ul className="text-sm space-y-1 text-foreground ml-4">
                  <li>• Dilarang membawa atau mengonsumsi minuman keras, obat-obatan terlarang, atau zat adiktif lainnya di area acara.</li>
                  <li>• Dilarang merokok di area dalam ruangan (indoor) kecuali di tempat yang telah disediakan.</li>
                  <li>• Dilarang membawa senjata tajam, senjata api, atau barang berbahaya lainnya.</li>
                  <li>• Dilarang menggunakan kata-kata kasar, menghina, atau melakukan tindakan tidak sportif kepada peserta lain.</li>
                  <li>• Dilarang melakukan taruhan (judi) dalam bentuk apa pun selama kegiatan berlangsung.</li>
                  <li>• Dilarang merusak fasilitas tempat pertandingan — peserta yang melanggar wajib mengganti kerusakan yang terjadi.</li>
                  <li>• Dilarang membawa makanan atau minuman dari luar tanpa izin panitia.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-accent mb-2">🏆 C. Etika dan Sportivitas</h5>
                <ul className="text-sm space-y-1 text-foreground ml-4">
                  <li>• Junjung tinggi sportivitas, kebersamaan, dan solidaritas antar bidang.</li>
                  <li>• Setiap pertandingan akan dipimpin oleh wasit resmi yang ditunjuk oleh panitia.</li>
                  <li>• Peserta wajib menggunakan pakaian rapi dan sopan selama kegiatan berlangsung.</li>
                  <li>• Tim wajib menjaga kebersihan area pertandingan sebelum dan sesudah bermain.</li>
                  <li>• Segala bentuk perselisihan atau insiden selama kegiatan harus segera dilaporkan kepada panitia untuk diselesaikan secara baik-baik.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-accent mb-2">📱 D. Lain-lain</h5>
                <ul className="text-sm space-y-1 text-foreground ml-4">
                  <li>• Dokumentasi kegiatan dapat digunakan oleh panitia untuk keperluan publikasi internal.</li>
                  <li>• Panitia tidak bertanggung jawab atas kehilangan barang pribadi selama acara.</li>
                  <li>• Dengan mengikuti turnamen ini, peserta dianggap telah membaca, memahami, dan menyetujui seluruh peraturan yang berlaku.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-accent mb-2">📅 Informasi Turnamen</h5>
                <ul className="text-sm space-y-1 text-foreground ml-4">
                  <li>• Batas Pendaftaran: 21 November 2025</li>
                  <li>• Tanggal Turnamen: 22 November 2025</li>
                  <li>• Waktu: 18.00 - 20.00 WIB</li>
                  <li>• Lokasi: Greenlight Cafe & Billiard, Jl. Purnawarman No.3, Bandung</li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-accent mb-2">📞 Kontak</h5>
                <ul className="text-sm space-y-1 text-foreground ml-4">
                  <li>• Untuk pertanyaan lebih lanjut, hubungi:</li>
                  <li>• Michael Sean (TI): 085189970998</li>
                  <li>• Novi (TI): 085624055869</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ Dengan menyetujui syarat dan ketentuan ini, Anda menyatakan telah membaca, memahami, 
                dan bersedia mengikuti seluruh aturan yang berlaku dalam TI Billiard Cup 2025. 
                Pelanggaran terhadap syarat dan ketentuan dapat mengakibatkan diskualifikasi.
              </p>
            </div>
          </div>
          </div>

          {/* Footer - Always visible */}
          <div className="p-4 border-t border-accent/30 bg-secondary/50 flex-shrink-0">
            {/* Fixed height container to prevent layout shift */}
            <div className="min-h-[20px] mb-3 text-center">
              {!modalScrolledToBottom && (
                <p className="text-sm text-amber-600 flex items-center justify-center gap-2">
                  <span>⬇️</span>
                  Silakan gulir ke bawah untuk membaca seluruh syarat dan ketentuan
                  <span>⬇️</span>
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-foreground hover:text-accent transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleApprove}
                disabled={!modalScrolledToBottom || isSubmitting}
                className={`px-6 py-2 rounded-lg transition-all min-w-[160px] ${
                  modalScrolledToBottom && !isSubmitting
                    ? 'bg-gradient-to-r from-accent to-accent text-accent-foreground hover:shadow-lg'
                    : 'bg-input text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </div>
                ) : modalScrolledToBottom ? (
                  'Setuju & Daftar'
                ) : (
                  'Baca Hingga Selesai'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Terms & Conditions Modal */}
      <TermsModal />
      
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
            <li>• <strong>Wajib diisi:</strong> Kategori Ganda 1 (2 pemain dengan nomor handphone masing-masing)</li>
            <li>• <strong>Opsional:</strong> Kategori Ganda 2 (2 pemain) dan/atau Single (1 pemain)</li>
            <li>• Maksimal 5 peserta per bidang: 2 ganda (4 orang) + 1 single (1 orang)</li>
            <li>• Minimal harus mengisi kategori Ganda 1 untuk dapat mendaftar</li>
            <li>• Nomor handphone harus aktif WhatsApp untuk komunikasi turnamen</li>
            <li>• Format nomor handphone: dimulai dengan 08, contoh 08123456789 (10-12 digit, hanya angka)</li>
          </ul>
        </div>

        {/* Tournament Information */}
        <div className="bg-secondary border-l-4 border-accent p-4 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-accent mb-2">📅 Informasi Turnamen:</h3>
          <div className="text-sm text-foreground space-y-2 mb-4">
            <p><strong>Batas Pendaftaran:</strong> 21 November 2025</p>
            <p><strong>Tanggal Turnamen:</strong> 22 November 2025</p>
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground bg-input backdrop-blur-sm placeholder-muted-foreground ${errors.bidang ? 'border-destructive' : 'border-border'} ${isLoadingBidang ? 'opacity-50 cursor-not-allowed' : ''}`}
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

          {/* Dynamic Form Sections */}
          {formSections.map(section => {
            const sectionData = formData[section.key] as Player | SinglePlayer;
            
            // Check if section is disabled due to existing data
            const isSectionDisabled = existingData && section.fields.some(field => {
              const existingSection = existingData[section.key] as Player | SinglePlayer | undefined;
              const existingValue = existingSection?.[field.key];
              return existingValue && existingValue.trim() !== '';
            });

            return (
              <div key={section.key} className={`space-y-4 p-4 rounded-lg border ${
                section.required 
                  ? 'bg-gradient-to-r from-secondary/30 to-muted/30 border-accent/20' 
                  : 'bg-gradient-to-r from-secondary/20 to-muted/20 border-accent/10'
              }`}>
                <h4 className="text-lg font-semibold text-accent">{section.icon} {section.title}</h4>

                {/* Contact message for disabled section */}
                {isSectionDisabled && (
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded flex items-start gap-2.5">
                    <span className="text-amber-600 font-bold text-lg flex-shrink-0 mt-0.5">⚠️</span>
                    <span className="text-amber-800 text-sm leading-relaxed">
                      Silahkan hubungi kontak di bawah untuk mengubah peserta yang sudah didaftarkan
                    </span>
                  </div>
                )}

                <div className={`grid gap-4 ${section.type === 'double' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {section.fields.map(field => {
                    const fieldName = `${section.key}.${field.key}`;
                    const fieldValue = sectionData[field.key] || '';
                    const fieldError = getErrorForField(errors, section.key, field.key);
                    const existingSection = existingData?.[section.key] as Player | SinglePlayer | undefined;
                    const existingFieldValue = existingSection?.[field.key];
                    const isFieldDisabled = Boolean(isFormDisabled || (existingFieldValue && existingFieldValue.trim() !== ''));

                    const displayValue = existingFieldValue && existingFieldValue.trim() !== '' && field.type === 'tel'
                      ? maskPhoneNumber(existingFieldValue)
                      : fieldValue;

                    return (
                      <div key={field.key} className="form-input">
                        <label htmlFor={fieldName} className="block text-sm font-semibold text-accent mb-2">
                          {field.label} {field.required && <span className="text-accent">*</span>}
                        </label>
                        <input
                          type={field.type}
                          id={fieldName}
                          name={fieldName}
                          value={displayValue}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          pattern={field.type === 'tel' ? '08[0-9]{8,10}' : undefined}
                          inputMode={field.type === 'tel' ? 'numeric' : undefined}
                          required={field.required}
                          disabled={isFieldDisabled}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground backdrop-blur-sm placeholder-muted-foreground ${
                            fieldError ? 'border-red-400' : 'border-border'
                          } ${
                            isFormDisabled 
                              ? 'opacity-30 cursor-not-allowed bg-input/50' 
                              : isFieldDisabled 
                                ? 'opacity-30 cursor-not-allowed' 
                                : 'bg-input/50'
                          }`}
                        />
                        {fieldError && (
                          <p className="mt-1 text-sm text-red-400">{fieldError}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

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
    </>
  );
}