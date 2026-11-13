export type LeadStatus = 'picked_up' | 'missed' | 'renewal' | 'pending'

export interface Lead {
  id: string
  name: string
  email: string
  number: string     // Maps to 'phone' in mock
  status?: LeadStatus // Derived status for UI
  picked_up: boolean
  insurance_type: string
  insuranceType?: string // UI compatibility
  date_time: string  // Maps to 'lastCalled' in mock
  lastCalled?: string   // UI compatibility
  renewal: boolean
  email_sent: boolean
  policy_id: string
  created_at: string
  // Optional/Computed fields for UI backward compatibility
  agent?: string
  premium?: number
  callHistory?: CallHistory[]
}

export interface CallStats {
  totalLeads: number
  pickupRate: number
  emailRate: number
  renewalsCount: number
}

export interface CallHistory {
  id: string
  leadId: string
  timestamp: string
  status: LeadStatus
  agent: string
  notes?: string
}
