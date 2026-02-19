import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-page bg-mesh-landing flex items-center justify-center p-4">
      {/* Decorative floating orbs */}
      <div className="decorative-orb w-72 h-72 bg-teal-400 -top-20 -left-20" />
      <div className="decorative-orb w-96 h-96 bg-cyan-400 -bottom-32 -right-32" />
      <div className="decorative-orb w-64 h-64 bg-copper-400/20 bottom-[10%] left-[40%]" />

      <div className="relative z-10 text-center max-w-md w-full animate-fade-in-up">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-teal-600 via-copper-500 to-teal-600 rounded-t-2xl" />

        <div className="glass-card-solid p-10 !rounded-t-none">
          {/* Emblem */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center shadow-lg">
            <span className="text-copper-400 font-black text-xl">SR</span>
          </div>

          <h1 className="text-3xl font-black bg-gradient-to-r from-teal-800 to-teal-600 bg-clip-text text-transparent mb-2">
            세특 관리 시스템
          </h1>
          <p className="text-slate-500 text-sm tracking-wide mb-8">
            교과 세부능력 및 특기사항 기록 · 학기별 관리
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/student/login"
              className="btn-primary-student w-full text-center block"
            >
              로그인
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-8 tracking-wide">
            학생 아이디는 담당 컨설턴트에게 문의하세요.
          </p>
        </div>
      </div>
    </div>
  )
}
