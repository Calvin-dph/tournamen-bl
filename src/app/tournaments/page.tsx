'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Tournament {
  id: string
  name: string
  format: string
  status: string
  max_teams: number
  description?: string
  start_date?: string
  end_date?: string
  location?: string
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

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments')
      const data = await response.json()
      
      if (data.success) {
        setTournaments(data.tournaments)
      } else {
        setError('Failed to load tournaments')
      }
    } catch (err) {
      setError('Error loading tournaments')
      console.error('Error fetching tournaments:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332]">
        <div className="container mx-auto max-w-6xl py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
              <p className="text-[#f5f7fa]">Loading tournaments...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332]">
        <div className="container mx-auto max-w-6xl py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchTournaments}
                className="px-4 py-2 bg-[#d4af37] text-[#1a2332] rounded-lg hover:bg-[#b8941f] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332]">
      <div className="container mx-auto max-w-6xl py-10 px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <Link 
            href="/" 
            className="text-sm text-[#d4af37] hover:text-[#f5f7fa] transition-colors inline-flex items-center gap-2"
          >
            ← Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#f5f7fa] mb-2">Active Tournaments</h1>
            <p className="text-[#d4af37] text-lg">TI Billiard Cup 2025</p>
          </div>
        </div>

        {/* Tournaments Grid */}
        {tournaments.length === 0 ? (
          <Card className="bg-[#2d3748]/60 border-[#d4af37]/30">
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-[#f5f7fa] text-center">
                No active tournaments at the moment.<br />
                <span className="text-[#d4af37] text-sm">Check back later for updates!</span>
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <Link key={tournament.id} href={`/tournament/${tournament.id}`}>
                <Card className="bg-[#2d3748]/60 border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#d4af37]/15 cursor-pointer">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-[#f5f7fa] leading-tight">
                        {tournament.name}
                      </CardTitle>
                      <Badge className={`text-xs font-medium ${statusStyles[tournament.status] || ''}`}>
                        {statusLabels[tournament.status] || tournament.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-[#d4af37]">
                        {formatLabels[tournament.format] || tournament.format}
                      </div>
                      <div className="text-sm text-[#f5f7fa]/70">
                        Max {tournament.max_teams} teams
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {tournament.description && (
                      <p className="text-sm text-[#f5f7fa]/80 line-clamp-2">
                        {tournament.description}
                      </p>
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
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-[#d4af37]/20">
                      <span className="text-[#d4af37] text-sm font-medium">
                        View Details →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}