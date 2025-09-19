'use client';

import Link from 'next/link';

const tournaments = [
	{
		name: 'TI BILLIARD CUP',
		year: '2025',
		description: 'Solidaritas antar bidang, sistem grup, hadiah menarik!',
		icon: '🎱',
		href: '/billiard',
		date: '13 - 18 Oktober 2025',
		location: 'Greenlight Cafe & Billiard',
		bg: 'from-[#2d3748] to-[#1a2332]',
		accent: 'border-[#d4af37]/40',
	},
	// Tambahkan turnamen lain di sini jika ada
];

export default function Home() {
	return (
		<div className="min-h-screen flex justify-center items-center p-5 relative overflow-hidden">
			{/* Background Image & Overlay */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{ backgroundImage: 'url(/bg.png)' }}
			></div>
			<div className="absolute inset-0 bg-gradient-to-br from-[#1a2332]/80 via-[#2d3748]/70 to-[#1a2332]/80"></div>
			{/* Spotlight Effects */}
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
			<div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl"></div>

			{/* Tournament Selection */}
			<div className="w-full max-w-md md:max-w-2xl mx-auto bg-gradient-to-b from-[#2d3748] to-[#1a2332] rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden border border-[#d4af37]/30 relative z-10 p-8">
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] via-[#b8941f] to-[#9c7b1a] rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-[0_8px_25px_rgba(212,175,55,0.4)] border-2 border-[#d4af37]/30">
						🏆
					</div>
					<h1 className="text-3xl font-bold text-[#f5f7fa] mb-2">
						Pilih Turnamen
					</h1>
					<p className="text-[#d4af37] font-semibold">
						Silakan pilih turnamen yang ingin diikuti
					</p>
				</div>
				<div className="grid gap-6">
					{tournaments.map((t, idx) => (
						<div
							key={idx}
							className={`bg-gradient-to-b ${t.bg} rounded-xl border ${t.accent} p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg`}
						>
							<div className="flex-shrink-0 text-5xl mb-2 md:mb-0">
								{t.icon}
							</div>
							<div className="flex-1">
								<div className="font-bold text-xl text-[#d4af37] mb-1">
									{t.name}
								</div>
								<div className="text-sm text-[#f5f7fa] mb-2">
									{t.description}
								</div>
								<div className="text-xs text-[#d4af37] mb-1">
									Tahun: {t.year}
								</div>
								<div className="text-xs text-[#f5f7fa] mb-1">
									Tanggal: {t.date}
								</div>
								<div className="text-xs text-[#f5f7fa] mb-1">
									Lokasi: {t.location}
								</div>
							</div>
							<Link
								href={t.href}
								className="mt-4 md:mt-0"
							>
								<div className="bg-gradient-to-r from-[#d4af37] via-[#b8941f] to-[#9c7b1a] text-[#1a2332] px-5 py-2 rounded-lg font-bold shadow hover:scale-105 transition-all border border-[#d4af37]/50 cursor-pointer">
									Pilih Turnamen
								</div>
							</Link>
						</div>
					))}
				</div>
				{/* ...existing code for contact/info if needed... */}
			</div>
		</div>
	);
}
