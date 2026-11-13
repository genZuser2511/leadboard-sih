'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Lead, LeadStatus } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { MoreHorizontal, User } from 'lucide-react'

const statusMap: Record<LeadStatus, { label: string, variant: 'success' | 'destructive' | 'warning' | 'default' }> = {
  picked_up: { label: 'Picked Up', variant: 'success' },
  missed: { label: 'Missed', variant: 'destructive' },
  renewal: { label: 'Renewal', variant: 'warning' },
  pending: { label: 'Pending', variant: 'default' },
}

export function LeadsTable() {
  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await fetch('/api/leads')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/5 bg-surface p-8">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/5 bg-surface overflow-hidden h-full">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Recent Leads</h2>
        <div className="text-sm text-muted">Total: {leads?.length || 0} leads</div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Insurance</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Last Called</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads?.map((lead) => (
              <TableRow key={lead.id} className="cursor-pointer group">
                <TableCell>
                  <div className="font-medium text-foreground">{lead.name || 'Guest Lead'}</div>
                  <div className="text-xs text-muted font-mono">{lead.number || 'No number'}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[lead.status || 'pending'].variant}>
                    {statusMap[lead.status || 'pending'].label}
                  </Badge>
                </TableCell>
                <TableCell>{lead.insurance_type}</TableCell>
                <TableCell className="font-mono text-foreground font-medium">
                  {/* Defaulting to $0 as premium is not in real schema yet */}
                  {formatCurrency(lead.premium || 0)}
                </TableCell>
                <TableCell className="text-muted text-xs">
                  {formatDate(lead.date_time)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-accent" />
                    </div>
                    {/* Defaulting to Unassigned as agent is not in real schema yet */}
                    <span className="text-sm">{lead.agent || 'Unassigned'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-muted" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {(!leads || leads.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted font-mono italic">
                  No operational data found in Supabase.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
