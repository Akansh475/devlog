import { Link } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '▸', label: 'STREAK ENGINE', desc: 'Log daily. Build an unbreakable chain. Miss a day? Burn 50 XP to revive it.' },
  { icon: '▸', label: 'XP SYSTEM', desc: 'Earn XP for every entry. Hit 7-day milestones for bonus rewards.' },
  { icon: '▸', label: 'PUBLIC PROFILE', desc: 'Your entire learning history, live at devlog.app/u/you.' },
]

export default function Landing() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-8 max-w-6xl mx-auto">

        {/* Background grid lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(229,17,17,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(229,17,17,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top-right red triangle */}
        <div className="absolute top-0 right-0 w-0 h-0
          border-l-[200px] border-l-transparent
          border-t-[200px] border-t-red-accent
          opacity-80" />

        {/* Glowing orb */}
        <div className="absolute top-20 right-32 w-64 h-64 rounded-full bg-red-accent opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-indigo-accent opacity-5 blur-3xl pointer-events-none" />

        {/* Status badge */}
        <div className="init-hidden animate-fade-in delay-100 flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-accent animate-pulse" />
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-[0.2em]">
            System Online — Dev Journal v2.0
          </span>
        </div>

        {/* Main headline */}
        <div className="init-hidden animate-fade-up delay-200">
          <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-none tracking-wider text-white">
            CODE.
          </h1>
          <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-none tracking-wider text-red-accent animate-flicker">
            LEARN.
          </h1>
          <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-none tracking-wider text-white">
            REPEAT.
          </h1>
        </div>

        {/* Sub */}
        <p className="init-hidden animate-fade-up delay-300 mt-8 text-zinc-400 text-base max-w-md leading-relaxed font-body">
          A public learning journal for developers. Log what you learn, grow your streak,
          share your growth — one entry at a time.
        </p>

        {/* CTAs */}
        <div className="init-hidden animate-fade-up delay-400 mt-10 flex flex-wrap gap-4">
          <Link
            to="/register"
            className="font-mono text-sm uppercase tracking-widest bg-red-accent hover:bg-red-dim text-white px-8 py-3 transition-all glow-red"
          >
            Start Now →
          </Link>
          <Link
            to="/login"
            className="font-mono text-sm uppercase tracking-widest border border-border text-zinc-400 hover:border-white hover:text-white px-8 py-3 transition-all"
          >
            Login
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="init-hidden animate-fade-in delay-600 absolute bottom-8 left-4 sm:left-8 flex items-center gap-3">
          <div className="w-8 h-[1px] bg-red-accent" />
          <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border stripe-bg py-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-[1px] bg-red-accent" />
            <span className="font-mono text-xs text-red-accent uppercase tracking-[0.3em]">
              Core Features
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border">
            {features.map((f) => (
              <div key={f.label} className="bg-[#0a0a0a] p-8 relative corner-accent group hover:bg-surface transition-colors">
                <span className="font-mono text-red-accent text-xl mb-4 block">{f.icon}</span>
                <h3 className="font-display text-xl tracking-widest text-white mb-3 group-hover:text-red-accent transition-colors">
                  {f.label}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 px-4 text-center border-t border-border">
        <p className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] mb-4">
          Ready to start?
        </p>
        <h2 className="font-display text-5xl sm:text-7xl text-white tracking-wider mb-8">
          BUILD IN <span className="text-red-accent">PUBLIC</span>
        </h2>
        <Link
          to="/register"
          className="inline-block font-mono text-sm uppercase tracking-widest bg-red-accent hover:bg-red-dim text-white px-10 py-4 transition-all glow-red"
        >
          Create Free Account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display text-lg tracking-widest text-zinc-700">
            DEV<span className="text-red-accent">LOG</span>
          </span>
          <span className="font-mono text-xs text-zinc-700">Built for builders.</span>
        </div>
      </footer>
    </div>
  )
}