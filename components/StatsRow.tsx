'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Users, PhoneOutgoing, Mail, RefreshCw } from 'lucide-react'
import { CallStats } from '@/types'
import { motion } from 'framer-motion'

export function StatsRow() {
  const { data, isLoading } = useQuery<CallStats>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats')
      return res.json()
    },
  })

  const stats = [
    { label: 'Total Leads', value: data?.totalLeads, icon: Users, color: 'text-accent' },
    { label: 'Pickup Rate', value: `${data?.pickupRate}%`, icon: PhoneOutgoing, color: 'text-success' },
    { label: 'Email Rate', value: `${data?.emailRate}%`, icon: Mail, color: 'text-warning' },
    { label: 'Renewals', value: data?.renewalsCount, icon: RefreshCw, color: 'text-insight' },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-surface animate-pulse rounded-xl border border-white/5" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <Card className="bg-surface border-white/5 p-6 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm font-mono uppercase tracking-wider">{stat.label}</p>
                <div className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</div>
              </div>
              <div className={`p-3 rounded-lg bg-base ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            {/* Subtle accent border on bottom */}
            <div className={`absolute bottom-0 left-0 h-1 bg-current opacity-20 w-0 group-hover:w-full transition-all duration-500 ${stat.color}`} />
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
