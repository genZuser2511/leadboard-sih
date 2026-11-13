import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Lead } from '@/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to UI expectations
    const lead: Lead = {
      ...data,
      status: data.renewal ? 'renewal' : (data.picked_up ? 'picked_up' : (data.date_time ? 'missed' : 'pending')),
      insuranceType: data.insurance_type,
      lastCalled: data.date_time,
      // Default call history as empty array for now since table wasn't in provided schema
      callHistory: [] 
    }

    return NextResponse.json(lead)
  } catch (err) {
    console.error('Server error fetching lead:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

