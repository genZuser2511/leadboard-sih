'use client'

import { StatsRow } from '@/components/StatsRow'
import { LeadsTable } from '@/components/LeadsTable'
import { CallsChart } from '@/components/Charts/CallsChart'
import { PolicyPie } from '@/components/Charts/PolicyPie'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  return (
    <motion.div 
      className="p-8 space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Operational Overview</h1>
        <p className="text-muted mt-1 font-sans">Real-time performance tracking for <span className="text-foreground font-medium underline decoration-accent/30 underline-offset-4">Leadboard Insurance</span>.</p>
      </motion.header>

      <motion.div variants={item}>
        <StatsRow />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CallsChart />
        </div>
        <div>
          <PolicyPie />
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2">
          <LeadsTable />
        </div>
        <div className="h-full">
          <ActivityTimeline />
        </div>
      </motion.div>
    </motion.div>
  )
}


