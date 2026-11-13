'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { TrendingUp, TrendingDown, PhoneCall, Mail, Award, Calendar, ChevronDown, Database } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ReportsPage() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await fetch('/api/reports')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const kpis = reports?.kpis || {
    conversionVelocity: '0.0%',
    avgCallTime: '0m 0s',
    emailOpenRate: '0.0%',
    conversionTrend: '0.0%',
    callTrend: '0s',
    emailTrend: '0.0%'
  }

  return (
    <motion.div 
      className="p-8 space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Intelligence</h1>
          <p className="text-muted mt-1 font-sans">Advanced analytics and operational forecasting.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-white/5">
          <button className="px-4 py-2 bg-base rounded-lg text-sm font-medium shadow-sm">Last 7 Days</button>
          <button className="px-4 py-2 opacity-50 text-sm font-medium">Last 30 Days</button>
          <button className="p-2 opacity-50"><Calendar className="w-4 h-4" /></button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Conversion Velocity" 
          value={kpis.conversionVelocity} 
          trend={kpis.conversionTrend} 
          isUp={parseFloat(kpis.conversionTrend) >= 0} 
          icon={TrendingUp} 
          color="text-success"
        />
        <KPICard 
          label="Average Call Time" 
          value={kpis.avgCallTime} 
          trend={kpis.callTrend} 
          isUp={parseFloat(kpis.callTrend) >= 0} 
          icon={PhoneCall} 
          color="text-accent"
        />
        <KPICard 
          label="Email Open Rate" 
          value={kpis.emailOpenRate} 
          trend={kpis.emailTrend} 
          isUp={parseFloat(kpis.emailTrend) >= 0} 
          icon={Mail} 
          color="text-warning"
        />
      </motion.div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={item} className="bg-surface border border-white/5 rounded-2xl p-6 h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Lead Volume Trend
            </h3>
            <button className="text-xs text-muted hover:text-foreground flex items-center gap-1">
              Monthly <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reports?.trendData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              <Area type="monotone" dataKey="calls" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="bg-surface border border-white/5 rounded-2xl p-6 h-[400px]">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Award className="w-4 h-4 text-warning" />
            Top Performing Agents
          </h3>
          {reports?.topAgents?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports?.topAgents} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="converted" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No agent performance data available." />
          )}
        </motion.div>
      </div>

      {/* Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div variants={item} className="md:col-span-1 bg-surface border border-white/5 rounded-2xl p-6 h-[250px]">
          <h3 className="text-sm font-bold text-muted mb-4 uppercase tracking-tighter">Policy Split</h3>
          {reports?.pieData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={reports?.pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reports?.pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-xs text-muted font-mono italic">
                N/A
             </div>
          )}
        </motion.div>

        <motion.div variants={item} className="md:col-span-3 bg-surface border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Conversion Events</h3>
            <button className="text-xs text-accent font-medium">Download Report</button>
          </div>
          <div className="space-y-4">
            {reports?.conversions?.length > 0 ? (
              reports.conversions.map((conv: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-base/50 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{conv.label}</p>
                      <p className="text-xs text-muted">{conv.agent} • {conv.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success">+{conv.amount}</p>
                    <p className="text-[10px] text-muted">Annual Premium</p>
                  </div>
                </div>
              ))
            ) : (
                <div className="py-12 text-center text-sm text-muted font-mono italic">
                   No conversion data found in backend.
                </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function KPICard({ label, value, trend, isUp, icon: Icon, color }: any) {
  return (
    <div className="bg-surface border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-16 h-16" />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-muted">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold">{value}</div>
        <div className={`flex items-center gap-1 text-sm font-bold ${isUp ? 'text-success' : 'text-danger'}`}>
          {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {trend}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-2 p-8">
      <Database className="w-8 h-8 text-white/5" />
      <p className="text-sm text-muted font-mono italic lowercase">{message}</p>
    </div>
  )
}
