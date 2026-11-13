'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Phone, PhoneMissed, PhoneForwarded, Clock } from 'lucide-react'
import { Lead } from '@/types'
import { formatDistanceToNow } from 'date-fns'

export function ActivityTimeline() {
  const { data: leads } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await fetch('/api/leads')
      return res.json()
    },
  })

  // Take the most recent 5 leads as "activity"
  const activities = leads?.slice(0, 5) || []

  return (
    <div className="bg-surface border border-white/5 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg tracking-tight">Recent Activity</h3>
        <button className="text-xs text-accent hover:underline font-medium">View All</button>
      </div>

      <div className="flex-1 space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
        {activities.map((item) => (
          <div key={item.id} className="relative pl-12 group">
            {/* Status Icon Node */}
            <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-surface flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
              item.status === 'picked_up' ? 'bg-success/20 text-success' :
              item.status === 'missed' ? 'bg-danger/20 text-danger' :
              item.status === 'renewal' ? 'bg-warning/20 text-warning' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {item.status === 'picked_up' && <PhoneForwarded className="w-4 h-4" />}
              {item.status === 'missed' && <PhoneMissed className="w-4 h-4" />}
              {item.status === 'renewal' && <Phone className="w-4 h-4" />}
              {item.status === 'pending' && <Clock className="w-4 h-4" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold group-hover:text-accent transition-colors">{item.name}</p>
                <span className="text-[10px] uppercase tracking-wider text-muted font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.date_time ? formatDistanceToNow(new Date(item.date_time), { addSuffix: true }) : 'Just now'}
                </span>
              </div>
              <p className="text-xs text-muted">
                {item.status === 'picked_up' ? 'Call answered' : 
                 item.status === 'missed' ? 'Call missed' : 
                 item.status === 'renewal' ? 'Renewal initiated' :
                 'New lead registered'}
              </p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center py-10 text-muted font-mono text-xs italic">
            Waiting for operations...
          </div>
        )}
      </div>

    </div>
  )
}
