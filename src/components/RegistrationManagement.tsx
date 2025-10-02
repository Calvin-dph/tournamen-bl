'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle, XCircle, Clock, UserPlus, Users, Filter } from 'lucide-react'
import type { Registration, Tournament } from '@/lib/supabase'

interface RegistrationManagementProps {
  tournaments?: Tournament[]
}

export default function RegistrationManagement({ tournaments = [] }: RegistrationManagementProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTournament, setSelectedTournament] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedRegistrations, setSelectedRegistrations] = useState<Set<string>>(new Set())

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await fetch(`/api/db-registrations?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setRegistrations(data.registrations)
      } else {
        console.error('Error fetching registrations:', data.error)
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchRegistrations()
  }, [statusFilter, fetchRegistrations])

  const updateRegistrationStatus = async (id: string, status: Registration['status']) => {
    try {
      const response = await fetch('/api/db-registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      
      const data = await response.json()
      if (data.success) {
        await fetchRegistrations()
      } else {
        console.error('Error updating status:', data.error)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const addTeamsToTournament = async () => {
    if (!selectedTournament || selectedRegistrations.size === 0) {
      alert('Please select a tournament and at least one registration')
      return
    }

    try {
      const response = await fetch(`/api/tournaments/${selectedTournament}/add-teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: selectedTournament,
          registrationIds: Array.from(selectedRegistrations)
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert(`Successfully added ${data.summary.teams_created} teams to tournament!`)
        setSelectedRegistrations(new Set())
        await fetchRegistrations()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error adding teams:', error)
      alert('Error adding teams to tournament')
    }
  }

  const getStatusBadge = (status: Registration['status']) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200' },
      approved: { icon: CheckCircle, color: 'bg-green-500/10 text-green-700 border-green-200' },
      added_to_tournament: { icon: Users, color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
      rejected: { icon: XCircle, color: 'bg-red-500/10 text-red-700 border-red-200' }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const toggleRegistrationSelection = (id: string) => {
    const newSelection = new Set(selectedRegistrations)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedRegistrations(newSelection)
  }

  const approvedRegistrations = registrations.filter(r => r.status === 'approved' && !r.tournament_id)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading registrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registration Management</h2>
          <p className="text-gray-600">Manage tournament registrations and add teams</p>
        </div>
        <Badge className="bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20">
          {registrations.length} Total Registrations
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="added_to_tournament">Added to Tournament</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {approvedRegistrations.length > 0 && tournaments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add Teams to Tournament
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Select Tournament</label>
                <select
                  value={selectedTournament}
                  onChange={(e) => setSelectedTournament(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                >
                  <option value="">Choose tournament...</option>
                  {tournaments.map(tournament => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name} ({tournament.status})
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={addTeamsToTournament}
                disabled={!selectedTournament || selectedRegistrations.size === 0}
                className="bg-[#d4af37] hover:bg-[#b8941f] text-white"
              >
                Add {selectedRegistrations.size} Selected Teams
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRegistrations(new Set(approvedRegistrations.map(r => r.id)))
                        } else {
                          setSelectedRegistrations(new Set())
                        }
                      }}
                      checked={selectedRegistrations.size === approvedRegistrations.length && approvedRegistrations.length > 0}
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bidang</TableHead>
                  <TableHead>Team A</TableHead>
                  <TableHead>Team B</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      {registration.status === 'approved' && !registration.tournament_id && (
                        <input
                          type="checkbox"
                          checked={selectedRegistrations.has(registration.id)}
                          onChange={() => toggleRegistrationSelection(registration.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{registration.email}</TableCell>
                    <TableCell>{registration.bidang}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{registration.team_a1}</div>
                        {registration.team_a2 && <div className="text-gray-500">{registration.team_a2}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {registration.team_b1 ? (
                          <>
                            <div>{registration.team_b1}</div>
                            {registration.team_b2 && <div className="text-gray-500">{registration.team_b2}</div>}
                          </>
                        ) : (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(registration.status)}</TableCell>
                    <TableCell>
                      {new Date(registration.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {registration.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateRegistrationStatus(registration.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRegistrationStatus(registration.id, 'rejected')}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {registration.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRegistrationStatus(registration.id, 'pending')}
                          >
                            Revert
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {registrations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No registrations found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}