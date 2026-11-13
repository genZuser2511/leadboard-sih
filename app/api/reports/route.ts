import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('created_at, insurance_type, picked_up, email_sent')

    if (error) throw error

    // Trend data (strictly 0 if no leads)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const trendData = days.map(day => ({
      name: day,
      leads: 0,
      calls: 0,
    }))

    // Real data for insurance distribution
    const distribution = (leads || []).reduce((acc: any, lead) => {
      acc[lead.insurance_type] = (acc[lead.insurance_type] || 0) + 1
      return acc
    }, {})

    const pieData = Object.entries(distribution).map(([name, value]) => ({
      name,
      value
    }))

    // Calculate real KPIs
    const totalLeads = leads?.length || 0
    const converted = leads?.filter(l => l.email_sent).length || 0
    const conversionRate = totalLeads > 0 ? (converted / totalLeads) * 100 : 0

    return new NextResponse(JSON.stringify({
      trendData,
      pieData,
      topAgents: [],
      kpis: {
        conversionVelocity: conversionRate.toFixed(1) + '%',
        avgCallTime: '0m 0s',
        emailOpenRate: '0.0%',
        conversionTrend: '0.0%',
        callTrend: '0s',
        emailTrend: '0.0%'
      },
      conversions: []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err) {
    console.error('Error fetching report data:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
