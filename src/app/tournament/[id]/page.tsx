'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TournamentBracket } from '@/components/TournamentBracket'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle';


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
  scheduled_at?: string
  team1_id?: string
  team2_id?: string
  team1_score?: number
  team2_score?: number
  team1_balls?: number
  team2_balls?: number
  table_number?: number
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
  ballsFor: number
  ballsAgainst: number
  ballDifference: number
  points: number
}

interface PageProps {
  params: Promise<{ id: string }>
}

const formatLabels: Record<string, string> = {
  group_knockout: "Babak Grup + Knockout",
  single_elimination: "Eliminasi Tunggal",
  double_elimination: "Eliminasi Ganda",
}

const statusLabels: Record<string, string> = {
  setup: "Persiapan",
  group_stage: "Babak Grup",
  knockout: "Babak Knockout",
  completed: "Selesai",
}

const statusStyles: Record<string, string> = {
  setup: "bg-accent/15 text-accent border-accent/30",
  group_stage: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  knockout: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  completed: "bg-green-500/15 text-green-500 border-green-500/30",
}

export default function TournamentDetailPage({ params }: PageProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllParticipants, setShowAllParticipants] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

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
          setError('Gagal memuat data turnamen')
        }
      } catch (err) {
        setError('Error memuat turnamen')
        console.error('Error fetching tournament:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTournamentData()
  }, [params])

  // Realtime subscription for matches updates with fallback polling
  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null
    let pollingInterval: NodeJS.Timeout | null = null

    const fetchLatestMatches = async (tournamentId: string) => {
      try {
        const { data: latestMatches, error } = await supabase
          .from('matches')
          .select('*')
          .eq('tournament_id', tournamentId)

        if (error) throw error

        if (latestMatches) {
          setMatches(latestMatches as Match[])
        }
      } catch (err) {
        console.error('Error fetching latest matches:', err)
      }
    }

    const setupRealtimeSubscription = async () => {
      try {
        const { id } = await params

        // Try to set up realtime subscription first
        subscription = supabase
          .channel(`matches_${id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'matches',
              filter: `tournament_id=eq.${id}`,
            },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                // Add new match
                setMatches(prev => [...prev, payload.new as Match])
              } else if (payload.eventType === 'UPDATE') {
                // Update existing match
                setMatches(prev =>
                  prev.map(match =>
                    match.id === payload.new.id
                      ? { ...match, ...payload.new } as Match
                      : match
                  )
                )
              } else if (payload.eventType === 'DELETE') {
                // Remove deleted match
                setMatches(prev =>
                  prev.filter(match => match.id !== payload.old.id)
                )
              }
            }
          )
          .subscribe((status) => {
            // If realtime fails, fall back to polling
            if (status === 'SUBSCRIBED') {

              if (pollingInterval) {
                clearInterval(pollingInterval)
                pollingInterval = null
              }
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              // Set up polling as fallback (every 5 seconds)
              pollingInterval = setInterval(() => {
                fetchLatestMatches(id)
              }, 5000)
            }
          })
      } catch (err) {
        console.error('Error setting up realtime subscription:', err)
        // Fall back to polling if realtime setup fails
        const { id } = await params
        pollingInterval = setInterval(() => {
          fetchLatestMatches(id)
        }, 5000)
      }
    }

    // Only setup subscription after tournament data is loaded
    if (tournament?.id) {
      setupRealtimeSubscription()
    }

    // Cleanup subscription and polling on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [params, tournament?.id])

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
      ballsFor: 0,
      ballsAgainst: 0,
      ballDifference: 0,
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
        const team1Balls = match.team1_balls || 0
        const team2Balls = match.team2_balls || 0

        team1Standing.played += 1
        team2Standing.played += 1
        team1Standing.goalsFor += team1Score
        team1Standing.goalsAgainst += team2Score
        team2Standing.goalsFor += team2Score
        team2Standing.goalsAgainst += team1Score
        team1Standing.ballsFor += team1Balls
        team1Standing.ballsAgainst += team2Balls
        team2Standing.ballsFor += team2Balls
        team2Standing.ballsAgainst += team1Balls

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
        team1Standing.ballDifference = team1Standing.ballsFor - team1Standing.ballsAgainst
        team2Standing.ballDifference = team2Standing.ballsFor - team2Standing.ballsAgainst
      }
    })


    return standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.ballDifference !== a.ballDifference) return b.ballDifference - a.ballDifference
      return a.teamName.localeCompare(b.teamName)
    })
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  // Get unique groups
  const groups = Array.from(
    new Set(
      groupMatches
        .map(m => m.round_name)
        .filter(Boolean) as string[]
    )
  ).sort((a, b) => {
    const aNum = parseInt((a.match(/(\d+)$/) || [])[1] || '', 10)
    const bNum = parseInt((b.match(/(\d+)$/) || [])[1] || '', 10)

    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
    if (!isNaN(aNum)) return -1
    if (!isNaN(bNum)) return 1

    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground">Memuat turnamen...</p>
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Turnamen tidak ditemukan'}</p>
          <Link href="/tournaments" className="text-accent hover:text-foreground transition-colors">
            ← Kembali ke turnamen
          </Link>
        </div>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-8">
      <div className="container mx-auto max-w-6xl space-y-8 py-10 px-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">

          <Link
            href="/tournaments"
            className="text-sm text-accent hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            ← Kembali ke turnamen
          </Link>
          <ThemeToggle />

        </div>

        {/* Tournament Header */}
        <Card className="bg-card border-border">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground break-words">{tournament.name}</CardTitle>
                <p className="text-accent mt-1 text-sm md:text-base">
                  {formatLabels[tournament.format] || tournament.format} • Maksimal {tournament.max_teams} tim
                </p>
              </div>
              <Badge className={`text-sm font-medium flex-shrink-0 ${statusStyles[tournament.status] || ''}`}>
                {statusLabels[tournament.status] || tournament.status}
              </Badge>
            </div>

            {/* Tournament Info Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-secondary p-3 md:p-4">
                <p className="text-xs uppercase tracking-wide text-accent mb-1">Format</p>
                <p className="text-sm text-foreground">{formatLabels[tournament.format] || tournament.format}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary p-3 md:p-4">
                <p className="text-xs uppercase tracking-wide text-accent mb-1">Tim Terdaftar</p>
                <p className="text-sm text-foreground">{teams.length} / {tournament.max_teams}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary p-3 md:p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-xs uppercase tracking-wide text-accent mb-1">Status</p>
                <p className="text-sm text-foreground">{statusLabels[tournament.status] || tournament.status}</p>
              </div>
            </div>

            {/* Additional Info */}
            {(tournament.description || tournament.location || tournament.start_date) && (
              <div className="space-y-3 pt-4 border-t border-border">
                {tournament.description && (
                  <p className="text-sm text-muted-foreground">{tournament.description}</p>
                )}
                {tournament.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📍</span>
                    <span>{tournament.location}</span>
                  </div>
                )}
                {tournament.start_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <Card className="bg-card border-border w-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-foreground">Peserta ({teams.length})</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-hidden">
              <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(showAllParticipants ? teams : teams.slice(0, 6)).map((team) => (
                  <div
                    key={team.id}
                    className="bg-secondary border border-border rounded-lg p-3 flex items-center min-w-0"
                  >
                    <div className="font-medium text-foreground truncate min-w-0 flex-1">
                      {team.name}
                    </div>
                  </div>
                ))}
              </div>
              {teams.length > 6 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllParticipants(!showAllParticipants)}
                    className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                  >
                    {showAllParticipants ? '← Tampilkan Lebih Sedikit' : `Tampilkan Semua (${teams.length - 6} lainnya) →`}
                  </button>
                </div>
              )}
            </CardContent>

          </Card>
        )}

        {/* Group Stage */}
        {groups.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Babak Grup</h2>
            <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
              {groups.map((groupName) => {
                const standings = calculateGroupStandings(groupName!)
                const groupMatchList = groupMatches
                  .filter(match => match.round_name === groupName)
                  .sort((a, b) => {
                    // First, sort by status priority: pending > in_progress > completed
                    const statusPriority: Record<string, number> = {
                      'in_progress': 1,
                      'pending': 2,
                      'completed': 3,
                    }
                    const statusA = statusPriority[a.status] || 999
                    const statusB = statusPriority[b.status] || 999
                    if (statusA !== statusB) return statusA - statusB

                    // Then sort by scheduled time
                    const parseTime = (s?: string) => {
                      if (!s) return Infinity
                      const t = Date.parse(s)
                      return Number.isNaN(t) ? Infinity : t
                    }

                    const tA = parseTime(a.scheduled_at)
                    const tB = parseTime(b.scheduled_at)
                    if (tA !== tB) return tA - tB

                    // If scheduled times are equal or both missing, sort by table_number (if present)
                    const tableA = typeof a.table_number === 'number' ? a.table_number : Infinity
                    const tableB = typeof b.table_number === 'number' ? b.table_number : Infinity
                    if (tableA !== tableB) return tableA - tableB

                    // Fallback to match_number, then id for stable ordering
                    const mA = typeof a.match_number === 'number' ? a.match_number : Infinity
                    const mB = typeof b.match_number === 'number' ? b.match_number : Infinity
                    if (mA !== mB) return mA - mB

                    return a.id.localeCompare(b.id)
                  })

                return (
                  <Card key={groupName} className="bg-card border-border w-full overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center justify-between">
                        <span>
                          {groupName
                            ? groupName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                            : 'Grup'}
                        </span>
                        <Badge variant="outline" className="text-accent border-border">
                          {groupMatchList.length} pertandingan
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 w-full overflow-hidden">
                      {/* Standings */}
                      <div>
                        <h4 className="text-sm font-semibold text-accent mb-2">Klasemen</h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-8">#</TableHead>
                                <TableHead className="min-w-[120px]">Tim</TableHead>
                                <TableHead className="text-center w-8">M</TableHead>
                                <TableHead className="text-center w-8">W</TableHead>
                                <TableHead className="text-center w-8">D</TableHead>
                                <TableHead className="text-center w-8">L</TableHead>
                                <TableHead className="text-center w-8">BD</TableHead>
                                <TableHead className="text-center w-8">Pts</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {standings.map((standing, index) => (
                                <TableRow key={standing.teamId}>
                                  <TableCell className="font-medium text-accent">{index + 1}</TableCell>
                                  <TableCell className="font-medium text-secondary-foreground">
                                    <div className="truncate max-w-[120px]">{standing.teamName}</div>
                                  </TableCell>
                                  <TableCell className="text-center text-secondary-foreground/70">{standing.played}</TableCell>
                                  <TableCell className="text-center text-secondary-foreground/70">{standing.won}</TableCell>
                                  <TableCell className="text-center text-secondary-foreground/70">{standing.drawn}</TableCell>
                                  <TableCell className="text-center text-secondary-foreground/70">{standing.lost}</TableCell>
                                  <TableCell className={`text-center font-medium ${standing.ballDifference > 0
                                    ? 'text-green-600'
                                    : standing.ballDifference < 0
                                      ? 'text-red-600'
                                      : 'text-secondary-foreground/70'
                                    }`}>
                                    {standing.ballDifference > 0 ? `+${standing.ballDifference}` : standing.ballDifference}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold text-accent">{standing.points}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Matches */}
                      <div>
                        <h4 className="text-sm font-semibold text-accent mb-2">Pertandingan</h4>
                        <div className="space-y-2">
                          {(expandedGroups[groupName!] ? groupMatchList : groupMatchList.slice(0, 3)).map((match) => {
                            const team1 = teams.find(t => t.id === match.team1_id)
                            const team2 = teams.find(t => t.id === match.team2_id)
                            const isCompleted = match.status === 'completed'
                            const scoreDisplay = isCompleted &&
                              typeof match.team1_score === 'number' &&
                              typeof match.team2_score === 'number'
                              ? `${match.team1_score} - ${match.team2_score}`
                              : match.status === 'in_progress' ? 'Sedang Berlangsung' : match.scheduled_at ? formatDate(match.scheduled_at) : 'Terjadwal'

                            return (
                              <div key={match.id} className="flex flex-col sm:flex-row items-center justify-center bg-secondary border border-border rounded-lg p-3 gap-2 w-full text-center">
                                <div className="w-full">
                                  <div className="text-sm text-foreground flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                                    <span className="font-medium truncate md:w-[50%]">{team1?.name || 'TBD'}</span>
                                    <span className="text-accent text-xs sm:text-sm flex-shrink-0">vs</span>
                                    <span className="font-medium truncate md:w-[50%]">{team2?.name || 'TBD'}</span>
                                  </div>
                                  <div className="mt-2 space-y-1">
                                    <div>
                                      <span className={`text-sm ${isCompleted ? 'text-accent font-bold' : 'text-muted-foreground font-bold'}`}>
                                        {scoreDisplay}
                                      </span>
                                    </div>
                                    {match.table_number && match.scheduled_at && (
                                      <div>
                                        <span className="text-xs text-muted-foreground">
                                          Meja {match.table_number}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        {groupMatchList.length > 3 && (
                          <div className="mt-3 text-center">
                            <button
                              onClick={() => toggleGroupExpansion(groupName!)}
                              className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                            >
                              {expandedGroups[groupName!] ? '← Tampilkan Lebih Sedikit' : `Tampilkan Semua Pertandingan (${groupMatchList.length - 3} lainnya) →`}
                            </button>
                          </div>
                        )}
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
            title="Babak Knockout"
          />
        )}

        {/* Tournament Progress */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Progress Turnamen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pertandingan Selesai</span>
                <span className="text-accent font-medium">
                  {matches.filter(m => m.status === 'completed').length} / {matches.length}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]/80 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${matches.length > 0 ? (matches.filter(m => m.status === 'completed').length / matches.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  {matches.length > 0
                    ? `${Math.round((matches.filter(m => m.status === 'completed').length / matches.length) * 100)}% Selesai`
                    : 'Tidak ada pertandingan terjadwal'
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