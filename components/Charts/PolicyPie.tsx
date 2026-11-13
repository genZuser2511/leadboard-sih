'use client'

import { useQuery } from '@tanstack/react-query'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Lead } from '@/types'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6366F1']

export function PolicyPie() {
  const { data: leads } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await fetch('/api/leads')
      return res.json()
    },
  })

  // Calculate distribution from lead data
  const distribution = leads?.reduce((acc: Record<string, number>, lead) => {
    const type = lead.insurance_type || 'Other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const chartData = distribution 
    ? Object.entries(distribution).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
    : []

  return (
    <Card className="bg-surface border-white/5 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">Policy Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface border border-white/10 p-2 rounded-lg shadow-xl ring-1 ring-black/50">
                          <p className="text-sm font-medium text-foreground">{payload[0].name}: {payload[0].value}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-mono uppercase tracking-wider text-muted">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted text-sm font-mono italic">
              Calculating distribution...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
