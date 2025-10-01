'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TournamentBracket } from '@/components/TournamentBracket'


interface Tournament {
  id: string
  name: string
  format: string
  status: string
  max_teams: number
  group_size?: number
  description?: string
  start_date?: string
  end_date?: string
  location?: string
}

interface Team {
  id: string
  name: string
  captain: string
  tournament_id: string
}

interface Match {
  id: string
  tournament_id: string
  match_type: 'group' | 'knockout'
  round_name?: string
  round_number?: number
  match_number?: number
  status: 'pending' | 'in_progress' | 'completed'
  team1_id?: string
  team2_id?: string
  team1_score?: number
  team2_score?: number
  winner_id?: string
}

interface GroupStanding {
  teamId: string
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

interface PageProps {
  params: Promise<{ id: string }>
}

const formatLabels: Record<string, string> = {
  group_knockout: "Group Stage + Knockout",
  single_elimination: "Single Elimination",
  double_elimination: "Double Elimination",
}

const statusLabels: Record<string, string> = {
  setup: "Preparation",
  group_stage: "Group Stage", 
  knockout: "Knockout Stage",
  completed: "Completed",
}

const statusStyles: Record<string, string> = {
  setup: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  group_stage: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  knockout: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
}

export default function TournamentDetailPage({ params }: PageProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/tournament/${id}`)
        const data = await response.json()

        if (data.success) {
          setTournament(data.tournament)
          setTeams(data.teams)
          setMatches(data.matches)
        } else {
          setError('Failed to load tournament data')
        }
      } catch (err) {
        setError('Error loading tournament')
        console.error('Error fetching tournament:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTournamentData()
  }, [params])

  // Process group matches and standings
  const groupMatches = matches.filter(match => match.match_type === 'group')
  const knockoutMatches = matches
    .filter(match => match.match_type === 'knockout')
    .map(match => ({
      id: match.id,
      roundNumber: match.round_number || 1,
      matchNumber: match.match_number || 0,
      status: match.status,
      team1: teams.find(t => t.id === match.team1_id),
      team2: teams.find(t => t.id === match.team2_id),
      team1Score: match.team1_score,
      team2Score: match.team2_score,
      winnerId: match.winner_id,
    }))

  // Calculate group standings
  const calculateGroupStandings = (groupName: string): GroupStanding[] => {
    const groupTeams = teams.filter(team => 
      groupMatches.some(match => 
        (match.team1_id === team.id || match.team2_id === team.id) &&
        match.round_name === groupName
      )
    )

    const standings = groupTeams.map(team => ({
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }))

    const relevantMatches = groupMatches.filter(match => 
      match.round_name === groupName && match.status === 'completed'
    )

    relevantMatches.forEach(match => {
      const team1Standing = standings.find(s => s.teamId === match.team1_id)
      const team2Standing = standings.find(s => s.teamId === match.team2_id)

      if (team1Standing && team2Standing) {
        const team1Score = match.team1_score || 0
        const team2Score = match.team2_score || 0

        team1Standing.played += 1
        team2Standing.played += 1
        team1Standing.goalsFor += team1Score
        team1Standing.goalsAgainst += team2Score
        team2Standing.goalsFor += team2Score
        team2Standing.goalsAgainst += team1Score

        if (team1Score > team2Score) {
          team1Standing.won += 1
          team1Standing.points += 3
          team2Standing.lost += 1
        } else if (team2Score > team1Score) {
          team2Standing.won += 1
          team2Standing.points += 3
          team1Standing.lost += 1
        } else {
          team1Standing.drawn += 1
          team2Standing.drawn += 1
          team1Standing.points += 1
          team2Standing.points += 1
        }

        team1Standing.goalDifference = team1Standing.goalsFor - team1Standing.goalsAgainst
        team2Standing.goalDifference = team2Standing.goalsFor - team2Standing.goalsAgainst
      }
    })

    return standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
      return a.teamName.localeCompare(b.teamName)
    })
  }

  // Get unique groups
  const groups = Array.from(new Set(groupMatches.map(match => match.round_name))).filter(Boolean)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-[#f5f7fa]">Loading tournament...</p>
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Tournament not found'}</p>
          <Link href="/tournament" className="text-[#d4af37] hover:text-[#f5f7fa] transition-colors">
            ← Back to tournaments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332]">
      <div className="container mx-auto max-w-6xl space-y-8 py-10 px-4">
        {/* Navigation */}
        <Link 
          href="/tournament" 
          className="text-sm text-[#d4af37] hover:text-[#f5f7fa] transition-colors inline-flex items-center gap-2"
        >
          ← Back to tournaments
        </Link>

        {/* Tournament Header */}
        <Card className="bg-[#2d3748]/60 border-[#d4af37]/30">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-2xl md:text-3xl font-bold text-[#f5f7fa] break-words">{tournament.name}</CardTitle>
                <p className="text-[#d4af37] mt-1 text-sm md:text-base">
                  {formatLabels[tournament.format] || tournament.format} • {tournament.max_teams} teams max
                </p>
              </div>
              <Badge className={`text-sm font-medium flex-shrink-0 ${statusStyles[tournament.status] || ''}`}>
                {statusLabels[tournament.status] || tournament.status}
              </Badge>
            </div>

            {/* Tournament Info Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-[#d4af37]/20 bg-[#1a2332]/60 p-3 md:p-4">
                <p className="text-xs uppercase tracking-wide text-[#d4af37] mb-1">Format</p>
                <p className="text-sm text-[#f5f7fa]">{formatLabels[tournament.format] || tournament.format}</p>
              </div>
              <div className="rounded-lg border border-[#d4af37]/20 bg-[#1a2332]/60 p-3 md:p-4">
                <p className="text-xs uppercase tracking-wide text-[#d4af37] mb-1">Teams Registered</p>
                <p className="text-sm text-[#f5f7fa]">{teams.length} / {tournament.max_teams}</p>
              </div>
              <div className="rounded-lg border border-[#d4af37]/20 bg-[#1a2332]/60 p-3 md:p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-xs uppercase tracking-wide text-[#d4af37] mb-1">Status</p>
                <p className="text-sm text-[#f5f7fa]">{statusLabels[tournament.status] || tournament.status}</p>
              </div>
            </div>

            {/* Additional Info */}
            {(tournament.description || tournament.location || tournament.start_date) && (
              <div className="space-y-3 pt-4 border-t border-[#d4af37]/20">
                {tournament.description && (
                  <p className="text-sm text-[#f5f7fa]/80">{tournament.description}</p>
                )}
                {tournament.location && (
                  <div className="flex items-center gap-2 text-sm text-[#f5f7fa]/70">
                    <span>📍</span>
                    <span>{tournament.location}</span>
                  </div>
                )}
                {tournament.start_date && (
                  <div className="flex items-center gap-2 text-sm text-[#f5f7fa]/70">
                    <span>📅</span>
                    <span>
                      {new Date(tournament.start_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                      {tournament.end_date && tournament.end_date !== tournament.start_date && (
                        ` - ${new Date(tournament.end_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}`
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Participants */}
        {teams.length > 0 && (
          <Card className="bg-[#2d3748]/60 border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-[#f5f7fa]">Participants ({teams.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <div key={team.id} className="bg-[#1a2332]/60 border border-[#d4af37]/20 rounded-lg p-3">
                    <div className="font-medium text-[#f5f7fa] truncate">{team.name}</div>
                    <div className="text-sm text-[#d4af37] mt-1 truncate">Captain: {team.captain}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Group Stage */}
        {groups.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#f5f7fa]">Group Stage</h2>
            <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
              {groups.map((groupName) => {
                const standings = calculateGroupStandings(groupName!)
                const groupMatchList = groupMatches.filter(match => match.round_name === groupName)
                
                return (
                  <Card key={groupName} className="bg-[#2d3748]/60 border-[#d4af37]/30">
                    <CardHeader>
                      <CardTitle className="text-[#f5f7fa] flex items-center justify-between">
                        <span>
                            {groupName
                                ? groupName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                                : 'Group'}
                        </span>
                        <Badge variant="outline" className="text-[#d4af37] border-[#d4af37]/30">
                          {groupMatchList.length} matches
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Standings */}
                      <div>
                        <h4 className="text-sm font-semibold text-[#d4af37] mb-2">Standings</h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-8">#</TableHead>
                                <TableHead className="min-w-[120px]">Team</TableHead>
                                <TableHead className="text-center w-8">P</TableHead>
                                <TableHead className="text-center w-8">W</TableHead>
                                <TableHead className="text-center w-8 hidden sm:table-cell">D</TableHead>
                                <TableHead className="text-center w-8 hidden sm:table-cell">L</TableHead>
                                <TableHead className="text-center w-8">Pts</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {standings.map((standing, index) => (
                                <TableRow key={standing.teamId}>
                                  <TableCell className="font-medium text-[#d4af37]">{index + 1}</TableCell>
                                  <TableCell className="font-medium text-[#f5f7fa]">
                                    <div className="truncate max-w-[120px]">{standing.teamName}</div>
                                  </TableCell>
                                  <TableCell className="text-center text-[#f5f7fa]/70">{standing.played}</TableCell>
                                  <TableCell className="text-center text-[#f5f7fa]/70">{standing.won}</TableCell>
                                  <TableCell className="text-center text-[#f5f7fa]/70 hidden sm:table-cell">{standing.drawn}</TableCell>
                                  <TableCell className="text-center text-[#f5f7fa]/70 hidden sm:table-cell">{standing.lost}</TableCell>
                                  <TableCell className="text-center font-semibold text-[#d4af37]">{standing.points}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Matches */}
                      <div>
                        <h4 className="text-sm font-semibold text-[#d4af37] mb-2">Matches</h4>
                        <div className="space-y-2">
                          {groupMatchList.map((match) => {
                            const team1 = teams.find(t => t.id === match.team1_id)
                            const team2 = teams.find(t => t.id === match.team2_id)
                            const isCompleted = match.status === 'completed'
                            const scoreDisplay = isCompleted && 
                              typeof match.team1_score === 'number' && 
                              typeof match.team2_score === 'number'
                              ? `${match.team1_score} - ${match.team2_score}`
                              : match.status === 'in_progress' ? 'Live' : 'Scheduled'

                            return (
                              <div key={match.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#1a2332]/60 border border-[#d4af37]/10 rounded-lg p-3 gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-[#f5f7fa] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="font-medium truncate">{team1?.name || 'TBD'}</span>
                                    <span className="text-[#d4af37] text-xs sm:text-sm">vs</span>
                                    <span className="font-medium truncate">{team2?.name || 'TBD'}</span>
                                  </div>
                                </div>
                                <span className={`text-sm flex-shrink-0 ${isCompleted ? 'text-[#d4af37] font-medium' : 'text-[#f5f7fa]/70'}`}>
                                  {scoreDisplay}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Knockout Bracket */}
        {knockoutMatches.length > 0 && (
          <TournamentBracket 
            matches={knockoutMatches} 
            title="Knockout Stage"
          />
        )}

        {/* Tournament Progress */}
        <Card className="bg-[#2d3748]/60 border-[#d4af37]/30">
          <CardHeader>
            <CardTitle className="text-[#f5f7fa]">Tournament Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#f5f7fa]/70">Completed Matches</span>
                <span className="text-[#d4af37] font-medium">
                  {matches.filter(m => m.status === 'completed').length} / {matches.length}
                </span>
              </div>
              <div className="w-full bg-[#1a2332]/60 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#d4af37] to-[#b8941f] h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${matches.length > 0 ? (matches.filter(m => m.status === 'completed').length / matches.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-xs text-[#f5f7fa]/60">
                  {matches.length > 0 
                    ? `${Math.round((matches.filter(m => m.status === 'completed').length / matches.length) * 100)}% Complete`
                    : 'No matches scheduled'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}