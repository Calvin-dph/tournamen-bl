import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the database schema
export interface Tournament {
  id: string
  name: string
  format: 'group_knockout' | 'single_elimination' | 'double_elimination'
  max_teams: number
  group_size?: number
  status: 'setup' | 'group_stage' | 'knockout' | 'completed'
  description?: string
  start_date?: string
  end_date?: string
  location?: string
  rules?: string
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  tournament_id: string
  name: string
  captain: string
  players: string[]
  seed?: number
  group_name?: string
  created_at: string
}

export interface Match {
  id: string
  tournament_id: string
  team1_id?: string
  team2_id?: string
  team1_score?: number
  team2_score?: number
  winner_id?: string
  match_type: 'group' | 'knockout'
  round_name?: string
  round_number?: number
  match_number?: number
  status: 'scheduled' | 'in_progress' | 'completed'
  played_at?: string
  created_at: string
}

export interface GroupStanding {
  id: string
  tournament_id: string
  team_id: string
  group_name: string
  matches_played?: number
  wins?: number
  draws?: number
  losses?: number
  goals_for?: number
  goals_against?: number
  goal_difference?: number
  points?: number
}

export interface Registration {
  id: string
  email: string
  bidang: string
  type: 'single_women' | 'single_men' | 'double'
  player1_name: string
  player1_phone: string
  player2_name?: string
  player2_phone?: string
  status: 'pending' | 'approved' | 'added_to_tournament' | 'rejected'
  tournament_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Form data interface for the registration form
export interface RegistrationFormData {
  email: string
  bidang: string
  // Single Woman (optional)
  singleWomanName: string
  singleWomanPhone: string
  // Single Man (optional)
  singleManName: string
  singleManPhone: string
  // Double (required)
  doublePlayer1Name: string
  doublePlayer1Phone: string
  doublePlayer2Name: string
  doublePlayer2Phone: string
}