import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { SmStudent } from '../../types/database'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState<SmStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return
    const fetchStudents = async () => {
      const { data } = await supabase
        .from('sm_students')
        .select('*')
        .order('created_at', { ascending: false })
      setStudents(data || [])
      setLoading(false)
    }
    fetchStudents()
  }, [user])

  const filtered = students.filter(s =>
    s.name.includes(search) ||
    s.student_login_id.includes(search) ||
    s.high_school_name.includes(search)
  )

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-200 border-t-teal-600" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">학생 목록</h2>
          <p className="text-sm text-slate-500 mt-1">등록된 학생을 관리하고 세특 기록을 확인합니다</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-teal-700">{students.length}</span>
          <span className="text-sm text-slate-500">명</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="이름, 아이디, 학교 검색..."
            className="input-field-admin !pl-10"
          />
        </div>
      </div>

      <div className="glass-card-solid overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-teal-50/50 border-b border-teal-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-teal-600 uppercase tracking-wider">아이디</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-teal-600 uppercase tracking-wider">이름</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-teal-600 uppercase tracking-wider hidden md:table-cell">학년</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-teal-600 uppercase tracking-wider hidden md:table-cell">학교</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-teal-600 uppercase tracking-wider">상태</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-teal-600 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {filtered.map(student => (
              <tr key={student.id} className="hover:bg-teal-50/40 transition-colors duration-150">
                <td className="px-4 py-3 font-mono text-slate-600">{student.student_login_id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{student.name || '-'}</td>
                <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{student.grade ? `${student.grade}학년` : '-'}</td>
                <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{student.high_school_name || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    student.is_active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                      : 'bg-slate-50 text-slate-500 border border-slate-200/50'
                  }`}>
                    {student.is_active ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/students/${student.id}`}
                    className="text-teal-600 hover:text-copper-600 text-sm font-semibold transition-colors"
                  >
                    상세
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  {search ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
