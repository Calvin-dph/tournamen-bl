'use client';

import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  useEffect(() => {
    // Check if current date is after October 7, 2025
    const currentDate = new Date();
    const closingDate = new Date('2025-10-07T23:59:59');
    setIsRegistrationClosed(currentDate > closingDate);
  }, []);

  return (
    <div className="min-h-screen p-5 relative overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.png)',
          filter: 'blur(8px)',
          transform: 'scale(1.1)', // Slightly scale to avoid blur edge artifacts
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332]/80 via-[#2d3748]/70 to-[#1a2332]/80"></div>
      
      {/* Spotlight Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl"></div>

      {/* Header with Back Button */}
      <div className="w-full max-w-md md:max-w-2xl mx-auto mb-2 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f5f7fa] transition-colors mb-6 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Halaman Utama
        </Link>
      </div>

      {/* Registration Form or Closed Message */}
      <div className="max-w-4xl mx-auto relative z-10">
        {isRegistrationClosed ? (
          <div className="w-full max-w-md md:max-w-2xl mx-auto bg-gradient-to-b from-[#2d3748] to-[#1a2332] rounded-2xl shadow-2xl overflow-hidden border border-[#d4af37]/50">
            {/* Closed Header */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white p-6 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-[0_8px_25px_rgba(239,68,68,0.4)] border-2 border-red-400/30">
                  ❌
                </div>
                <h2 className="text-2xl font-bold mb-2">PENDAFTARAN DITUTUP</h2>
                <p className="text-sm opacity-90 text-red-200">Registrasi berakhir 7 Oktober 2025</p>
              </div>
            </div>

            {/* Closed Content */}
            <div className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-200 mb-4">📅 Maaf, Waktu Pendaftaran Telah Berakhir</h3>
                <p className="text-slate-300 mb-6">
                  Pendaftaran untuk TI Billiard Cup 2025 telah ditutup pada tanggal 7 Oktober 2025.
                </p>

                <div className="bg-gradient-to-r from-blue-900/50 to-slate-800/50 border-l-4 border-cyan-400 p-4 mb-6 backdrop-blur-sm text-left">
                  <h4 className="font-semibold text-cyan-300 mb-2">📋 Informasi Turnamen:</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li>• Tanggal: 13 - 18 Oktober 2025</li>
                    <li>• Waktu: 17.15 - 20.00 WIB</li>
                    <li>• Lokasi: Greenlight Cafe & Billiard</li>
                    <li>• Alamat: Jl. Purnawarman No.3, Bandung</li>
                    <li>• Peserta yang sudah terdaftar akan dihubungi panitia</li>
                  </ul>
                  
                  {/* Google Maps Embed */}
                  <div className="mt-4">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-600/50">
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

                <div className="mb-6">
                  <p className="text-sm text-slate-400 mb-3">📞 Butuh informasi? Hubungi:</p>
                  <div className="space-y-2">
                    <a
                      href="https://wa.me/+6285189970998"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-200 hover:text-amber-400 transition-colors duration-300 block"
                    >
                      📱 085189970998 (Michael Sean - TI)
                    </a>
                    <a
                      href="https://wa.me/+6285624055869"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-200 hover:text-amber-400 transition-colors duration-300 block"
                    >
                      📱 085624055869 (Novi - TI)
                    </a>
                  </div>
                </div>

                <Link href="/">
                  <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 py-3 px-6 rounded-lg font-bold hover:from-amber-600 hover:to-amber-700 transition-all border border-amber-400/50">
                    🏠 Kembali ke Halaman Utama
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <RegistrationForm />
        )}
      </div>
    </div>
  );
}