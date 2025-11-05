'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'

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
  group_knockout: "Grup + Knockout",
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
        setError('Gagal memuat turnamen')
      }
    } catch (err) {
      setError('Error memuat turnamen')
      console.error('Error fetching tournaments:', err)
    } finally {
      setLoading(false)
    }
  }

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-6xl py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={fetchTournaments}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-8">
      <div className="container mx-auto max-w-6xl py-10 px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-accent hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              ← Kembali ke Beranda
            </Link>
            <ThemeToggle />
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Turnamen Aktif</h1>
            <p className="text-accent text-lg">TI Billiard Cup 2025</p>
          </div>
        </div>

        {/* Tournaments Grid */}
        {tournaments.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-foreground text-center">
                Tidak ada turnamen aktif saat ini.<br />
                <span className="text-accent text-sm">Cek lagi nanti untuk update!</span>
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <Link key={tournament.id} href={`/tournament/${tournament.id}`}>
                <Card className="bg-card border-border hover:border-accent/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-accent/15 cursor-pointer">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-foreground leading-tight">
                        {tournament.name}
                      </CardTitle>
                      <Badge className={`text-xs font-medium ${statusStyles[tournament.status] || ''}`}>
                        {statusLabels[tournament.status] || tournament.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-accent">
                        {formatLabels[tournament.format] || tournament.format}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Maks {tournament.max_teams} tim
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {tournament.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tournament.description}
                      </p>
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
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border">
                      <span className="text-accent text-sm font-medium">
                        Lihat Detail →
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