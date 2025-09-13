import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex justify-center items-center p-5">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-2">Pendaftaran Berhasil!</h1>
          <p className="text-green-100">Terima kasih telah mendaftar TI Billiard Cup 2025</p>
        </div>

        {/* Success Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎱 Selamat!</h2>
            <p className="text-gray-600 mb-4">
              Tim Anda telah berhasil terdaftar untuk turnamen billiard TI Cup 2025.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">📋 Langkah Selanjutnya:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Tim panitia akan menghubungi Anda melalui WhatsApp</li>
                <li>• Pastikan nomor yang didaftarkan aktif</li>
                <li>• Tunggu informasi lebih lanjut mengenai jadwal dan teknis turnamen</li>
                <li>• Persiapkan diri untuk kompetisi yang seru!</li>
              </ul>
            </div>
          </div>

          {/* Tournament Reminder */}
          <div className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#2c3e50] mb-3">📅 Reminder Turnamen</h3>
            <div className="text-sm text-[#34495e] space-y-1">
              <p><strong>Tanggal:</strong> 13 - 18 Oktober 2025</p>
              <p><strong>Waktu:</strong> 17.15 - 20.00 WIB</p>
              <p><strong>Lokasi:</strong> Greenlight Cafe & Billiard</p>
              <p><strong>Alamat:</strong> Jl. Purnawarman No.3, Bandung</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
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

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <button className="w-full bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white py-3 px-6 rounded-lg font-bold hover:from-[#c0392b] hover:to-[#a93226] transition-all">
                🏠 Kembali ke Halaman Utama
              </button>
            </Link>
            
            <Link href="/register">
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all">
                ➕ Daftar Tim Lain
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}