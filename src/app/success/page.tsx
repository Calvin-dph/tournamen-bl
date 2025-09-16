import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332] flex justify-center items-center p-5 relative overflow-hidden">
      {/* Spotlight Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md md:max-w-2xl mx-auto bg-gradient-to-b from-[#2d3748] to-[#1a2332] rounded-2xl shadow-2xl overflow-hidden border border-[#d4af37]/50 relative z-10">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/20 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-green-100">Terima kasih telah mendaftar TI Billiard Cup 2025</p>
          </div>
        </div>

        {/* Success Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#f5f7fa] mb-4">🎱 Selamat!</h2>
            <p className="text-[#f5f7fa] mb-4">
              Tim Anda telah berhasil terdaftar untuk turnamen TI BILLIARD CUP 2025.
            </p>
            <div className="bg-gradient-to-r from-[#1a2332]/50 to-[#2d3748]/50 border-l-4 border-[#d4af37] p-4 mb-6 text-left backdrop-blur-sm">
              <h3 className="font-semibold text-[#d4af37] mb-2">📋 Langkah Selanjutnya:</h3>
              <ul className="text-sm text-[#f5f7fa] space-y-1">
                <li>• Tim panitia akan menghubungi Anda melalui WhatsApp</li>
                <li>• Pastikan nomor yang didaftarkan aktif</li>
                <li>• Tunggu informasi lebih lanjut mengenai jadwal dan teknis turnamen</li>
                <li>• Persiapkan diri untuk kompetisi yang seru!</li>
              </ul>
            </div>
          </div>

          {/* Tournament Reminder */}
          <div className="bg-gradient-to-r from-[#2d3748]/50 to-[#1a2332]/30 rounded-xl p-6 mb-6 border border-[#d4af37]/30 backdrop-blur-sm">
            <h3 className="font-bold text-[#d4af37] mb-3">📅 Reminder Tournament</h3>
            <div className="text-sm text-[#f5f7fa] space-y-3">
              <p><strong>Tanggal:</strong> 13 - 18 Oktober 2025</p>
              <p><strong>Waktu:</strong> 18.00 - 20.00 WIB</p>
              <p><strong>Lokasi:</strong> Greenlight Cafe & Billiard</p>
              <p><strong>Alamat:</strong> Jl. Purnawarman No.3, Bandung</p>
              
              {/* Google Maps Embed */}
              <div className="mt-4">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-[#d4af37]/50">
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
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <p className="text-sm text-slate-400 mb-3">
              📞 Butuh bantuan? Hubungi:
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/+6285624055869"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#f5f7fa] hover:text-[#d4af37] transition-colors duration-300 block"
              >
                📱 085624055869 (Novi - TI)
              </a>
              <a
                href="https://wa.me/+6285189970998"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#f5f7fa] hover:text-[#d4af37] transition-colors duration-300 block"
              >
                📱 085189970998 ( Sean - TI )
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="mb-2">
              <Link href="/">
                <button className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-[#1a2332] py-3 px-6 rounded-lg font-bold hover:from-[#b8941f] hover:to-[#9c7b1a] transition-all border border-[#d4af37]/50">
                  🏠 Kembali ke Halaman Utama
                </button>
              </Link>
            </div>

            <Link href="/register">
              <button className="w-full bg-gradient-to-r from-[#2d3748] to-[#1a2332] text-[#f5f7fa] py-3 px-6 rounded-lg font-bold hover:from-[#1a2332] hover:to-[#2d3748] transition-all border border-[#d4af37]/50">
                ➕ Daftar Tim Lain
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}