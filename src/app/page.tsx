'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTournamentName, setSelectedTournamentName] = useState('');
  const [processingButtons, setProcessingButtons] = useState<Set<string>>(new Set());
  const [registeredTournaments, setRegisteredTournaments] = useState<Set<string>>(new Set());

  const tournaments = [
    {
      id: 'billiard',
      icon: '🎱',
      title: 'Billiard Championship',
      description: 'Kompetisi billiard untuk semua level. Tunjukkan skill dan strategi terbaik Anda di meja hijau.',
      className: 'billiard'
    },
    {
      id: 'badminton',
      icon: '🏸',
      title: 'Badminton Tournament',
      description: 'Turnamen bulu tangkis dengan sistem gugur. Siapkan raket dan mental juara Anda!',
      className: 'badminton'
    },
    {
      id: 'mobile-legend',
      icon: '🎮',
      title: 'Mobile Legend Cup',
      description: 'Kompetisi esports Mobile Legend 5v5. Bentuk tim terbaik dan raih kemenangan!',
      className: 'mobile-legend'
    },
    {
      id: 'pingpong',
      icon: '🏓',
      title: 'Ping Pong Challenge',
      description: 'Turnamen tenis meja dengan sistem round robin. Asah refleks dan teknik Anda!',
      className: 'pingpong'
    },
    {
      id: 'running',
      icon: '🏃‍♂️',
      title: 'Running Marathon',
      description: 'Kompetisi lari dengan berbagai kategori jarak. Buktikan stamina dan kecepatan Anda!',
      className: 'running'
    }
  ];

  const tournamentNames: { [key: string]: string } = {
    'billiard': 'Billiard Championship',
    'badminton': 'Badminton Tournament',
    'mobile-legend': 'Mobile Legend Cup',
    'pingpong': 'Ping Pong Challenge',
    'running': 'Running Marathon'
  };

  useEffect(() => {
    // Create floating particles
    createParticles();
  }, []);

  const createParticles = () => {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 50;
    container.innerHTML = ''; // Clear existing particles

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 6) + 's';
      container.appendChild(particle);
    }
  };

  const selectTournament = (tournamentId: string) => {
    setSelectedTournament(tournamentId);
    setProcessingButtons(prev => new Set(prev).add(tournamentId));

    setTimeout(() => {
      setProcessingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(tournamentId);
        return newSet;
      });
      setRegisteredTournaments(prev => new Set(prev).add(tournamentId));
      setSelectedTournamentName(tournamentNames[tournamentId]);
      setShowConfirmation(true);
      
      // Navigate to registration page based on tournament
      setTimeout(() => {
        if (tournamentId === 'billiard') {
          router.push('/billiard');
        } else {
          router.push('/register');
        }
      }, 3000);
    }, 2000);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setTimeout(() => {
      setSelectedTournament(null);
    }, 300);
  };

  const getButtonText = (tournamentId: string) => {
    if (processingButtons.has(tournamentId)) return 'Processing...';
    if (registeredTournaments.has(tournamentId)) return '✅ Terdaftar';
    return 'Daftar Sekarang';
  };

  const getButtonDisabled = (tournamentId: string) => {
    return processingButtons.has(tournamentId);
  };

  return (
    <>
      <div id="particles" className="floating-particles"></div>
      
      <div className="container">
        <div className="header">
          <h1>🏆 Pilih Tournament Anda</h1>
          <p>Bergabunglah dalam kompetisi seru dan tunjukkan kemampuan terbaik Anda!</p>
        </div>

        <div className="tournaments-grid">
          {tournaments.map((tournament, index) => (
            <div
              key={tournament.id}
              className={`tournament-card ${tournament.className} ${
                selectedTournament === tournament.id ? 'selected' : ''
              }`}
              data-tournament={tournament.id}
              style={{
                animation: `cardSlideIn 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className={`tournament-icon ${tournament.className}`}>
                {tournament.icon}
              </div>
              <h3>{tournament.title}</h3>
              <p>{tournament.description}</p>
              <button
                className="join-btn"
                onClick={() => selectTournament(tournament.id)}
                disabled={getButtonDisabled(tournament.id)}
              >
                {getButtonText(tournament.id)}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ marginBottom: '1rem', color: '#d4af37' }}>Pendaftaran Berhasil!</h2>
            <p style={{ marginBottom: '1.5rem', color: '#2d3748' }}>
              Anda telah terdaftar untuk <strong>{selectedTournamentName}</strong>
            </p>
            <button onClick={closeConfirmation} className="close-btn">
              Tutup
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
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

        .join-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Tournament specific colors */
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

        .confirmation-modal {
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
        }

        .confirmation-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .close-btn {
          background: linear-gradient(45deg, #d4af37, #e6c85a);
          color: #1a2332;
          border: none;
          padding: 10px 25px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
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

        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }

        @keyframes popIn {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          .header h1 { font-size: 2.5rem; }
          .tournaments-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .container { padding: 1rem; }
        }
      `}</style>
    </>
  );
}
