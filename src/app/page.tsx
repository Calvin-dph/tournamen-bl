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
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332] flex justify-center items-center p-5 relative overflow-hidden">
      {/* Spotlight Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl"></div>

      {/* Original Poster Design */}
      <div className="w-full max-w-md md:max-w-2xl mx-auto bg-gradient-to-b from-[#2d3748] to-[#1a2332] rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden border border-[#d4af37]/30 relative z-10">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332] text-white p-6 text-center overflow-hidden">
          {/* Spotlight effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/20 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-[#d4af37] rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] via-[#b8941f] to-[#9c7b1a] rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-[0_8px_25px_rgba(212,175,55,0.4)] border-2 border-[#d4af37]/30">
              🎱
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-wide text-shadow-lg text-[#f5f7fa]">TI BILLIARD CUP</h1>
            <p className="text-lg opacity-90 tracking-wider font-semibold text-[#d4af37]">2025</p>
            <p className="text-sm opacity-80 tracking-wide mt-1 text-[#f5f7fa]">SOLIDARITAS ANTAR BIDANG</p>
          </div>
        </div>


        {/* Content */}
        <div className="p-5 bg-gradient-to-b from-[#2d3748] to-[#1a2332]">
          <div className="space-y-4 mb-5">

          {/* Tournament Format - Fourth priority */}
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#2d3748]/70 to-[#1a2332]/50 rounded-lg border border-[#d4af37]/30 backdrop-blur-sm mb-5">
            <div className="text-lg mt-0.5">⚡</div>
            <div>
              <div className="text-xs font-semibold text-[#d4af37] uppercase tracking-wide mb-1">Format Turnamen</div>
              <div className="text-sm text-[#f5f7fa] leading-relaxed">Sistem Grup • Setengah Kompetisi<br />Max 2 team (4 Karyawan) per bidang</div>
            </div>
          </div>

          {/* Prizes - Redesigned with card-based layout */}
          <div className="bg-gradient-to-br from-[#2d3748]/80 to-[#1a2332]/60 rounded-2xl p-6 border border-[#d4af37]/40 backdrop-blur-sm mb-5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d4af37]/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#d4af37]/5 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-center font-bold text-[#d4af37] mb-6 flex items-center justify-center gap-2 text-xl">
                🏆 HADIAH PEMENANG
              </h3>
              
              {/* Top 3 prizes - Mobile optimized layout */}
              <div className="mb-6">
                {/* Mobile: Featured 1st place */}
                <div className="md:hidden mb-4">
                  <div className="bg-gradient-to-br from-[#d4af37]/20 via-[#d4af37]/10 to-transparent p-6 rounded-xl border border-[#d4af37]/50 text-center relative group shadow-lg shadow-[#d4af37]/25">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-4xl mb-3">🥇</div>
                      <div className="font-bold text-[#d4af37] text-xl mb-2">JUARA 1</div>
                      <div className="font-bold text-[#f5f7fa] text-2xl mb-2">Rp 500.000</div>
                      <div className="text-[#d4af37] text-base font-semibold">+ Piala Bergilir</div>
                    </div>
                  </div>
                </div>

                {/* Mobile: 2nd and 3rd place side by side */}
                <div className="md:hidden grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-[#c0c0c0]/15 via-[#a8a8a8]/10 to-transparent p-4 rounded-xl border border-[#c0c0c0]/40 text-center group shadow-lg shadow-[#c0c0c0]/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c0c0c0]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-2xl mb-2">🥈</div>
                      <div className="font-bold text-[#c0c0c0] text-sm mb-1">JUARA 2</div>
                      <div className="font-bold text-[#f5f7fa] text-lg">Rp 300.000</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#cd7f32]/15 via-[#b8741f]/10 to-transparent p-4 rounded-xl border border-[#cd7f32]/40 text-center group shadow-lg shadow-[#cd7f32]/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-2xl mb-2">🥉</div>
                      <div className="font-bold text-[#cd7f32] text-sm mb-1">JUARA 3</div>
                      <div className="font-bold text-[#f5f7fa] text-lg">Rp 200.000</div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Original 3-column grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-4">
                  {/* 1st Place - Gold themed with shadow */}
                  <div className="bg-gradient-to-br from-[#d4af37]/20 via-[#d4af37]/10 to-transparent p-4 rounded-xl border border-[#d4af37]/50 text-center relative group hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#d4af37]/25">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-3xl mb-2">🥇</div>
                      <div className="font-bold text-[#d4af37] text-lg mb-1">JUARA 1</div>
                      <div className="font-bold text-[#f5f7fa] text-xl mb-1">Rp 500.000</div>
                      <div className="text-[#d4af37] text-sm">+ Piala Bergilir</div>
                    </div>
                  </div>

                  {/* 2nd Place - Silver themed */}
                  <div className="bg-gradient-to-br from-[#c0c0c0]/15 via-[#a8a8a8]/10 to-transparent p-4 rounded-xl border border-[#c0c0c0]/40 text-center group hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#c0c0c0]/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c0c0c0]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-3xl mb-2">🥈</div>
                      <div className="font-bold text-[#c0c0c0] text-lg mb-1">JUARA 2</div>
                      <div className="font-bold text-[#f5f7fa] text-xl">Rp 300.000</div>
                    </div>
                  </div>

                  {/* 3rd Place - Bronze themed */}
                  <div className="bg-gradient-to-br from-[#cd7f32]/15 via-[#b8741f]/10 to-transparent p-4 rounded-xl border border-[#cd7f32]/40 text-center group hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#cd7f32]/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-3xl mb-2">🥉</div>
                      <div className="font-bold text-[#cd7f32] text-lg mb-1">JUARA 3</div>
                      <div className="font-bold text-[#f5f7fa] text-xl">Rp 200.000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4th & 5th Place in a single row */}
              <div className="bg-gradient-to-r from-[#2d3748]/40 to-[#1a2332]/30 p-4 rounded-xl border border-[#d4af37]/25 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏅</div>
                    <div>
                      <div className="font-bold text-[#d4af37] text-base">JUARA 4 & 5</div>
                      <div className="text-[#f5f7fa] text-sm opacity-90">Apresiasi Peserta</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional benefits */}
              <div className="text-center p-4 bg-gradient-to-r from-[#d4af37]/10 via-[#d4af37]/5 to-[#d4af37]/10 rounded-lg border border-[#d4af37]/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-lg">🎖️</span>
                  <span className="font-bold text-[#d4af37] text-base">BONUS UNTUK SEMUA PEMENANG</span>
                </div>
                <div className="text-[#f5f7fa] text-sm">
                  <span className="font-semibold">Sertifikat Partisipasi</span> • <span className="font-semibold">Plakat Kenang-kenangan</span>
                </div>
              </div>
            </div>
          </div>
            
            {/* Date & Time - First priority info */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#2d3748]/70 to-[#1a2332]/50 rounded-lg border border-[#d4af37]/30 backdrop-blur-sm">
              <div className="text-lg mt-0.5">📅</div>
              <div>
                <div className="text-xs font-semibold text-[#d4af37] uppercase tracking-wide mb-1">Tanggal & Waktu</div>
                <div className="text-sm text-[#f5f7fa] leading-relaxed">13 - 18 Oktober 2025<br />18.00 - 20.00 WIB</div>
              </div>
            </div>

            {/* Location with Map - Second priority */}
            <div className="items-start gap-3 p-4 bg-gradient-to-r from-[#2d3748]/70 to-[#1a2332]/50 rounded-lg border border-[#d4af37]/30 backdrop-blur-sm">
              <div className="flex gap-3">

              <div className="text-lg mt-0.5">📍</div>
              <div className="w-full">
                <div className="text-xs font-semibold text-[#d4af37] uppercase tracking-wide mb-2">Lokasi</div>
                <div className="text-sm text-[#f5f7fa] leading-relaxed mb-3">
                  Greenlight Cafe & Billiard<br />Jl. Purnawarman No.3, Bandung
                </div>
              </div>
              </div>
              
                {/* Google Maps Embed */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#d4af37]/50">
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


          {/* Registration Button */}
          {isRegistrationClosed ? (
            <div className="relative bg-gradient-to-r from-[#2d3748] to-[#1a2332] text-[#f5f7fa] p-5 rounded-xl text-center mt-6 overflow-hidden border border-[#2d3748]/50 opacity-75">
              <div className="relative z-10">
                <div className="font-bold text-lg mb-1">❌ PENDAFTARAN DITUTUP</div>
                <div className="text-sm opacity-90">Registrasi berakhir 7 Oktober 2025</div>
              </div>
            </div>
          ) : (
            <Link href="/register">
              <div className="relative bg-gradient-to-r from-[#d4af37] via-[#b8941f] to-[#9c7b1a] text-[#1a2332] p-5 rounded-xl text-center mt-6 overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#d4af37]/25 border border-[#d4af37]/50">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <div className="font-bold text-lg mb-1">📝 DAFTAR SEKARANG</div>
                  <div className="text-sm opacity-90">Registrasi ditutup 7 Oktober 2025</div>
                </div>
              </div>
            </Link>
          )}

          {/* Decorative Line */}
          <div className="w-16 h-1 bg-gradient-to-r from-[#d4af37] to-[#b8941f] mx-auto my-4 rounded"></div>

          {/* Contact */}
          <div className="text-center pt-4 border-t border-[#2d3748]/50">
            <div className="text-xs text-[#d4af37] mb-2 uppercase tracking-wide">Informasi & Pendaftaran:</div>
            <div className="space-y-1">
              <a
                href="https://wa.me/+6285624055869"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#f5f7fa] text-sm hover:text-[#d4af37] transition-colors duration-300 block"
              >
                📱 085624055869 (Novi - TI)
              </a>
              <a
                href="https://wa.me/+6285189970998"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#f5f7fa] text-sm hover:text-[#d4af37] transition-colors duration-300 block"
              >
                📱 085189970998 ( Sean - TI )
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
