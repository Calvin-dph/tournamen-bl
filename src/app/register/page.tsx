import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-5">
      {/* Header with Back Button */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-blue-200 transition-colors mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Halaman Utama
        </Link>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📝 FORM PENDAFTARAN
          </h1>
          <p className="text-xl text-blue-200 mb-2">
            TI Billiard Cup 2025
          </p>
          <p className="text-sm text-blue-300">
            Silakan isi form di bawah untuk mendaftar turnamen
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-4xl mx-auto">
        <RegistrationForm />
      </div>
    </div>
  );
}