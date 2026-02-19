import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-page">
      <header className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 border-b border-teal-700/50 shadow-nav sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-xs font-black text-teal-900">SR</span>
              세특 관리
            </Link>
            <nav className="flex gap-4">
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/admin' ? 'text-copper-400' : 'text-teal-200/70 hover:text-white'
                }`}
              >
                학생 목록
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-teal-300">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-sm text-teal-300/70 hover:text-white transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
