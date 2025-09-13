'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  bidang: string;
  team1: string;
  team2: string;
  phoneNumbers: string;
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
    team1: '',
    team2: '',
    phoneNumbers: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.bidang.trim()) {
      newErrors.bidang = 'Bidang harus dipilih';
    }

    if (!formData.team1.trim()) {
      newErrors.team1 = 'Team 1 harus diisi';
    } else if (formData.team1.trim().length < 3) {
      newErrors.team1 = 'Nama team harus minimal 3 karakter';
    }

    if (!formData.phoneNumbers.trim()) {
      newErrors.phoneNumbers = 'Nomor handphone harus diisi';
    } else {
      // Validate phone number format
      const phonePattern = /^[\d\s&+()-]+$/;
      if (!phonePattern.test(formData.phoneNumbers)) {
        newErrors.phoneNumbers = 'Format nomor handphone tidak valid (hanya angka, spasi, &, +, -, ())';
      }
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
          team1: '',
          team2: '',
          phoneNumbers: '',
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
    <div className="w-full max-w-[420px] mx-auto bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
      {/* Form Header */}
      <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8] text-white p-6 text-center relative overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] via-[#d97706] to-[#b45309] rounded-full mx-auto mb-3 flex items-center justify-center text-2xl shadow-[0_8px_25px_rgba(245,158,11,0.4)] border-2 border-amber-400/30">
            📝
          </div>
          <h2 className="text-2xl font-bold mb-2">FORM PENDAFTARAN</h2>
          <p className="text-sm opacity-90 text-amber-300">TI Billiard Cup 2025</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-900/50 to-slate-800/50 border-l-4 border-cyan-400 p-4 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-cyan-300 mb-2">📋 Petunjuk Pendaftaran:</h3>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Maksimal setiap bidang mendaftarkan 4 Team (8 Karyawan)</li>
            <li>• Di setiap Kolom Team, tuliskan 2 Nama (contoh: Michael Sean & Yoga)</li>
            <li>• Di kolom Nomor Handphone cantumkan semua nomor peserta (WA)</li>
            <li>• Contoh: 083822743692 & 083822743693 & 083822743694 & 083822743692</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bidang Selection */}
          <div>
            <label htmlFor="bidang" className="block text-sm font-semibold text-cyan-300 mb-2">
              Bidang <span className="text-amber-400">*</span>
            </label>
            <select
              id="bidang"
              name="bidang"
              value={formData.bidang}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-slate-200 bg-slate-700/50 backdrop-blur-sm placeholder-slate-400 ${
                errors.bidang ? 'border-red-400' : 'border-slate-600'
              }`}
            >
              <option value="" className="bg-slate-800 text-slate-300">Pilih Bidang</option>
              {bidangOptions.map((bidang) => (
                <option key={bidang} value={bidang} className="bg-slate-800 text-slate-300">
                  {bidang}
                </option>
              ))}
            </select>
            {errors.bidang && (
              <p className="mt-1 text-sm text-red-400">{errors.bidang}</p>
            )}
          </div>

          {/* Team 1 */}
          <div>
            <label htmlFor="team1" className="block text-sm font-semibold text-cyan-300 mb-2">
              Team 1 <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              id="team1"
              name="team1"
              value={formData.team1}
              onChange={handleInputChange}
              placeholder="Contoh: Michael Sean & Yoga"
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-slate-200 bg-slate-700/50 backdrop-blur-sm placeholder-slate-400 ${
                errors.team1 ? 'border-red-400' : 'border-slate-600'
              }`}
            />
            {errors.team1 && (
              <p className="mt-1 text-sm text-red-400">{errors.team1}</p>
            )}
          </div>

          {/* Team 2 */}
          <div>
            <label htmlFor="team2" className="block text-sm font-semibold text-cyan-300 mb-2">
              Team 2 <span className="text-slate-400">(Opsional)</span>
            </label>
            <input
              type="text"
              id="team2"
              name="team2"
              value={formData.team2}
              onChange={handleInputChange}
              placeholder="Contoh: Andi Pratama & Sari Dewi (Opsional)"
              className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-slate-200 bg-slate-700/50 backdrop-blur-sm placeholder-slate-400"
            />
          </div>

          {/* Phone Numbers */}
          <div>
            <label htmlFor="phoneNumbers" className="block text-sm font-semibold text-cyan-300 mb-2">
              Nomor Handphone (WA) <span className="text-amber-400">*</span>
            </label>
            <textarea
              id="phoneNumbers"
              name="phoneNumbers"
              value={formData.phoneNumbers}
              onChange={handleInputChange}
              placeholder="Contoh: 083822743692 & 083822743693 & 083822743694 & 083822743692"
              required
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none text-slate-200 bg-slate-700/50 backdrop-blur-sm placeholder-slate-400 ${
                errors.phoneNumbers ? 'border-red-400' : 'border-slate-600'
              }`}
            />
            {errors.phoneNumbers && (
              <p className="mt-1 text-sm text-red-400">{errors.phoneNumbers}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-bold text-slate-900 text-lg transition-all transform border border-amber-400/50 ${
              isSubmitting
                ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl hover:shadow-amber-500/25'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </div>
            ) : (
              '🚀 DAFTAR SEKARANG'
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg backdrop-blur-sm ${
            message.includes('berhasil') 
              ? 'bg-green-900/50 border border-green-400/50 text-green-300'
              : 'bg-red-900/50 border border-red-400/50 text-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-slate-600/50 text-center">
          <p className="text-sm text-slate-400 mb-2">
            📞 Butuh bantuan? Hubungi:
          </p>
          <a 
            href="https://wa.me/085624055869"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-200 hover:text-amber-400 transition-colors duration-300 inline-block"
          >
            📱 085624055869 (Novi - TI)
          </a>
        </div>
      </div>
    </div>
  );
}