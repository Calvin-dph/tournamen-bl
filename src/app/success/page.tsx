import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1e3a8a] to-[#0f172a] flex justify-center items-center p-5 relative overflow-hidden">
      {/* Spotlight Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-[420px] mx-auto bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 relative z-10">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-green-100">Terima kasih telah mendaftar TI Billiard Cup 2025</p>
          </div>
        </div>

        {/* Success Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">🎱 Selamat!</h2>
            <p className="text-slate-300 mb-4">
              Tim Anda telah berhasil terdaftar untuk turnamen billiard TI Cup 2025.
            </p>
            <div className="bg-gradient-to-r from-blue-900/50 to-slate-800/50 border-l-4 border-cyan-400 p-4 mb-6 text-left backdrop-blur-sm">
              <h3 className="font-semibold text-cyan-300 mb-2">📋 Langkah Selanjutnya:</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Tim panitia akan menghubungi Anda melalui WhatsApp</li>
                <li>• Pastikan nomor yang didaftarkan aktif</li>
                <li>• Tunggu informasi lebih lanjut mengenai jadwal dan teknis turnamen</li>
                <li>• Persiapkan diri untuk kompetisi yang seru!</li>
              </ul>
            </div>
          </div>

          {/* Tournament Reminder */}
          <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/30 rounded-xl p-6 mb-6 border border-slate-600/30 backdrop-blur-sm">
            <h3 className="font-bold text-amber-300 mb-3">📅 Reminder Turnamen</h3>
            <div className="text-sm text-slate-300 space-y-1">
              <p><strong>Tanggal:</strong> 13 - 18 Oktober 2025</p>
              <p><strong>Waktu:</strong> 18.00 - 20.00 WIB</p>
              <p><strong>Lokasi:</strong> Greenlight Cafe & Billiard</p>
              <p><strong>Alamat:</strong> Jl. Purnawarman No.3, Bandung</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <p className="text-sm text-slate-400 mb-2">
              📞 Butuh bantuan? Hubungi:
            </p>
            <a 
              href="https://wa.me/+6285624055869"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-200 hover:text-amber-400 transition-colors duration-300 inline-block"
            >
              📱 085624055869 (Novi - TI)
            </a>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="mb-2">
              <Link href="/">
              <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 py-3 px-6 rounded-lg font-bold hover:from-amber-600 hover:to-amber-700 transition-all border border-amber-400/50">
                  🏠 Kembali ke Halaman Utama
              </button>
              </Link>
            </div>
            
            <Link href="/register">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/50">
                ➕ Daftar Tim Lain
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}