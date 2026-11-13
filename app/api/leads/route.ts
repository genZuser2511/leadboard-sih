import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Lead } from '@/types'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('date_time', { ascending: false })

    if (error) {
      console.error('Supabase error fetching leads:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to UI expectations
    const leads: Lead[] = (data || []).map(item => ({
      ...item,
      // Map booleans to the status enum for the UI
      status: item.renewal ? 'renewal' : (item.picked_up ? 'picked_up' : (item.date_time ? 'missed' : 'pending')),
      // Ensure other fields are present
      insuranceType: item.insurance_type,
      lastCalled: item.date_time
    }))

    return NextResponse.json(leads)
  } catch (err) {
    console.error('Server error fetching leads:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

