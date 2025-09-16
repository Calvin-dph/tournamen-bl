'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  bidang: string;
  teamA1: string;
  teamA2: string;
  teamB1: string;
  teamB2: string;
  phoneA1: string;
  phoneA2: string;
  phoneB1: string;
  phoneB2: string;
}

const bidangOptions = [
  'Teknologi Informasi (TI)',
  'Akuntansi',
  'Digital Marketing dan Media Sosial (BDMMS)',
  'Implementasi Materi Pelajaran (BIMP)',
  'Keuangan',
  'Konstruksi',
  'Marketing',
  'Operasional Pengajar (BOP)',
  'Pelayanan dan Peningkatan Prestasi Siswa (BP3S)',
  'Penelitian dan Pengembangan (LITBANG)',
  'Pengadaan, Logistik, dan Distribusi (BPLD)',
  'Penulisan Materi Ajar (BPMA)',
  'Produksi Materi Pelajaran (BPMP)',
  'Sekuriti dan Dokumentasi Aset (BSDA)',
  'Selling',
  'Sumber Daya Manusia (BSDM)',
];

export default function RegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    bidang: '',
    teamA1: '',
    teamA2: '',
    teamB1: '',
    teamB2: '',
    phoneA1: '',
    phoneA2: '',
    phoneB1: '',
    phoneB2: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.bidang.trim()) {
      newErrors.bidang = 'Bidang harus dipilih';
    }

    if (!formData.teamA1.trim()) {
      newErrors.teamA1 = 'Team A1 harus diisi';
    } else if (formData.teamA1.trim().length < 2) {
      newErrors.teamA1 = 'Nama team harus minimal 2 karakter';
    }

    if (!formData.teamA2.trim()) {
      newErrors.teamA2 = 'Team A2 harus diisi';
    } else if (formData.teamA2.trim().length < 2) {
      newErrors.teamA2 = 'Nama team harus minimal 2 karakter';
    }

    // Team B1 and B2 are optional, but if filled, should have minimum length
    if (formData.teamB1.trim() && formData.teamB1.trim().length < 2) {
      newErrors.teamB1 = 'Nama team harus minimal 2 karakter';
    }

    if (formData.teamB2.trim() && formData.teamB2.trim().length < 2) {
      newErrors.teamB2 = 'Nama team harus minimal 2 karakter';
    }

    // Phone number validation
    const phonePattern = /^[\d\s&+()-]+$/;
    
    if (!formData.phoneA1.trim()) {
      newErrors.phoneA1 = 'Nomor handphone A1 harus diisi';
    } else if (!phonePattern.test(formData.phoneA1)) {
      newErrors.phoneA1 = 'Format nomor handphone tidak valid';
    }

    if (!formData.phoneA2.trim()) {
      newErrors.phoneA2 = 'Nomor handphone A2 harus diisi';
    } else if (!phonePattern.test(formData.phoneA2)) {
      newErrors.phoneA2 = 'Format nomor handphone tidak valid';
    }

    // Phone B1 and B2 are optional, but if filled, should be valid
    if (formData.phoneB1.trim() && !phonePattern.test(formData.phoneB1)) {
      newErrors.phoneB1 = 'Format nomor handphone tidak valid';
    }

    if (formData.phoneB2.trim() && !phonePattern.test(formData.phoneB2)) {
      newErrors.phoneB2 = 'Format nomor handphone tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Pendaftaran berhasil! Mengarahkan ke halaman konfirmasi...');
        setFormData({
          bidang: '',
          teamA1: '',
          teamA2: '',
          teamB1: '',
          teamB2: '',
          phoneA1: '',
          phoneA2: '',
          phoneB1: '',
          phoneB2: '',
        });
        router.push('/success');
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
    <div className="w-full max-w-md md:max-w-2xl mx-auto bg-gradient-to-b from-[#2d3748] to-[#1a2332] rounded-2xl shadow-2xl overflow-hidden border border-[#d4af37]/50">
      {/* Form Header */}
      <div className="bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332] text-white p-6 text-center relative overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] via-[#b8941f] to-[#9c7b1a] rounded-full mx-auto mb-3 flex items-center justify-center text-2xl shadow-[0_8px_25px_rgba(212,175,55,0.4)] border-2 border-[#d4af37]/30">
            📝
          </div>
          <h2 className="text-2xl font-bold mb-2 text-[#f5f7fa]">FORM PENDAFTARAN</h2>
          <p className="text-sm opacity-90 text-[#d4af37]">TI Billiard Cup 2025</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-[#1a2332]/50 to-[#2d3748]/50 border-l-4 border-[#d4af37] p-4 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-[#d4af37] mb-2">📋 Petunjuk Pendaftaran:</h3>
          <ul className="text-sm text-[#f5f7fa] space-y-1">
            <li>• Pilih bidang Anda dari dropdown menu yang tersedia</li>
            <li>• <strong>Wajib diisi:</strong> Team A1 & A2 beserta nomor handphone masing-masing</li>
            <li>• <strong>Opsional:</strong> Team B1 & B2 beserta nomor handphone (jika ada peserta tambahan)</li>
            <li>• Maksimal 4 peserta per bidang (2 wajib + 2 opsional)</li>
            <li>• Isi nama lengkap untuk setiap peserta</li>
            <li>• Nomor handphone harus aktif WhatsApp untuk komunikasi turnamen</li>
            <li>• Format nomor handphone: contoh 083822743692 (tanpa +62 atau 0)</li>
          </ul>
        </div>

        {/* Tournament Information */}
        <div className="bg-gradient-to-r from-[#2d3748]/50 to-[#1a2332]/30 border-l-4 border-[#d4af37] p-4 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-[#d4af37] mb-2">📅 Informasi Turnamen:</h3>
          <div className="text-sm text-[#f5f7fa] space-y-2 mb-4">
            <p><strong>Tanggal:</strong> 13 - 18 Oktober 2025</p>
            <p><strong>Waktu:</strong> 18.00 - 20.00 WIB</p>
            <p><strong>Lokasi:</strong> Greenlight Cafe & Billiard</p>
            <p><strong>Alamat:</strong> Jl. Purnawarman No.3, Bandung</p>
          </div>
          
          {/* Google Maps Embed */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#d4af37]/50 mb-2">
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
          {/* Bidang Selection */}
          <div>
            <label htmlFor="bidang" className="block text-sm font-semibold text-[#d4af37] mb-2">
              Bidang <span className="text-[#d4af37]">*</span>
            </label>
            <select
              id="bidang"
              name="bidang"
              value={formData.bidang}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.bidang ? 'border-red-400' : 'border-[#2d3748]'
                }`}
            >
              <option value="" className="bg-[#1a2332] text-[#f5f7fa]">Pilih Bidang</option>
              {bidangOptions.map((bidang) => (
                <option key={bidang} value={bidang} className="bg-[#1a2332] text-[#f5f7fa]">
                  {bidang}
                </option>
              ))}
            </select>
            {errors.bidang && (
              <p className="mt-1 text-sm text-red-400">{errors.bidang}</p>
            )}
          </div>

          {/* Team A1 - Name and Phone */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-[#1a2332]/30 to-[#2d3748]/30 rounded-lg border border-[#d4af37]/20">
            <h4 className="text-lg font-semibold text-[#d4af37]">👤 Team A1 (Wajib)</h4>
            
            <div>
              <label htmlFor="teamA1" className="block text-sm font-semibold text-[#d4af37] mb-2">
                Nama Lengkap <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="text"
                id="teamA1"
                name="teamA1"
                value={formData.teamA1}
                onChange={handleInputChange}
                placeholder="Nama lengkap peserta A1"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.teamA1 ? 'border-red-400' : 'border-[#2d3748]'
                  }`}
              />
              {errors.teamA1 && (
                <p className="mt-1 text-sm text-red-400">{errors.teamA1}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneA1" className="block text-sm font-semibold text-[#d4af37] mb-2">
                Nomor Handphone (WA) <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="tel"
                id="phoneA1"
                name="phoneA1"
                value={formData.phoneA1}
                onChange={handleInputChange}
                placeholder="Contoh: 083822743692"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.phoneA1 ? 'border-red-400' : 'border-[#2d3748]'
                  }`}
              />
              {errors.phoneA1 && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneA1}</p>
              )}
            </div>
          </div>

          {/* Team A2 - Name and Phone */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-[#1a2332]/30 to-[#2d3748]/30 rounded-lg border border-[#d4af37]/20">
            <h4 className="text-lg font-semibold text-[#d4af37]">👤 Team A2 (Wajib)</h4>
            
            <div>
              <label htmlFor="teamA2" className="block text-sm font-semibold text-[#d4af37] mb-2">
                Nama Lengkap <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="text"
                id="teamA2"
                name="teamA2"
                value={formData.teamA2}
                onChange={handleInputChange}
                placeholder="Nama lengkap peserta A2"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.teamA2 ? 'border-red-400' : 'border-[#2d3748]'
                  }`}
              />
              {errors.teamA2 && (
                <p className="mt-1 text-sm text-red-400">{errors.teamA2}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneA2" className="block text-sm font-semibold text-[#d4af37] mb-2">
                Nomor Handphone (WA) <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="tel"
                id="phoneA2"
                name="phoneA2"
                value={formData.phoneA2}
                onChange={handleInputChange}
                placeholder="Contoh: 083822743693"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.phoneA2 ? 'border-red-400' : 'border-[#2d3748]'
                  }`}
              />
              {errors.phoneA2 && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneA2}</p>
              )}
            </div>
          </div>

          {/* Team B1 - Name and Phone */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-[#1a2332]/20 to-[#2d3748]/20 rounded-lg border border-[#d4af37]/10">
            <h4 className="text-lg font-semibold text-[#d4af37]">👤 Team B1 (Opsional)</h4>
            
            <div>
              <label htmlFor="teamB1" className="block text-sm font-semibold text-[#d4af37] mb-2">
                Nama Lengkap <span className="text-[#a0aec0]">(Opsional)</span>
              </label>
              <input
                type="text"
                id="teamB1"
                name="teamB1"
                value={formData.teamB1}
                onChange={handleInputChange}
                placeholder="Nama lengkap peserta B1 (opsional)"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.teamB1 ? 'border-red-400' : 'border-[#2d3748]'
                  }`}
              />
              {errors.teamB1 && (
                <p className="mt-1 text-sm text-red-400">{errors.teamB1}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneB1" className="block text-sm font-semibold text-[#d4af37] mb-2">
                Nomor Handphone (WA) <span className="text-[#a0aec0]">(Opsional)</span>
              </label>
              <input
                type="tel"
                id="phoneB1"
                name="phoneB1"
                value={formData.phoneB1}
                onChange={handleInputChange}
                placeholder="Contoh: 083822743694 (opsional)"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.phoneB1 ? 'border-red-400' : 'border-[#2d3748]'
                  }`}
              />
              {errors.phoneB1 && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneB1}</p>
              )}
            </div>
          </div>

          {/* Team B2 - Name and Phone */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-[#1a2332]/20 to-[#2d3748]/20 rounded-lg border border-[#d4af37]/10">
            <h4 className="text-lg font-semibold text-[#d4af37]">👤 Team B2 (Opsional)</h4>
            
            <div>
              <label htmlFor="teamB2" className="block text-sm font-semibold text-[#d4af37] mb-2">
                Nama Lengkap <span className="text-[#a0aec0]">(Opsional)</span>
              </label>
              <input
                type="text"
                id="teamB2"
                name="teamB2"
                value={formData.teamB2}
                onChange={handleInputChange}
                placeholder="Nama lengkap peserta B2 (opsional)"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.teamB2 ? 'border-red-400' : 'border-[#2d3748]'
                  }`}
              />
              {errors.teamB2 && (
                <p className="mt-1 text-sm text-red-400">{errors.teamB2}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneB2" className="block text-sm font-semibold text-[#d4af37] mb-2">
                Nomor Handphone (WA) <span className="text-[#a0aec0]">(Opsional)</span>
              </label>
              <input
                type="tel"
                id="phoneB2"
                name="phoneB2"
                value={formData.phoneB2}
                onChange={handleInputChange}
                placeholder="Contoh: 083822743695 (opsional)"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all text-[#f5f7fa] bg-[#2d3748]/50 backdrop-blur-sm placeholder-[#a0aec0] ${errors.phoneB2 ? 'border-red-400' : 'border-[#2d3748]'
                  }`}
              />
              {errors.phoneB2 && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneB2}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-bold text-slate-900 text-lg transition-all transform border border-amber-400/50 ${isSubmitting
              ? 'bg-[#2d3748] cursor-not-allowed text-[#a0aec0]'
              : 'bg-gradient-to-r from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#9c7b1a] hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/25 text-[#1a2332]'
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[#2d3748] border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </div>
            ) : (
              '🚀 DAFTAR SEKARANG'
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg backdrop-blur-sm ${message.includes('berhasil')
            ? 'bg-green-900/50 border border-green-400/50 text-green-300'
            : 'bg-red-900/50 border border-red-400/50 text-red-300'
            }`}>
            {message}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-[#2d3748]/50 text-center">
          <p className="text-sm text-[#a0aec0] mb-3">
            📞 Butuh bantuan? Hubungi:
          </p>
          <div className="space-y-2">
            <a
              href="https://wa.me/+6285189970998"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#f5f7fa] hover:text-[#d4af37] transition-colors duration-300 block"
            >
              📱 085189970998 (Michael Sean - TI)
            </a>
            <a
              href="https://wa.me/+6285624055869"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#f5f7fa] hover:text-[#d4af37] transition-colors duration-300 block"
            >
              📱 085624055869 (Novi - TI)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}