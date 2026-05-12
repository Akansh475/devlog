import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', form)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16 relative">

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(229,17,17,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(229,17,17,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-accent opacity-[0.03] blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative init-hidden animate-fade-up" style={{ animationFillMode: 'forwards' }}>

        {/* Panel */}
        <div className="border border-border bg-surface relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-accent" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-accent" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-accent" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-accent" />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-red-accent" />
              <div>
                <p className="font-mono text-xs text-red-accent uppercase tracking-[0.2em]">
                  Auth Required
                </p>
                <h1 className="font-display text-3xl tracking-wider text-white">WELCOME BACK</h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-[#0a0a0a] border border-border focus:border-red-accent text-white text-sm font-mono px-4 py-3 outline-none transition-colors placeholder-zinc-700"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a] border border-border focus:border-red-accent text-white text-sm font-mono px-4 py-3 outline-none transition-colors placeholder-zinc-700"
                />
              </div>

              {error && (
                <div className="border border-red-dim bg-red-glow px-4 py-2">
                  <p className="text-red-accent text-xs font-mono">⚠ {error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-accent hover:bg-red-dim disabled:opacity-50 text-white font-mono text-sm uppercase tracking-widest py-3 transition-all mt-2"
              >
                {loading ? 'Authenticating...' : 'Login →'}
              </button>
            </form>

            <p className="text-center font-mono text-xs text-zinc-600 mt-6">
              No account?{' '}
              <Link to="/register" className="text-indigo-accent hover:text-white transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}