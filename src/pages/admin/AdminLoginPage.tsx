import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-page bg-mesh-landing flex items-center justify-center p-4">
      <div className="decorative-orb w-72 h-72 bg-teal-400 -top-20 -right-20" />
      <div className="decorative-orb w-64 h-64 bg-copper-400/20 bottom-[20%] -left-10" />

      <div className="relative z-10 max-w-sm w-full animate-scale-in">
        <div className="h-1 bg-gradient-to-r from-teal-700 via-copper-500 to-teal-700 rounded-t-2xl" />
        <div className="glass-card-solid p-8 !rounded-t-none">
          <Link to="/" className="text-sm text-slate-400 hover:text-teal-600 transition-colors inline-flex items-center gap-1 mb-6">
            &larr; 돌아가기
          </Link>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-teal-900 bg-clip-text text-transparent mb-6">관리자 로그인</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-field-admin"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input-field-admin"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-admin w-full mt-2"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
