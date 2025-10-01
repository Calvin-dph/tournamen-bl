'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RegistrationManagement from '@/components/RegistrationManagement'
import { Users, Trophy, Clock, CheckCircle } from 'lucide-react'
import type { Tournament, Registration } from '@/lib/supabase'

export default function AdminPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingApproval: 0,
    approvedRegistrations: 0,
    addedToTournaments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchTournaments(),
      fetchStats()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments')
      const data = await response.json()
      if (data.success) {
        setTournaments(data.tournaments)
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/db-registrations')
      const data = await response.json()
      if (data.success) {
        const registrations: Registration[] = data.registrations
        setStats({
          totalRegistrations: registrations.length,
          pendingApproval: registrations.filter((r) => r.status === 'pending').length,
          approvedRegistrations: registrations.filter((r) => r.status === 'approved').length,
          addedToTournaments: registrations.filter((r) => r.status === 'added_to_tournament').length
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto"></div>
          <p className="mt-4 text-[#f5f7fa]">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#1a2332] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#f5f7fa] mb-2">
            🎱 TI Billiard Cup - Admin Panel
          </h1>
          <p className="text-[#d4af37] text-lg">
            Manage registrations and tournaments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#f5f7fa]/5 border-[#d4af37]/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#f5f7fa]">
                Total Registrations
              </CardTitle>
              <Users className="h-4 w-4 text-[#d4af37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#d4af37]">
                {stats.totalRegistrations}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa]/5 border-[#d4af37]/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#f5f7fa]">
                Pending Approval
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {stats.pendingApproval}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa]/5 border-[#d4af37]/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#f5f7fa]">
                Approved
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {stats.approvedRegistrations}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa]/5 border-[#d4af37]/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#f5f7fa]">
                Added to Tournaments
              </CardTitle>
              <Trophy className="h-4 w-4 text-[#d4af37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#d4af37]">
                {stats.addedToTournaments}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-[#f5f7fa]/5 border-[#d4af37]/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="registrations" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#1a2332] border-[#d4af37]/20">
                <TabsTrigger 
                  value="registrations"
                  className="text-[#f5f7fa] data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a2332]"
                >
                  Registration Management
                </TabsTrigger>
                <TabsTrigger 
                  value="tournaments"
                  className="text-[#f5f7fa] data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a2332]"
                >
                  Tournament Overview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registrations" className="mt-6">
                <RegistrationManagement tournaments={tournaments} />
              </TabsContent>

              <TabsContent value="tournaments" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#f5f7fa]">Active Tournaments</h3>
                  {tournaments.length > 0 ? (
                    <div className="grid gap-4">
                      {tournaments.map((tournament) => (
                        <Card key={tournament.id} className="bg-[#f5f7fa]/10 border-[#d4af37]/30">
                          <CardHeader>
                            <CardTitle className="text-[#f5f7fa] flex items-center justify-between">
                              {tournament.name}
                              <span className="text-sm bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded">
                                {tournament.status}
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-[#f5f7fa]/70">Format</p>
                                <p className="text-[#f5f7fa] font-medium">{tournament.format}</p>
                              </div>
                              <div>
                                <p className="text-[#f5f7fa]/70">Max Teams</p>
                                <p className="text-[#f5f7fa] font-medium">{tournament.max_teams}</p>
                              </div>
                              <div>
                                <p className="text-[#f5f7fa]/70">Group Size</p>
                                <p className="text-[#f5f7fa] font-medium">{tournament.group_size || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-[#f5f7fa]/70">Created</p>
                                <p className="text-[#f5f7fa] font-medium">
                                  {new Date(tournament.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {tournament.description && (
                              <p className="mt-3 text-[#f5f7fa]/80 text-sm">{tournament.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="mx-auto h-12 w-12 text-[#d4af37]/50 mb-4" />
                      <p className="text-[#f5f7fa]/70">No tournaments found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}