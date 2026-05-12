import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="border-b border-border bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top red line accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-accent via-indigo-accent to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="font-display text-2xl tracking-widest text-white hover:text-red-accent transition-colors"
        >
          DEV<span className="text-red-accent">LOG</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/log/new"
                className="hidden sm:flex items-center gap-2 text-xs font-mono border border-red-accent text-red-accent hover:bg-red-accent hover:text-white px-4 py-1.5 transition-all uppercase tracking-widest"
              >
                + New Log
              </Link>
              <Link
                to={`/u/${user?.username}`}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                @{user?.username}
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-mono text-zinc-600 hover:text-red-accent transition-colors uppercase tracking-wider"
              >
                Exit
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-xs font-mono border border-red-accent text-red-accent hover:bg-red-accent hover:text-white px-4 py-1.5 transition-all uppercase tracking-widest"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}