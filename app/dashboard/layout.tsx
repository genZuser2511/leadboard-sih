'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search, LayoutDashboard, Users, FileText, Settings, Zap, LogIn } from 'lucide-react'

import { signOut } from '../login/actions'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-base text-foreground font-sans">
      {/* Sidebar - Fixed */}
      <aside className="w-64 border-r border-white/5 bg-surface hidden lg:flex flex-col p-6 fixed h-full z-20">
        <div className="flex items-center gap-2 px-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Leadboard</span>
        </div>

        <nav className="space-y-1">
          <NavItem 
            href="/dashboard" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={pathname === '/dashboard'} 
          />
          <NavItem 
            href="/dashboard/leads" 
            icon={Users} 
            label="Leads" 
            active={pathname === '/dashboard/leads'} 
          />
          <NavItem 
            href="/dashboard/reports" 
            icon={FileText} 
            label="Reports" 
            active={pathname === '/dashboard/reports'} 
          />
          <NavItem 
            href="/dashboard/settings" 
            icon={Settings} 
            label="Settings" 
            active={pathname === '/dashboard/settings'} 
          />
          <button 
            onClick={async () => {
              await signOut()
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-muted hover:bg-danger/10 hover:text-danger group mt-10"
          >
            <LogIn className="w-4 h-4 rotate-180 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </nav>

        <div className="mt-auto p-4 bg-accent/5 border border-accent/10 rounded-xl hover:bg-accent/10 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent group-hover:animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Pro Plan</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search leads, agents, or policies..."
              className="w-full bg-base border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-sans"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-success">Live Ops</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/5 rounded-full relative transition-colors">
                <Bell className="w-5 h-5 text-muted" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
              </button>
              <div className="h-8 w-[1px] bg-white/5" />
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">Ops Manager</p>
                  <p className="text-xs text-muted font-mono uppercase tracking-widest">Lead Gen HQ</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold shadow-lg shadow-accent/10">
                  OM
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="min-h-full">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ href, icon: Icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
        active ? 'bg-accent text-white font-medium shadow-lg shadow-accent/20' : 'text-muted hover:bg-white/5 hover:text-foreground'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}
