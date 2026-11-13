'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup } from './actions'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2, ArrowRight, CheckCircle, ShieldCheck, Zap, UserPlus, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      if (isLogin) {
        const result = await login(formData)
        if (result?.error) {
          setError(result.error)
        }
      } else {
        const result = await signup(formData)
        if (result?.error) {
          setError(result.error)
        } else if (result?.success) {
          setSuccess(true)
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface/50 border border-white/5 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-2xl shadow-black/50">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/20"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">Leadboard</h1>
            <p className="text-muted text-sm font-medium">The intelligence layer for insurance operations.</p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                  <p className="text-muted text-sm px-4">
                    We've sent a verification link to <span className="text-white">{email}</span>. Please click it to activate your account.
                  </p>
                </div>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-sm font-bold text-accent hover:underline flex items-center gap-2 mx-auto"
                >
                  Back to login <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                      <input 
                        required
                        type="email" 
                        placeholder="name@company.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-base/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-sans placeholder:text-muted/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Password</label>
                      {isLogin && (
                        <button type="button" className="text-[10px] uppercase font-bold text-accent hover:underline">Forgot?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                      <input 
                        required
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-base/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-sans placeholder:text-muted/30"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-3 text-xs font-bold text-danger"
                    >
                      <div className="w-5 h-5 rounded-full bg-danger/20 flex items-center justify-center shrink-0">!</div>
                      {error}
                    </motion.div>
                  )}

                  <button 
                    disabled={isLoading}
                    type="submit" 
                    className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:scale-100"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Enter Dashboard' : 'Create My Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-8">
                  <button 
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setError(null)
                    }}
                    className="text-xs font-bold text-muted hover:text-foreground transition-colors flex items-center gap-3 mx-auto uppercase tracking-tighter"
                  >
                    <div className="h-[1px] w-8 bg-white/10" />
                    {isLogin ? (
                      <span className="flex items-center gap-2">New here? <span className="text-accent">Sign Up</span></span>
                    ) : (
                      <span className="flex items-center gap-2">Already have an account? <span className="text-accent">Sign In</span></span>
                    )}
                    <div className="h-[1px] w-8 bg-white/10" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
            <ShieldCheck className="w-3 h-3" />
            SOC2 Tier 1
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
            <Zap className="w-3 h-3" />
            Real-time Ops
          </div>
        </div>
      </motion.div>
    </div>
  )
}
