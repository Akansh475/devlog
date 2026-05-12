import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function NewLog() {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [form, setForm] = useState({ title: '', content: '', timeSpent: '', tags: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setServerError('')

    const tags = form.tags
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const payload = {
      title: form.title,
      content: form.content,
      tags,
      ...(form.timeSpent ? { timeSpent: parseInt(form.timeSpent, 10) } : {}),
    }

    try {
      const res = await api.post('/api/logs', payload)
      updateUser({
        currentStreak: res.data.user.currentStreak,
        longestStreak: res.data.user.longestStreak,
        xpPoints: res.data.user.xpPoints,
      })
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        const fe = {}
        data.errors.forEach((e) => { fe[e.path] = e.msg })
        setErrors(fe)
      } else {
        setServerError(data?.error || 'Failed to create log.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-10 init-hidden animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <p className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] mb-1">New Entry</p>
        <h1 className="font-display text-5xl tracking-wider text-white">
          WHAT DID YOU <span className="text-red-accent">LEARN?</span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 init-hidden animate-fade-up delay-100"
        style={{ animationFillMode: 'forwards' }}
      >
        {/* Title */}
        <div>
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
            Title <span className="text-zinc-700">(max 100 chars)</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g. Finally understood React useEffect"
            className={`w-full bg-surface border ${errors.title ? 'border-red-accent' : 'border-border'} focus:border-red-accent text-white text-sm font-body px-4 py-3 outline-none transition-colors placeholder-zinc-700`}
          />
          {errors.title && <p className="font-mono text-xs text-red-accent mt-1">⚠ {errors.title}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
            What you learned
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={10}
            placeholder="Write freely — concepts, what you built, what confused you, links, code snippets..."
            className={`w-full bg-surface border ${errors.content ? 'border-red-accent' : 'border-border'} focus:border-red-accent text-white text-sm font-body px-4 py-3 outline-none transition-colors resize-none leading-relaxed placeholder-zinc-700`}
          />
          {errors.content && <p className="font-mono text-xs text-red-accent mt-1">⚠ {errors.content}</p>}
        </div>

        {/* Time + Tags */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
              Time spent <span className="text-zinc-700">(minutes)</span>
            </label>
            <input
              name="timeSpent"
              type="number"
              min="0"
              value={form.timeSpent}
              onChange={handleChange}
              placeholder="90"
              className="w-full bg-surface border border-border focus:border-indigo-accent text-white text-sm font-mono px-4 py-3 outline-none transition-colors placeholder-zinc-700"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
              Tags <span className="text-zinc-700">(comma separated)</span>
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="react, hooks, css"
              className="w-full bg-surface border border-border focus:border-indigo-accent text-white text-sm font-mono px-4 py-3 outline-none transition-colors placeholder-zinc-700"
            />
          </div>
        </div>

        {serverError && (
          <div className="border border-red-dim bg-red-glow px-4 py-2">
            <p className="text-red-accent text-xs font-mono">⚠ {serverError}</p>
          </div>
        )}

        {/* XP reminder */}
        <div className="flex items-center gap-3 border border-indigo-dim/40 bg-indigo-glow px-4 py-3">
          <span className="text-indigo-accent text-sm">⚡</span>
          <p className="font-mono text-xs text-indigo-accent uppercase tracking-widest">
            +10 XP for posting · +5 bonus XP on 7-day streaks
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-sm uppercase tracking-widest bg-red-accent hover:bg-red-dim disabled:opacity-50 text-white px-8 py-3 transition-all"
          >
            {loading ? 'Saving...' : 'Save Log →'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="font-mono text-xs uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}