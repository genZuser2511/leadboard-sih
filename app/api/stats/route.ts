import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CallStats } from '@/types'

export async function GET() {
  try {
    // Fetch all leads to calculate stats (for small/medium datasets)
    // For very large datasets, use .rpc() or multiple .count() calls
    const { data, error, count } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact' })

    if (error) {
      console.error('Supabase error fetching stats:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalLeads = count || 0
    const pickedUpCount = data?.filter(l => l.picked_up).length || 0
    const emailSentCount = data?.filter(l => l.email_sent).length || 0
    const renewalsCount = data?.filter(l => l.renewal).length || 0

    const stats: CallStats = {
      totalLeads,
      pickupRate: totalLeads > 0 ? (pickedUpCount / totalLeads) * 100 : 0,
      emailRate: totalLeads > 0 ? (emailSentCount / totalLeads) * 100 : 0,
      renewalsCount
    }

    return NextResponse.json(stats)
  } catch (err) {
    console.error('Server error fetching stats:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
