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
        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push('/success');
        }, 1500);
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
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-[#2c3e50] via-[#34495e] to-[#2c3e50] text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">📝 FORM PENDAFTARAN</h2>
        <p className="text-sm opacity-90">TI Billiard Cup 2025</p>
      </div>

      {/* Form Content */}
      <div className="p-8">
        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">📋 Petunjuk Pendaftaran:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Maksimal setiap bidang mendaftarkan 2 Team (4 Karyawan)</li>
            <li>• Di setiap Kolom Team, tuliskan 2 Nama (contoh: Michael Sean & Yoga)</li>
            <li>• Di kolom Nomor Handphone cantumkan semua nomor peserta (WA)</li>
            <li>• Contoh: 083822743692 & 083822743693 & 083822743694 & 083822743692</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bidang Selection */}
          <div>
            <label htmlFor="bidang" className="block text-sm font-semibold text-gray-700 mb-2">
              Bidang <span className="text-red-500">*</span>
            </label>
            <select
              id="bidang"
              name="bidang"
              value={formData.bidang}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent transition-all text-gray-900 bg-white ${
                errors.bidang ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Bidang</option>
              {bidangOptions.map((bidang) => (
                <option key={bidang} value={bidang}>
                  {bidang}
                </option>
              ))}
            </select>
            {errors.bidang && (
              <p className="mt-1 text-sm text-red-500">{errors.bidang}</p>
            )}
          </div>

          {/* Team 1 */}
          <div>
            <label htmlFor="team1" className="block text-sm font-semibold text-gray-700 mb-2">
              Team 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="team1"
              name="team1"
              value={formData.team1}
              onChange={handleInputChange}
              placeholder="Contoh: Michael Sean & Yoga"
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent transition-all text-gray-900 bg-white placeholder-gray-500 ${
                errors.team1 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.team1 && (
              <p className="mt-1 text-sm text-red-500">{errors.team1}</p>
            )}
          </div>

          {/* Team 2 */}
          <div>
            <label htmlFor="team2" className="block text-sm font-semibold text-gray-700 mb-2">
              Team 2
            </label>
            <input
              type="text"
              id="team2"
              name="team2"
              value={formData.team2}
              onChange={handleInputChange}
              placeholder="Contoh: Andi Pratama & Sari Dewi (Opsional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent transition-all text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          {/* Phone Numbers */}
          <div>
            <label htmlFor="phoneNumbers" className="block text-sm font-semibold text-gray-700 mb-2">
              Nomor Handphone (WA) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="phoneNumbers"
              name="phoneNumbers"
              value={formData.phoneNumbers}
              onChange={handleInputChange}
              placeholder="Contoh: 083822743692 & 083822743693 & 083822743694 & 083822743692"
              required
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent transition-all resize-none text-gray-900 bg-white placeholder-gray-500 ${
                errors.phoneNumbers ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phoneNumbers && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumbers}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-all transform ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#e74c3c] to-[#c0392b] hover:from-[#c0392b] hover:to-[#a93226] hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </div>
            ) : (
              '🚀 DAFTAR SEKARANG'
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg ${
            message.includes('berhasil') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            📞 Butuh bantuan? Hubungi:
          </p>
          <a 
            href="https://wa.me/+6285624055869"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#2c3e50] hover:text-[#e74c3c] transition-colors duration-300 inline-block"
          >
            📱 085624055869 (Novi - TI)
          </a>
        </div>
      </div>
    </div>
  );
}