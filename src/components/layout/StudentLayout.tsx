import { Outlet } from 'react-router-dom'
import { useStudentSession } from '../../contexts/StudentSessionContext'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function StudentLayout() {
  const { sessionToken, logout } = useStudentSession()
  const [name, setName] = useState('')

  useEffect(() => {
    if (!sessionToken) return
    supabase.rpc('sm_get_my_profile', { p_session_token: sessionToken })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setName(data[0].name || data[0].student_login_id)
        }
      })
  }, [sessionToken])

  return (
    <div className="min-h-screen bg-gradient-page">
      <header className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 border-b border-teal-600/30 shadow-nav sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-xs font-black text-teal-900">SR</span>
            세특 기록 입력
          </span>
          <div className="flex items-center gap-3">
            {name && <span className="text-sm text-teal-200">{name}</span>}
            <button
              onClick={logout}
              className="text-sm text-teal-300/70 hover:text-white transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
