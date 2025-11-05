import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex justify-center items-center p-5 relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-secondary to-card"></div>
      
      {/* Spotlight Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md md:max-w-2xl mx-auto bg-card rounded-2xl shadow-2xl overflow-hidden border border-border relative z-10">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-500 via-green-500 to-green-500 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-green-100">Terima kasih telah mendaftar TI Billiard Cup 2025</p>
          </div>
        </div>

        {/* Success Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">🎱 Selamat!</h2>
            <p className="text-foreground mb-4">
              Tim Anda telah berhasil terdaftar untuk turnamen TI BILLIARD CUP 2025.
            </p>
            <div className="bg-secondary border-l-4 border-accent p-4 mb-6 text-left backdrop-blur-sm">
              <h3 className="font-semibold text-accent mb-2">📋 Langkah Selanjutnya:</h3>
              <ul className="text-sm text-foreground space-y-1">
                <li>• Tim panitia akan menghubungi Anda melalui WhatsApp</li>
                <li>• Pastikan nomor yang didaftarkan aktif</li>
                <li>• Tunggu informasi lebih lanjut mengenai jadwal dan teknis turnamen</li>
                <li>• Persiapkan diri untuk kompetisi yang seru!</li>
              </ul>
            </div>
          </div>

          {/* Tournament Reminder */}
          <div className="bg-secondary rounded-xl p-6 mb-6 border border-border backdrop-blur-sm">
            <h3 className="font-bold text-accent mb-3">📅 Reminder Tournament</h3>
            <div className="text-sm text-foreground space-y-3">
              <p><strong>Tanggal:</strong> 22 November 2025 - Selesai</p>
              <p><strong>Waktu:</strong> 18.00 - 20.00 WIB</p>
              <p><strong>Lokasi:</strong> Greenlight Cafe & Billiard</p>
              <p><strong>Alamat:</strong> Jl. Purnawarman No.3, Bandung</p>
              
              {/* Google Maps Embed */}
              <div className="mt-4">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
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
            <p className="text-sm text-muted-foreground mb-3">
              📞 Butuh bantuan? Hubungi:
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/+6285189970998"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-accent transition-colors duration-300 block"
              >
                📱 085189970998 (Michael Sean - TI)
              </a>
              <a
                href="https://wa.me/+6285624055869"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-accent transition-colors duration-300 block"
              >
                📱 085624055869 (Novi - TI)
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="mb-2">
              <Link href="/">
                <button className="w-full bg-gradient-to-r from-accent to-accent text-primary py-3 px-6 rounded-lg font-bold hover:from-accent hover:to-accent transition-all border border-accent/50">
                  🏠 Kembali ke Halaman Utama
                </button>
              </Link>
            </div>

            <Link href="/register">
              <button className="w-full bg-gradient-to-r from-foreground to-primary text-secondary-foreground py-3 px-6 rounded-lg font-bold hover:from-primary hover:to-foreground transition-all border border-accent/50">
                ➕ Daftar Tim Lain
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}