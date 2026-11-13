'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Lead } from '@/types'
import { format, subDays, isSameDay } from 'date-fns'

export function CallsChart() {
  const { data: leads } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await fetch('/api/leads')
      return res.json()
    },
  })

  // Calculate last 7 days of performance
  const chartData = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dayName = format(date, 'EEE')
    
    const dayLeads = leads?.filter(l => l.date_time && isSameDay(new Date(l.date_time), date)) || []
    const picked_up = dayLeads.filter(l => l.picked_up).length
    const missed = dayLeads.length - picked_up

    return { 
      day: dayName, 
      picked_up, 
      missed 
    }
  })

  return (
    <Card className="bg-surface border-white/5 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">Call Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {leads ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="day"
                  stroke="#6B7A99"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="var(--font-dm-mono)"
                />
                <YAxis
                  stroke="#6B7A99"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  fontFamily="var(--font-dm-mono)"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface border border-white/10 p-3 rounded-lg shadow-xl ring-1 ring-black/50">
                          <p className="text-xs font-mono uppercase text-muted mb-2">{payload[0].payload.day}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-success" />
                              <span className="text-sm font-medium text-foreground">Picked Up: {payload[0].value}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-danger" />
                              <span className="text-sm font-medium text-foreground">Missed: {payload[1].value}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="picked_up"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="missed"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                  fillOpacity={0.3}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted text-sm font-mono italic">
              Aggregating call logs...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
