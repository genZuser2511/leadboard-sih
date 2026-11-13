'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, User, Bell, Shield, Database, 
  Globe, Zap, ChevronRight, CheckCircle2, 
  AlertCircle, RefreshCw, LogOut, Terminal
} from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general')
  const [isCheckingDb, setIsCheckingDb] = useState(false)
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'idle'>('idle')

  const checkConnection = async () => {
    setIsCheckingDb(true)
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        setDbStatus('connected')
      } else {
        setDbStatus('error')
      }
    } catch {
      setDbStatus('error')
    } finally {
      setTimeout(() => setIsCheckingDb(false), 800)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <motion.div 
      className="p-8 space-y-8 max-w-5xl"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted mt-1 font-sans">Manage your operational preferences and platform integrations.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12 items-start">
        {/* Sidebar Navigation */}
        <motion.nav variants={item} className="space-y-1">
          <SettingsNavLink 
            icon={User} 
            label="General" 
            active={activeSection === 'general'} 
            onClick={() => setActiveSection('general')} 
          />
          <SettingsNavLink 
            icon={Bell} 
            label="Notifications" 
            active={activeSection === 'notifications'} 
            onClick={() => setActiveSection('notifications')} 
          />
          <SettingsNavLink 
            icon={Database} 
            label="Supabase Core" 
            active={activeSection === 'database'} 
            onClick={() => setActiveSection('database')} 
          />
          <SettingsNavLink 
            icon={Shield} 
            label="Security" 
            active={activeSection === 'security'} 
            onClick={() => setActiveSection('security')} 
          />
          <div className="pt-8 px-3">
             <button className="flex items-center gap-3 text-danger text-sm font-medium hover:underline">
               <LogOut className="w-4 h-4" />
               Sign Out
             </button>
          </div>
        </motion.nav>

        {/* Content Area */}
        <motion.div variants={item} className="space-y-8 bg-surface/30 p-8 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
          {activeSection === 'general' && (
            <div className="space-y-6">
              <SectionHeader title="Profile Information" description="Update your personal details and public profile." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Display Name" placeholder="Ops Manager" />
                <InputGroup label="Professional Email" placeholder="manager@leadboard.ai" />
              </div>
              <div className="border-t border-white/5 pt-6 flex justify-end">
                <button className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="space-y-6">
              <SectionHeader title="Supabase Integration" description="Global database configuration and API health monitoring." />
              
              {/* Connection Status Card */}
              <div className="p-6 rounded-2xl bg-base border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${dbStatus === 'connected' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Backend Connectivity</p>
                      <p className="text-xs text-muted font-mono">SUPABASE_PROD_CLUSTER</p>
                    </div>
                  </div>
                  <button 
                    onClick={checkConnection}
                    disabled={isCheckingDb}
                    className={`p-2 rounded-lg hover:bg-white/5 transition-all ${isCheckingDb ? 'animate-spin' : ''}`}
                  >
                    <RefreshCw className="w-4 h-4 text-muted" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {dbStatus === 'connected' ? (
                    <div className="flex items-center gap-2 text-success text-xs font-bold bg-success/5 px-3 py-1 rounded-full border border-success/10">
                      <CheckCircle2 className="w-3 h-3" />
                      SYSTEMS OPERATIONAL
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-danger text-xs font-bold bg-danger/5 px-3 py-1 rounded-full border border-danger/10">
                      <AlertCircle className="w-3 h-3" />
                      CONNECTION ERROR
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-muted" />
                    <span className="text-sm font-medium">Real-time Subscriptions</span>
                  </div>
                  <div className="w-10 h-5 bg-accent/20 rounded-full flex items-center px-1">
                    <div className="w-3 h-3 bg-accent rounded-full translate-x-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'general' && activeSection !== 'database' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-muted" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Under Construction</h3>
                <p className="text-sm text-muted">This module is part of the next operational sprint.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

function SettingsNavLink({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
        active 
          ? 'bg-accent/10 text-accent font-medium' 
          : 'text-muted hover:bg-white/5 hover:text-foreground'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-accent' : 'text-muted group-hover:text-foreground transition-colors'}`} />
        {label}
      </div>
      <ChevronRight className={`w-3 h-3 transition-transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
    </button>
  )
}

function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="pb-4 border-b border-white/5">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-muted mt-1">{description}</p>
    </div>
  )
}

function InputGroup({ label, placeholder }: { label: string, placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-muted">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-base border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-sans"
      />
    </div>
  )
}
