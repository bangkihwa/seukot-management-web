import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStudentSession } from '../../contexts/StudentSessionContext'

export default function StudentLoginPage() {
  const [loginId, setLoginId] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useStudentSession()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginId.toLowerCase(), name.trim())
      navigate('/student')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-page bg-mesh-landing flex items-center justify-center p-4">
      <div className="decorative-orb w-72 h-72 bg-cyan-400 -top-20 -left-20" />
      <div className="decorative-orb w-64 h-64 bg-teal-400/20 bottom-[20%] -right-10" />

      <div className="relative z-10 max-w-sm w-full animate-scale-in">
        <div className="h-1 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 rounded-t-2xl" />
        <div className="glass-card-solid p-8 !rounded-t-none">
          <Link to="/" className="text-sm text-slate-400 hover:text-teal-600 transition-colors inline-flex items-center gap-1 mb-6">
            &larr; 돌아가기
          </Link>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">학생 로그인</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">학생 아이디</label>
              <input
                type="text"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                required
                className="input-field"
                placeholder="예: h01001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">이름</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="input-field"
                placeholder="홍길동"
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
              className="btn-primary-student w-full mt-2"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-6 text-center tracking-wide">
            아이디는 담당 컨설턴트에게 문의하세요.
          </p>
        </div>
      </div>
    </div>
  )
}
