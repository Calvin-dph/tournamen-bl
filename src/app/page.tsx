<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pilih Tournament Anda</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
            opacity: 0;
            transform: translateY(-30px);
            animation: fadeInDown 1s ease-out forwards;
        }

        .header h1 {
            font-size: 3.5rem;
            color: #f5f7fa;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            background: linear-gradient(45deg, #d4af37, #f5f7fa, #d4af37);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 3s ease infinite;
        }

        .header p {
            font-size: 1.2rem;
            color: #f5f7fa;
            max-width: 600px;
            margin: 0 auto;
        }

        .tournaments-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .tournament-card {
            background: rgba(245, 247, 250, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid rgba(212, 175, 55, 0.3);
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateY(50px);
        }

        .tournament-card:before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
            transition: left 0.5s;
        }

        .tournament-card:hover:before {
            left: 100%;
        }

        .tournament-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            border-color: #d4af37;
            background: rgba(212, 175, 55, 0.1);
        }

        .tournament-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            transition: transform 0.3s ease;
        }

        .tournament-card:hover .tournament-icon {
            transform: rotateY(360deg);
        }

        .tournament-card h3 {
            color: #f5f7fa;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .tournament-card p {
            color: #f5f7fa;
            opacity: 0.8;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .join-btn {
            background: linear-gradient(45deg, #d4af37, #e6c85a);
            color: #1a2332;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }

        .join-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
            background: linear-gradient(45deg, #e6c85a, #d4af37);
        }

        /* Warna khusus untuk setiap tournament */
        .billiard { background: linear-gradient(135deg, #1a2332, #2d3748); }
        .badminton { background: linear-gradient(135deg, #d4af37, #e6c85a); }
        .mobile-legend { background: linear-gradient(135deg, #2d3748, #1a2332); }
        .pingpong { background: linear-gradient(135deg, #d4af37, #2d3748); }
        .running { background: linear-gradient(135deg, #1a2332, #d4af37); }

        .selected {
            transform: translateY(-10px) scale(1.05) !important;
            box-shadow: 0 25px 50px rgba(0,0,0,0.4) !important;
            border-color: #d4af37 !important;
            background: rgba(212, 175, 55, 0.2) !important;
        }

        @keyframes fadeInDown {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        @keyframes cardSlideIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .floating-particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            animation: float 6s infinite linear;
        }

        @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }

        @media (max-width: 768px) {
            .header h1 { font-size: 2.5rem; }
            .tournaments-grid { grid-template-columns: 1fr; gap: 1.5rem; }
            .container { padding: 1rem; }
        }
    </style>
</head>
<body>
    <div class="floating-particles" id="particles"></div>
    
    <div class="container">
        <div class="header">
            <h1>🏆 Pilih Tournament Anda</h1>
            <p>Bergabunglah dalam kompetisi seru dan tunjukkan kemampuan terbaik Anda!</p>
        </div>

        <div class="tournaments-grid">
            <div class="tournament-card" data-tournament="billiard">
                <div class="tournament-icon billiard">🎱</div>
                <h3>Billiard Championship</h3>
                <p>Kompetisi billiard untuk semua level. Tunjukkan skill dan strategi terbaik Anda di meja hijau.</p>
                <button class="join-btn" onclick="selectTournament('billiard')">Daftar Sekarang</button>
            </div>

            <div class="tournament-card" data-tournament="badminton">
                <div class="tournament-icon badminton">🏸</div>
                <h3>Badminton Tournament</h3>
                <p>Turnamen bulu tangkis dengan sistem gugur. Siapkan raket dan mental juara Anda!</p>
                <button class="join-btn" onclick="selectTournament('badminton')">Daftar Sekarang</button>
            </div>

            <div class="tournament-card" data-tournament="mobile-legend">
                <div class="tournament-icon mobile-legend">🎮</div>
                <h3>Mobile Legend Cup</h3>
                <p>Kompetisi esports Mobile Legend 5v5. Bentuk tim terbaik dan raih kemenangan!</p>
                <button class="join-btn" onclick="selectTournament('mobile-legend')">Daftar Sekarang</button>
            </div>

            <div class="tournament-card" data-tournament="pingpong">
                <div class="tournament-icon pingpong">🏓</div>
                <h3>Ping Pong Challenge</h3>
                <p>Turnamen tenis meja dengan sistem round robin. Asah refleks dan teknik Anda!</p>
                <button class="join-btn" onclick="selectTournament('pingpong')">Daftar Sekarang</button>
            </div>

            <div class="tournament-card" data-tournament="running">
                <div class="tournament-icon running">🏃‍♂️</div>
                <h3>Running Marathon</h3>
                <p>Kompetisi lari dengan berbagai kategori jarak. Buktikan stamina dan kecepatan Anda!</p>
                <button class="join-btn" onclick="selectTournament('running')">Daftar Sekarang</button>
            </div>
        </div>
    </div>

    <script>
        // Animasi kartu saat load
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.tournament-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = `cardSlideIn 0.6s ease-out forwards`;
                }, index * 100);
            });

            // Buat partikel floating
            createParticles();
        });

        // Fungsi untuk membuat partikel
        function createParticles() {
            const container = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 6) + 's';
                container.appendChild(particle);
            }
        }

        // Fungsi untuk memilih tournament
        function selectTournament(tournament) {
            // Remove previous selection
            document.querySelectorAll('.tournament-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selection to current card
            const selectedCard = document.querySelector(`[data-tournament="${tournament}"]`);
            selectedCard.classList.add('selected');

            // Simulate loading/processing
            const btn = selectedCard.querySelector('.join-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Processing...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = '✅ Terdaftar';
                btn.style.background = 'linear-gradient(45deg, #d4af37, #e6c85a)';
                btn.style.color = '#1a2332';
                
                // Show confirmation
                showConfirmation(tournament);
            }, 2000);
        }

        // Fungsi untuk menampilkan konfirmasi
        function showConfirmation(tournament) {
            const tournamentNames = {
                'billiard': 'Billiard Championship',
                'badminton': 'Badminton Tournament', 
                'mobile-legend': 'Mobile Legend Cup',
                'pingpong': 'Ping Pong Challenge',
                'running': 'Running Marathon'
            };

            // Buat elemen konfirmasi
            const confirmation = document.createElement('div');
            confirmation.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #f5f7fa;
                backdrop-filter: blur(10px);
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                z-index: 1000;
                box-shadow: 0 20px 40px rgba(26, 35, 50, 0.3);
                animation: popIn 0.5s ease-out;
                color: #2d3748;
                max-width: 400px;
                width: 90%;
                border: 2px solid #d4af37;
            `;

            confirmation.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                <h2 style="margin-bottom: 1rem; color: #d4af37;">Pendaftaran Berhasil!</h2>
                <p style="margin-bottom: 1.5rem; color: #2d3748;">Anda telah terdaftar untuk <strong>${tournamentNames[tournament]}</strong></p>
                <button onclick="this.parentElement.remove()" style="
                    background: linear-gradient(45deg, #d4af37, #e6c85a);
                    color: #1a2332;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                ">Tutup</button>
            `;

            // Tambahkan style untuk animasi pop-in
            const style = document.createElement('style');
            style.textContent = `
                @keyframes popIn {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(confirmation);

            // Auto close setelah 5 detik
            setTimeout(() => {
                if (confirmation.parentElement) {
                    confirmation.remove();
                }
            }, 5000);
        }

        // Efek hover tambahan pada kartu
        document.querySelectorAll('.tournament-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.03)';
            });

            card.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    </script>
</body>
</html>