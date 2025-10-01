'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [activeTournaments, setActiveTournaments] = useState([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);

  useEffect(() => {
    // Check if current date is after October 7, 2025
    const currentDate = new Date();
    const closingDate = new Date('2025-10-07T23:59:59');
    setIsRegistrationClosed(currentDate > closingDate);

    // Fetch active tournaments
    fetchActiveTournaments();
  }, []);

  const fetchActiveTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments');
      const data = await response.json();
      if (data.success) {
        setActiveTournaments(data.tournaments);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setIsLoadingTournaments(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5 relative overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.png)',
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332]/80 via-[#2d3748]/70 to-[#1a2332]/80"></div>
      
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

        {/* Main Navigation Section */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {/* View Tournaments Button */}
            <div className="mb-4">
            <Link href="/tournaments">
              <div className="relative bg-gradient-to-r from-[#2d3748] to-[#1a2332] text-[#f5f7fa] p-5 rounded-xl text-center cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#d4af37]/15 border border-[#d4af37]/30 group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl">🏆</span>
                    <span className="font-bold text-lg">VIEW ACTIVE TOURNAMENTS</span>
                  </div>
                  {!isLoadingTournaments && (
                    <div className="text-sm opacity-90">
                      {activeTournaments.length > 0 
                        ? `${activeTournaments.length} tournament${activeTournaments.length > 1 ? 's' : ''} ongoing`
                        : 'No active tournaments yet'
                      }
                    </div>
                  )}
                  {isLoadingTournaments && (
                    <div className="text-sm opacity-90">Loading tournaments...</div>
                  )}
                </div>
              </div>
            </Link>
</div>
            {/* Register Button */}
            {isRegistrationClosed ? (
              <div className="relative bg-gradient-to-r from-[#2d3748] to-[#1a2332] text-[#f5f7fa] p-5 rounded-xl text-center overflow-hidden border border-[#2d3748]/50 opacity-75">
                <div className="relative z-10">
                  <div className="font-bold text-lg mb-1">❌ PENDAFTARAN DITUTUP</div>
                  <div className="text-sm opacity-90">Registrasi berakhir 7 Oktober 2025</div>
                </div>
              </div>
            ) : (
              <Link href="/register">
                <div className="relative bg-gradient-to-r from-[#d4af37] via-[#b8941f] to-[#9c7b1a] text-[#1a2332] p-5 rounded-xl text-center overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#d4af37]/25 border border-[#d4af37]/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative z-10">
                    <div className="font-bold text-lg mb-1">📝 DAFTAR SEKARANG</div>
                    <div className="text-sm opacity-90">Registrasi ditutup 7 Oktober 2025</div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Tournament Info Preview */}
          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#2d3748]/70 to-[#1a2332]/50 rounded-lg border border-[#d4af37]/30 backdrop-blur-sm">
              <div className="text-lg mt-0.5">📅</div>
              <div>
                <div className="text-xs font-semibold text-[#d4af37] uppercase tracking-wide mb-1">Tanggal & Waktu</div>
                <div className="text-sm text-[#f5f7fa] leading-relaxed">13 - 18 Oktober 2025<br />18.00 - 20.00 WIB</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#2d3748]/70 to-[#1a2332]/50 rounded-lg border border-[#d4af37]/30 backdrop-blur-sm">
              <div className="text-lg mt-0.5">📍</div>
              <div>
                <div className="text-xs font-semibold text-[#d4af37] uppercase tracking-wide mb-1">Lokasi</div>
                <div className="text-sm text-[#f5f7fa] leading-relaxed">
                  Greenlight Cafe & Billiard<br />Jl. Purnawarman No.3, Bandung
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center pt-6 border-t border-[#2d3748]/50 mt-6">
            <div className="text-xs text-[#d4af37] mb-2 uppercase tracking-wide">Informasi & Pendaftaran:</div>
            <div className="space-y-1">
              <a
                href="https://wa.me/+6285189970998"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#f5f7fa] text-sm hover:text-[#d4af37] transition-colors duration-300 block"
              >
                📱 085189970998 (Michael Sean - TI)
              </a>
              <a
                href="https://wa.me/+6285624055869"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#f5f7fa] text-sm hover:text-[#d4af37] transition-colors duration-300 block"
              >
                📱 085624055869 (Novi - TI)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}