import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'username' ? value.toLowerCase() : value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setServerError('')
    try {
      const res = await api.post('/api/auth/register', form)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        const fe = {}
        data.errors.forEach((e) => { fe[e.path] = e.msg })
        setErrors(fe)
      } else {
        setServerError(data?.error || 'Registration failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-accent opacity-[0.03] blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative init-hidden animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <div className="border border-border bg-surface relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-accent" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-accent" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-accent" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-accent" />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-indigo-accent" />
              <div>
                <p className="font-mono text-xs text-indigo-accent uppercase tracking-[0.2em]">New Account</p>
                <h1 className="font-display text-3xl tracking-wider text-white">CREATE PROFILE</h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-zinc-600 text-sm">@</span>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    placeholder="yourname"
                    className={`w-full bg-[#0a0a0a] border ${errors.username ? 'border-red-accent' : 'border-border'} focus:border-indigo-accent text-white text-sm font-mono pl-8 pr-4 py-3 outline-none transition-colors placeholder-zinc-700`}
                  />
                </div>
                {errors.username && <p className="font-mono text-xs text-red-accent mt-1">⚠ {errors.username}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-red-accent' : 'border-border'} focus:border-indigo-accent text-white text-sm font-mono px-4 py-3 outline-none transition-colors placeholder-zinc-700`}
                />
                {errors.email && <p className="font-mono text-xs text-red-accent mt-1">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
                  Password <span className="text-zinc-700">(min 8 chars)</span>
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-[#0a0a0a] border ${errors.password ? 'border-red-accent' : 'border-border'} focus:border-indigo-accent text-white text-sm font-mono px-4 py-3 outline-none transition-colors placeholder-zinc-700`}
                />
                {errors.password && <p className="font-mono text-xs text-red-accent mt-1">⚠ {errors.password}</p>}
              </div>

              {serverError && (
                <div className="border border-red-dim bg-red-glow px-4 py-2">
                  <p className="text-red-accent text-xs font-mono">⚠ {serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-accent hover:bg-indigo-dim disabled:opacity-50 text-white font-mono text-sm uppercase tracking-widest py-3 transition-all mt-2"
              >
                {loading ? 'Creating...' : 'Create Account →'}
              </button>
            </form>

            <p className="text-center font-mono text-xs text-zinc-600 mt-6">
              Have an account?{' '}
              <Link to="/login" className="text-red-accent hover:text-white transition-colors">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}