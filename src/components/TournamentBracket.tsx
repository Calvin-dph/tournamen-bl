'use client'

import React from 'react'
import { Trophy, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface BracketTeam {
  id: string
  name: string
}

interface BracketMatch {
  id: string
  roundNumber: number
  matchNumber: number
  status: 'pending' | 'in_progress' | 'completed'
  team1?: BracketTeam
  team2?: BracketTeam
  team1Score?: number | null
  team2Score?: number | null
  winnerId?: string | null
}

interface TournamentBracketProps {
  matches: BracketMatch[]
  title?: string
}

export function TournamentBracket({ matches, title = "Bagan Turnamen" }: TournamentBracketProps) {
  if (matches.length === 0) {
    return (
      <Card className="min-h-screen bg-card border-border p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-foreground mb-2 flex items-center justify-center gap-3">
              <Trophy className="text-accent" size={40} />
              {title}
            </h1>
          </div>
          <div className="bg-card border border-accent/20 rounded-xl shadow-xl p-8">
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Tidak ada pertandingan bracket tersedia</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    const roundNumber = match.roundNumber
    if (!acc[roundNumber]) {
      acc[roundNumber] = []
    }
    acc[roundNumber].push(match)
    return acc
  }, {} as Record<number, BracketMatch[]>)

  const sortedRoundNumbers = Object.keys(rounds)
    .map(Number)
    .sort((a, b) => a - b)

  const totalRounds = sortedRoundNumbers.length

  // Sort matches within each round
  Object.keys(rounds).forEach(roundNum => {
    rounds[Number(roundNum)].sort((a, b) => a.matchNumber - b.matchNumber)
  })

  const getRoundName = (roundNumber: number, totalRounds: number) => {
    const roundsFromEnd = totalRounds - roundNumber

    if (roundsFromEnd === 0) return "Final"
    if (roundsFromEnd === 1) return "Semifinals"
    if (roundsFromEnd === 2) return "Quarterfinals"
    return `Round ${roundNumber}`
  }

  // Match Card Component
  const MatchCard = ({ match }: { match: BracketMatch }) => {
    const team1Name = match.team1?.name || 'TBD'
    const team2Name = match.team2?.name || 'TBD'
    const isTeam1Winner = match.winnerId === match.team1?.id
    const isTeam2Winner = match.winnerId === match.team2?.id

    return (
      <div className="bg-card border border-accent/20 rounded-lg p-3 mb-4 min-w-[200px]">
        <div className={`flex items-center justify-between p-2 rounded ${isTeam1Winner ? 'bg-emerald-500/15 border-l-4 border-emerald-500/60' : 'bg-secondary/40'
          }`}>
          <span className={`font-medium ${isTeam1Winner ? 'text-emerald-400' : 'text-foreground'}`}>
            {team1Name}
          </span>
          <span className={`font-bold text-lg ${isTeam1Winner ? 'text-emerald-400' : 'text-muted-foreground'}`}>
            {match.team1Score ?? '-'}
          </span>
        </div>
        <div className={`flex items-center justify-between p-2 rounded mt-1 ${isTeam2Winner ? 'bg-emerald-500/15 border-l-4 border-emerald-500/60' : 'bg-secondary/40'
          }`}>
          <span className={`font-medium ${isTeam2Winner ? 'text-emerald-400' : 'text-foreground'}`}>
            {team2Name}
          </span>
          <span className={`font-bold text-lg ${isTeam2Winner ? 'text-emerald-400' : 'text-muted-foreground'}`}>
            {match.team2Score ?? '-'}
          </span>
        </div>
      </div>
    )
  }

  // Connector Lines Component
  const ConnectorLines = ({ leftMatches, rightMatches }: { leftMatches: BracketMatch[], rightMatches: BracketMatch[] }) => {
    return (
      <div className="relative" style={{ width: '60px' }}>
        <svg width="60" height="100%" style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}>
          {rightMatches.map((_, pairIndex) => {
            const topMatchIndex = pairIndex * 2;
            const bottomMatchIndex = pairIndex * 2 + 1;

            if (bottomMatchIndex >= leftMatches.length) return null;

            // Calculate positions based on match distribution
            const totalLeftMatches = leftMatches.length;
            const spacing = 100 / totalLeftMatches;

            const y1 = (topMatchIndex + 0.5) * spacing;
            const y2 = (bottomMatchIndex + 0.5) * spacing;
            const yMid = (y1 + y2) / 2;

            return (
              <g key={pairIndex}>
                <line x1="0" y1={`${y1}%`} x2="30" y2={`${y1}%`} stroke="var(--foreground)" strokeWidth="2" />
                <line x1="0" y1={`${y2}%`} x2="30" y2={`${y2}%`} stroke="var(--foreground)" strokeWidth="2" />
                <line x1="30" y1={`${y1}%`} x2="30" y2={`${y2}%`} stroke="var(--foreground)" strokeWidth="2" />
                <line x1="30" y1={`${yMid}%`} x2="60" y2={`${yMid}%`} stroke="var(--foreground)" strokeWidth="2" />
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Find champion
  const finalMatch = rounds[totalRounds]
  const champion = finalMatch && finalMatch[0] && finalMatch[0].winnerId
    ? finalMatch[0].team1?.id === finalMatch[0].winnerId
      ? finalMatch[0].team1?.name
      : finalMatch[0].team2?.name
    : "TBD"

  // Calculate total number of teams
  const totalTeams = rounds[1] ? rounds[1].length * 2 : 0

  return (
    <Card className="bg-card border-border p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-foreground mb-2 flex items-center justify-center gap-3">
            <Trophy className="text-accent" size={40} />
            {title}
          </h1>
          <p className="text-muted-foreground">{totalTeams}-Team Knockout Tournament • {totalRounds} Rounds</p>
        </div>

        <div className="bg-card border border-accent/20 rounded-xl shadow-xl p-4 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex gap-2 min-w-max relative">
              {sortedRoundNumbers.map((roundNum, index) => {
                const isLastRound = index === sortedRoundNumbers.length - 1
                const currentRoundMatches = rounds[roundNum]
                const nextRoundMatches = rounds[sortedRoundNumbers[index + 1]]

                return (
                  <React.Fragment key={roundNum}>
                    {/* Round Column */}
                    <div className="flex flex-col" style={{ width: '220px' }}>
                      <h2 className="text-xl font-bold text-foreground mb-4 text-center">
                        {getRoundName(roundNum, totalRounds)}
                      </h2>
                      <div className="flex flex-col justify-around h-full">
                        {currentRoundMatches.map(match => (
                          <MatchCard key={match.id} match={match} />
                        ))}
                      </div>
                    </div>

                    {/* Connector Lines (if not last round) */}
                    {!isLastRound && nextRoundMatches && (
                      <ConnectorLines
                        leftMatches={currentRoundMatches}
                        rightMatches={nextRoundMatches}
                      />
                    )}
                  </React.Fragment>
                )
              })}

              {/* Connector line to Champion */}
              <div className="flex flex-col justify-center" style={{ width: '60px' }}>
                <svg width="60" height="20">
                  <line x1="0" y1="10" x2="60" y2="10" stroke="var(--foreground)" strokeWidth="2" />
                </svg>
              </div>

              {/* Champion */}
              <div className="flex flex-col justify-center">
                <div className="text-center">
                  <Award className="text-accent mx-auto mb-3" size={48} />
                  <h2 className="text-xl font-bold text-foreground mb-3">Juara</h2>
                  <div className="bg-gradient-to-r from-accent/80 to-accent text-accent-foreground font-bold text-xl py-4 px-6 rounded-lg shadow-lg border border-accent/30">
                    {champion}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Highlight hijau menunjukkan tim pemenang • Skor ditampilkan di sebelah kanan</p>
        </div>
      </div>
    </Card>
  )
}