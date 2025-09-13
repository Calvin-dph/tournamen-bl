import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex justify-center items-center p-5">
      {/* Original Poster Design */}
      <div className="w-full max-w-[420px] mx-auto bg-gradient-to-b from-white to-[#f8f9fa] rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#2c3e50] via-[#34495e] to-[#2c3e50] text-white p-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 animate-pulse">
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-15 h-15 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-[0_5px_15px_rgba(231,76,60,0.3)]">
              🎱
            </div>
            <h1 className="text-2xl font-bold mb-2 tracking-wide text-shadow">TI BILLIARD CUP</h1>
            <p className="text-sm opacity-90 tracking-wider">2025 • BOLA 8</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="space-y-4 mb-5">
            <div className="flex items-start gap-3 p-3 bg-[rgba(52,73,94,0.05)] rounded-lg border-l-4 border-[#e74c3c]">
              <div className="text-lg mt-0.5">📅</div>
              <div>
                <div className="text-xs font-semibold text-[#2c3e50] uppercase tracking-wide mb-1">Tanggal</div>
                <div className="text-sm text-[#34495e] leading-relaxed">13 - 18 Oktober 2025<br/>17.15 - 20.00 WIB</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[rgba(52,73,94,0.05)] rounded-lg border-l-4 border-[#e74c3c]">
              <div className="text-lg mt-0.5">📍</div>
              <div>
                <div className="text-xs font-semibold text-[#2c3e50] uppercase tracking-wide mb-1">Lokasi</div>
                <div className="text-sm text-[#34495e] leading-relaxed">Greenlight Cafe & Billiard<br/>Jl. Purnawarman No.3, Bandung</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[rgba(52,73,94,0.05)] rounded-lg border-l-4 border-[#e74c3c]">
              <div className="text-lg mt-0.5">⚡</div>
              <div>
                <div className="text-xs font-semibold text-[#2c3e50] uppercase tracking-wide mb-1">Format</div>
                <div className="text-sm text-[#34495e] leading-relaxed">Sistem Grup • Setengah Kompetisi<br/>Max 2 tim per bidang (4 karyawan)</div>
              </div>
            </div>
          </div>

          {/* Prizes */}
          <div className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] rounded-2xl p-5 border-2 border-[rgba(231,76,60,0.1)]">
            <h3 className="text-center font-bold text-[#2c3e50] mb-4 flex items-center justify-center gap-2">
              🏆 HADIAH PEMENANG
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-[rgba(44,62,80,0.1)]">
                <span className="font-semibold text-[#2c3e50] text-sm">🥇 Juara 1</span>
                <span className="font-medium text-[#e74c3c] text-xs text-right">Rp 500.000 + Piala + Plakat</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(44,62,80,0.1)]">
                <span className="font-semibold text-[#2c3e50] text-sm">🥈 Juara 2</span>
                <span className="font-medium text-[#e74c3c] text-xs text-right">Rp 300.000 + Plakat</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(44,62,80,0.1)]">
                <span className="font-semibold text-[#2c3e50] text-sm">🥉 Juara 3</span>
                <span className="font-medium text-[#e74c3c] text-xs text-right">Rp 200.000 + Plakat</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-[#2c3e50] text-sm">🏅 Juara 4 & 5</span>
                <span className="font-medium text-[#e74c3c] text-xs text-right">Plakat + Sertifikat</span>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          <Link href="/register">
            <div className="relative bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white p-4 rounded-xl text-center mt-5 overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="font-bold text-sm mb-2">PENDAFTARAN GRATIS!</div>
                <div className="text-xs opacity-95 mb-2">Tutup: 7 Oktober 2025</div>
                <div className="text-xs bg-white/20 rounded-full py-1 px-3 inline-block">
                  👆 Klik untuk Daftar
                </div>
              </div>
            </div>
          </Link>

          {/* Decorative Line */}
          <div className="w-15 h-1 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] mx-auto my-4 rounded"></div>

          {/* Contact */}
          <div className="text-center pt-4 border-t border-[#ecf0f1]">
            <div className="text-xs text-[#7f8c8d] mb-1">Informasi & Pendaftaran:</div>
            <a 
              href="https://wa.me/085624055869"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#2c3e50] text-sm hover:text-[#e74c3c] transition-colors duration-300 inline-block"
            >
              📱 085624055869 (Novi - TI)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
