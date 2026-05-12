import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function EditLog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', timeSpent: '', tags: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchLog() {
      try {
        const res = await api.get('/api/logs/me')
        const log = res.data.logs.find((l) => l._id === id)
        if (!log) { navigate('/dashboard'); return }
        setForm({
          title: log.title,
          content: log.content,
          timeSpent: log.timeSpent ?? '',
          tags: log.tags?.join(', ') ?? '',
        })
      } catch { navigate('/dashboard') }
      finally { setFetching(false) }
    }
    fetchLog()
  }, [id])

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

    try {
      await api.put(`/api/logs/${id}`, {
        title: form.title,
        content: form.content,
        tags,
        ...(form.timeSpent ? { timeSpent: parseInt(form.timeSpent, 10) } : {}),
      })
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        const fe = {}
        data.errors.forEach((e) => { fe[e.path] = e.msg })
        setErrors(fe)
      } else {
        setServerError(data?.error || 'Failed to update log.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-red-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      <div className="mb-10 init-hidden animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <p className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] mb-1">Editing Entry</p>
        <h1 className="font-display text-5xl tracking-wider text-white">
          UPDATE <span className="text-indigo-accent">LOG</span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 init-hidden animate-fade-up delay-100"
        style={{ animationFillMode: 'forwards' }}
      >
        <div>
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={`w-full bg-surface border ${errors.title ? 'border-red-accent' : 'border-border'} focus:border-indigo-accent text-white text-sm font-body px-4 py-3 outline-none transition-colors`}
          />
          {errors.title && <p className="font-mono text-xs text-red-accent mt-1">⚠ {errors.title}</p>}
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">What you learned</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={10}
            className={`w-full bg-surface border ${errors.content ? 'border-red-accent' : 'border-border'} focus:border-indigo-accent text-white text-sm font-body px-4 py-3 outline-none transition-colors resize-none leading-relaxed`}
          />
          {errors.content && <p className="font-mono text-xs text-red-accent mt-1">⚠ {errors.content}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Time (minutes)</label>
            <input
              name="timeSpent"
              type="number"
              min="0"
              value={form.timeSpent}
              onChange={handleChange}
              className="w-full bg-surface border border-border focus:border-indigo-accent text-white text-sm font-mono px-4 py-3 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Tags</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="react, css"
              className="w-full bg-surface border border-border focus:border-indigo-accent text-white text-sm font-mono px-4 py-3 outline-none transition-colors placeholder-zinc-700"
            />
          </div>
        </div>

        {serverError && (
          <div className="border border-red-dim bg-red-glow px-4 py-2">
            <p className="text-red-accent text-xs font-mono">⚠ {serverError}</p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-sm uppercase tracking-widest bg-indigo-accent hover:bg-indigo-dim disabled:opacity-50 text-white px-8 py-3 transition-all"
          >
            {loading ? 'Saving...' : 'Save Changes →'}
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