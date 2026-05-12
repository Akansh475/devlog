import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isToday } from 'date-fns'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LogCard from '../components/LogCard'
import { CopyProfileLink } from '../components/CopyProfileLink'
import { DashboardSkeleton, StatsSkeleton } from '../components/Skeletons'
import { EmptyState } from '../components/EmptyState'
import { useErrorBanner } from '../components/ErrorBanner'

export default function Dashboard() {
  const { user, updateUser } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviving, setReviving] = useState(false)
  const [reviveError, setReviveError] = useState('')
  const { ErrorBanner, showError } = useErrorBanner()

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    try {
      const res = await api.get('/api/logs/me')
      setLogs(res.data.logs)
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load logs. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this log?')) return
    try {
      await api.delete(`/api/logs/${id}`)
      setLogs((prev) => prev.filter((l) => l._id !== id))
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete log.')
    }
  }

  async function handleRevive() {
    setReviving(true)
    setReviveError('')
    try {
      const res = await api.post('/api/streaks/revive')
      updateUser({
        currentStreak: res.data.currentStreak,
        longestStreak: res.data.longestStreak,
        xpPoints: res.data.xpPoints,
      })
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Revival failed.'
      setReviveError(msg)
      showError(msg)
    } finally {
      setReviving(false)
    }
  }

  const hasLoggedToday = logs.length > 0 && isToday(new Date(logs[0].date || logs[0].createdAt))
  const streakBroken = user?.currentStreak === 0

  return (
    <>
      <ErrorBanner />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-10 init-hidden animate-fade-up" style={{ animationFillMode: 'forwards' }}>
          <p className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] mb-1">Dashboard</p>
          <h1 className="font-display text-5xl tracking-wider text-white mb-4">
            @<span className="text-red-accent">{user?.username}</span>
          </h1>
          <CopyProfileLink />
        </div>

        {/* ── Stats Grid ── */}
        {loading ? <StatsSkeleton /> : (
          <div className="grid grid-cols-3 gap-px bg-border mb-px init-hidden animate-fade-up delay-100" style={{ animationFillMode: 'forwards' }}>
            <div className="bg-surface p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-red-accent" />
              <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-2">Current Streak</p>
              <div className="flex items-end gap-2">
                <span className="font-display text-6xl text-white leading-none">{user?.currentStreak ?? 0}</span>
                <span className="text-3xl mb-1">🔥</span>
              </div>
              <p className="font-mono text-xs text-zinc-600 mt-2">Best: {user?.longestStreak ?? 0} days</p>
            </div>
            <div className="bg-surface p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-accent" />
              <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-2">XP Points</p>
              <span className="font-display text-6xl text-indigo-accent leading-none">{user?.xpPoints ?? 0}</span>
              <p className="font-mono text-xs text-zinc-600 mt-2">⚡ +10 per log</p>
            </div>
            <div className="bg-surface p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-border-bright" />
              <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-2">Total Logs</p>
              <span className="font-display text-6xl text-white leading-none">{logs.length}</span>
              <p className="font-mono text-xs text-zinc-600 mt-2">Entries written</p>
            </div>
          </div>
        )}

        {/* ── Today Status ── */}
        {!loading && (
          <div className="mb-6 mt-px init-hidden animate-fade-up delay-200" style={{ animationFillMode: 'forwards' }}>
            {hasLoggedToday ? (
              <div className="border border-border bg-surface p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="font-mono text-xs text-green-400 uppercase tracking-widest">
                  Mission Complete — You've logged today ✓
                </p>
              </div>
            ) : (
              <div className="border border-red-dim bg-red-glow p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-accent animate-pulse" />
                  <p className="font-mono text-xs text-red-accent uppercase tracking-widest">
                    ⚠ No log today — streak at risk
                  </p>
                </div>
                <Link to="/log/new"
                  className="font-mono text-xs uppercase tracking-widest border border-red-accent text-red-accent hover:bg-red-accent hover:text-white px-4 py-1.5 transition-all shrink-0">
                  Log Now →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Streak Revival ── */}
        {!loading && streakBroken && (
          <div className="border border-red-dim bg-red-glow p-5 mb-6 relative init-hidden animate-fade-up delay-200" style={{ animationFillMode: 'forwards' }}>
            <div className="absolute top-0 left-0 w-1 h-full bg-red-accent" />
            <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-1">Streak Broken</p>
            <p className="text-sm text-zinc-300 font-body mb-4">
              Your streak is gone. Spend 50 XP to revive it and get back to 1.
            </p>
            {reviveError && <p className="font-mono text-xs text-red-accent mb-3">⚠ {reviveError}</p>}
            <button
              onClick={handleRevive}
              disabled={reviving || (user?.xpPoints ?? 0) < 50}
              className="font-mono text-xs uppercase tracking-widest bg-red-accent hover:bg-red-dim disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2 transition-all">
              {reviving ? 'Reviving...' : 'Revive Streak 🔥 — 50 XP'}
            </button>
            {(user?.xpPoints ?? 0) < 50 && (
              <p className="font-mono text-xs text-zinc-600 mt-2">Need {50 - (user?.xpPoints ?? 0)} more XP</p>
            )}
          </div>
        )}

        {/* ── Logs Section ── */}
        <div className="flex items-center justify-between mb-4 init-hidden animate-fade-up delay-300" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="w-4 h-[1px] bg-red-accent" />
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Your Logs</span>
          </div>
          <Link to="/log/new"
            className="font-mono text-xs uppercase tracking-widest border border-indigo-accent text-indigo-accent hover:bg-indigo-accent hover:text-white px-4 py-1.5 transition-all">
            + Write Log
          </Link>
        </div>

        <div className="init-hidden animate-fade-up delay-400" style={{ animationFillMode: 'forwards' }}>
          {loading ? (
            <DashboardSkeleton />
          ) : logs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-px">
              {logs.map((log) => (
                <LogCard key={log._id} log={log} showActions onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}