import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NewLog from './pages/NewLog'
import EditLog from './pages/EditLog'

import PublicProfile from "./pages/PublicProfile";




export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/u/:username" element={<PublicProfile />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/log/new" element={<ProtectedRoute><NewLog /></ProtectedRoute>} />
        <Route path="/log/edit/:id" element={<ProtectedRoute><EditLog /></ProtectedRoute>} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <p className="font-display text-9xl text-red-accent">404</p>
            <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mt-4">Page not found</p>
          </div>
        } />
      </Routes>
    </div>
  )
}