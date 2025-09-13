'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  useEffect(() => {
    // Check if current date is after October 7, 2025
    const currentDate = new Date();
    const closingDate = new Date('2025-10-07T23:59:59');
    setIsRegistrationClosed(currentDate > closingDate);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1e3a8a] to-[#0f172a] flex justify-center items-center p-5 relative overflow-hidden">
      {/* Spotlight Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      
      {/* Original Poster Design */}
      <div className="w-full max-w-[420px] mx-auto bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-700/50 relative z-10">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8] text-white p-6 text-center overflow-hidden">
          {/* Spotlight effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-pulse delay-700"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] via-[#d97706] to-[#b45309] rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-[0_8px_25px_rgba(245,158,11,0.4)] border-2 border-amber-400/30">
              🎱
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-wide text-shadow-lg">BILLIARD TI CUP</h1>
            <p className="text-lg opacity-90 tracking-wider font-semibold text-amber-300">2025</p>
            <p className="text-sm opacity-80 tracking-wide mt-1">SOLIDARITAS ANTAR BIDANG</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-gradient-to-b from-slate-800 to-slate-900">
          <div className="space-y-4 mb-5">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-700/50 to-slate-600/30 rounded-lg border border-slate-600/30 backdrop-blur-sm">
              <div className="text-lg mt-0.5">📅</div>
              <div>
                <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wide mb-1">Tanggal</div>
                <div className="text-sm text-slate-200 leading-relaxed">13 - 18 Oktober 2025<br/>18.00 - 20.00 WIB</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-700/50 to-slate-600/30 rounded-lg border border-slate-600/30 backdrop-blur-sm">
              <div className="text-lg mt-0.5">📍</div>
              <div>
                <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wide mb-1">Lokasi</div>
                <div className="text-sm text-slate-200 leading-relaxed">Greenlight Cafe & Billiard<br/>Jl. Purnawarman No.3, Bandung</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-700/50 to-slate-600/30 rounded-lg border border-slate-600/30 backdrop-blur-sm">
              <div className="text-lg mt-0.5">⚡</div>
              <div>
                <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wide mb-1">Format</div>
                <div className="text-sm text-slate-200 leading-relaxed">Sistem Grup • Setengah Kompetisi<br/>Max 4 tim (8 karyawan) per bidang</div>
              </div>
            </div>
          </div>

          {/* Prizes */}
          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/50 rounded-2xl p-5 border border-amber-500/30 backdrop-blur-sm">
            <h3 className="text-center font-bold text-amber-300 mb-4 flex items-center justify-center gap-2 text-lg">
              🏆 HADIAH PEMENANG
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-slate-600/50">
                <span className="font-semibold text-slate-200 text-sm">🥇 JUARA 1</span>
                <span className="font-bold text-amber-400 text-sm text-right">Rp 500.000 + Piala</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-600/50">
                <span className="font-semibold text-slate-200 text-sm">🥈 JUARA 2</span>
                <span className="font-bold text-amber-400 text-sm text-right">Rp 300.000</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-600/50">
                <span className="font-semibold text-slate-200 text-sm">🥉 JUARA 3</span>
                <span className="font-bold text-amber-400 text-sm text-right">Rp 200.000</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-600/50">
                <span className="font-semibold text-slate-200 text-sm">  Juara 4 & 5</span>
                <span className="font-bold text-amber-400 text-sm text-right">Sertifikat</span>
              </div>
              <div className="text-center py-2">
                <span className="font-medium text-cyan-300 text-sm">+ PLAKAT UNTUK SEMUA PEMENANG</span>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          {isRegistrationClosed ? (
            <div className="relative bg-gradient-to-r from-slate-600 to-slate-700 text-slate-400 p-5 rounded-xl text-center mt-6 overflow-hidden border border-slate-600/50 opacity-75">
              <div className="relative z-10">
                <div className="font-bold text-lg mb-1">❌ PENDAFTARAN DITUTUP</div>
                <div className="text-sm opacity-90">Registrasi berakhir 7 Oktober 2025</div>
              </div>
            </div>
          ) : (
            <Link href="/register">
              <div className="relative bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-900 p-5 rounded-xl text-center mt-6 overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 border border-amber-400/50">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <div className="font-bold text-lg mb-1">📝 DAFTAR SEKARANG</div>
                  <div className="text-sm opacity-90">Registrasi ditutup 7 Oktober 2025</div>
                </div>
              </div>
            </Link>
          )}

          {/* Decorative Line */}
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto my-4 rounded"></div>

          {/* Contact */}
          <div className="text-center pt-4 border-t border-slate-600/50">
            <div className="text-xs text-cyan-300 mb-1 uppercase tracking-wide">Informasi & Pendaftaran:</div>
            <a 
              href="https://wa.me/+6285624055869"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-200 text-sm hover:text-amber-400 transition-colors duration-300 inline-block"
            >
              📱 085624055869 (Novi - TI)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
