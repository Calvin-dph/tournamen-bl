'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Award, Trophy } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Team, Match as BaseMatch } from '@/lib/supabase'

interface MatchWithTeams extends BaseMatch {
  team1?: { id: string; name: string }
  team2?: { id: string; name: string }
}

interface GroupStanding {
  id?: string
  teamId: string
  teamName: string
  team_id?: string
  team?: { name: string }
  group_name?: string
  played: number
  won: number
  wins?: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  goal_difference?: number
  points: number
  matches_played?: number
}

interface GroupStageManagementProps {
  tournamentId: string
  teams: Team[]
  groupSize?: number
  onAdvanceTeams: (teams: Team[]) => void
}

export default function GroupStageManagement({
  tournamentId,
  teams,
  groupSize = 4,
  onAdvanceTeams
}: GroupStageManagementProps) {
  const [groups, setGroups] = useState<Record<string, Team[]>>({})
  const [standings, setStandings] = useState<GroupStanding[]>([])
  const [matches, setMatches] = useState<MatchWithTeams[]>([])
  const [loading, setLoading] = useState(true)

  const initializeGroups = useCallback(() => {
    if (teams.length === 0) return

    const numberOfGroups = Math.ceil(teams.length / groupSize)
    const groupNames = Array.from({ length: numberOfGroups }, (_, i) => 
      String.fromCharCode(65 + i) // A, B, C, etc.
    )

    const newGroups: Record<string, Team[]> = {}
    
    groupNames.forEach(name => {
      newGroups[`Group ${name}`] = []
    })

    // Distribute teams evenly across groups
    teams.forEach((team, index) => {
      const groupIndex = index % numberOfGroups
      const groupName = `Group ${groupNames[groupIndex]}`
      newGroups[groupName].push(team)
    })

    setGroups(newGroups)
  }, [teams, groupSize])

  const loadGroupData = useCallback(async () => {
    try {
      // Load group standings
      const { data: standingsData, error: standingsError } = await supabase
        .from('group_standings')
        .select(`
          *,
          team:teams(id, name, captain)
        `)
        .eq('tournament_id', tournamentId)

      if (!standingsError) {
        setStandings(standingsData || [])
      }

      // Load matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          *,
          team1:teams!matches_team1_id_fkey(id, name),
          team2:teams!matches_team2_id_fkey(id, name)
        `)
        .eq('tournament_id', tournamentId)
        .eq('match_type', 'group')

      if (!matchesError) {
        setMatches(matchesData || [])
      }
    } catch (error) {
      console.error('Error loading group data:', error)
    } finally {
      setLoading(false)
    }
  }, [tournamentId])

  useEffect(() => {
    initializeGroups()
    loadGroupData()
  }, [initializeGroups, loadGroupData])

  const updateMatchScore = async (matchId: string, team1Score: number, team2Score: number) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({
          team1_score: team1Score,
          team2_score: team2Score,
          status: 'completed',
          played_at: new Date().toISOString()
        })
        .eq('id', matchId)

      if (error) throw error

      // Reload data to update standings
      loadGroupData()
    } catch (error) {
      console.error('Error updating match score:', error)
      alert('Gagal memperbarui skor pertandingan')
    }
  }

  const advanceTopTeams = () => {
    // Get top 2 teams from each group (simplified logic)
    const advancedTeams: Team[] = []
    
    Object.entries(groups).forEach(([groupName, groupTeams]) => {
      const groupStandings = standings.filter(s => s.group_name === groupName)
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points
          return (b.goal_difference || b.goalDifference || 0) - (a.goal_difference || a.goalDifference || 0)
        })
      
      // Take top 2 teams
      groupStandings.slice(0, 2).forEach(standing => {
        const team = groupTeams.find(t => t.id === standing.team_id)
        if (team) advancedTeams.push(team)
      })
    })

    onAdvanceTeams(advancedTeams)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading group stage...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Babak Penyisihan
        </h2>
        {Object.keys(groups).length > 0 && (
          <Button onClick={advanceTopTeams}>
            <Trophy className="w-4 h-4 mr-2" />
            Lanjut ke Knockout
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groups).map(([groupName, groupTeams]) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle className="text-center">{groupName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Tim</h4>
                  {groupTeams.map(team => (
                    <div key={team.id} className="p-2 bg-muted rounded text-sm">
                      {team.name}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Klasemen</h4>
                  <div className="text-xs space-y-1">
                    <div className="grid grid-cols-4 gap-2 font-medium">
                      <span>Tim</span>
                      <span>P</span>
                      <span>M</span>
                      <span>Poin</span>
                    </div>
                    {standings
                      .filter(s => s.group_name === groupName)
                      .sort((a, b) => {
                        if (b.points !== a.points) return b.points - a.points
                        return (b.goal_difference || b.goalDifference || 0) - (a.goal_difference || a.goalDifference || 0)
                      })
                      .map((standing, index) => (
                        <div key={standing.id} className={`grid grid-cols-4 gap-2 text-xs ${index < 2 ? 'font-bold text-green-600' : ''}`}>
                          <span className="truncate">{standing.team?.name}</span>
                          <span>{standing.matches_played || 0}</span>
                          <span>{standing.wins || 0}</span>
                          <span>{standing.points || 0}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Pertandingan</h4>
                  {matches
                    .filter(m => {
                      const team1InGroup = groupTeams.some(t => t.id === m.team1_id)
                      const team2InGroup = groupTeams.some(t => t.id === m.team2_id)
                      return team1InGroup && team2InGroup
                    })
                    .map(match => (
                      <div key={match.id} className="p-2 border rounded text-xs space-y-2">
                        <div className="flex justify-between">
                          <span>{match.team1?.name}</span>
                          <span>vs</span>
                          <span>{match.team2?.name}</span>
                        </div>
                        
                        {match.status === 'completed' ? (
                          <div className="text-center font-bold">
                            {match.team1_score} - {match.team2_score}
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <Input
                              type="number"
                              placeholder="0"
                              className="h-6 text-xs"
                              onChange={(e) => {
                                const score2 = document.querySelector(`#score2-${match.id}`) as HTMLInputElement
                                if (score2) {
                                  updateMatchScore(match.id, parseInt(e.target.value) || 0, parseInt(score2.value) || 0)
                                }
                              }}
                            />
                            <Input
                              id={`score2-${match.id}`}
                              type="number"
                              placeholder="0"
                              className="h-6 text-xs"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}