'use client'

import React, { useState } from 'react'
import { LeadsTable } from '@/components/LeadsTable'
import { Plus, Search, Filter, Download, LayoutGrid, List, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Lead } from '@/types'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const { data: leads } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await fetch('/api/leads')
      return res.json()
    },
  })

  const stats = {
    all: leads?.length || 0,
    new: leads?.filter(l => !l.lastCalled).length || 0,
    followed: leads?.filter(l => l.lastCalled && !l.email_sent).length || 0,
    completed: leads?.filter(l => l.email_sent).length || 0,
  }

  const handleExport = () => {
    if (!leads || leads.length === 0) return

    const headers = ['Name', 'Email', 'Number', 'Insurance Type', 'Status', 'Date Registered']
    const csvData = leads.map(l => [
      l.name || 'Guest',
      l.email || 'N/A',
      l.number || 'N/A',
      l.insurance_type || 'N/A',
      l.status || 'pending',
      l.created_at
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `leadboard_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div 
      className="p-8 space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted mt-1 font-sans">Manage, track, and convert your insurance pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Plus className="w-4 h-4" />
            Add New Lead
          </button>
        </div>
      </motion.div>

      {/* CRM Dashboard Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Pipeline" value={stats.all} color="text-accent" />
        <StatCard label="New Leads" value={stats.new} color="text-success" />
        <StatCard label="In Progress" value={stats.followed} color="text-warning" />
        <StatCard label="Converted" value={stats.completed} color="text-info" />
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={item} className="bg-surface border border-white/5 rounded-2xl p-2 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex bg-base p-1 rounded-xl w-full md:w-auto">
          <TabButton label="All Leads" count={stats.all} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <TabButton label="New" count={stats.new} active={activeTab === 'new'} onClick={() => setActiveTab('new')} />
          <TabButton label="Following up" count={stats.followed} active={activeTab === 'followed'} onClick={() => setActiveTab('followed')} />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto px-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              className="w-full bg-base border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
            />
          </div>
          <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4 text-muted" />
          </button>
          <div className="flex items-center border border-white/10 rounded-lg p-0.5">
            <button className="p-1.5 bg-white/5 rounded-md"><List className="w-4 h-4 text-accent" /></button>
            <button className="p-1.5 rounded-md opacity-50"><LayoutGrid className="w-4 h-4" /></button>
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div variants={item} className="min-h-[500px]">
        <LeadsTable />
      </motion.div>
    </motion.div>
  )
}

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-surface border border-white/5 p-4 rounded-2xl hover:border-accent/20 transition-all group">
      <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">{label}</p>
      <div className={`text-2xl font-bold ${color} group-hover:scale-110 transition-transform origin-left`}>{value}</div>
    </div>
  )
}

function TabButton({ label, count, active, onClick }: { label: string, count: number, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
        active 
          ? 'bg-surface text-foreground shadow-sm' 
          : 'text-muted hover:text-foreground'
      }`}
    >
      {label}
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-accent/20 text-accent' : 'bg-white/5'}`}>
        {count}
      </span>
    </button>
  )
}
