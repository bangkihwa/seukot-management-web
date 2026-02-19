import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SmStudent, SmSubjectRecord, COMPLETION_STATUS_COLORS, ACHIEVEMENT_LEVEL_COLORS, SEMESTER_OPTIONS, AchievementLevel, CompletionStatus } from '../../types/database'
import AdminRecordEditForm from '../../components/admin/AdminRecordEditForm'

export default function AdminStudentDetail() {
  const { studentId } = useParams<{ studentId: string }>()
  const [student, setStudent] = useState<SmStudent | null>(null)
  const [records, setRecords] = useState<SmSubjectRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 인터랙션 상태
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [feedbackId, setFeedbackId] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    if (!studentId) return
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const studentRes = await supabase
        .from('sm_students')
        .select('*')
        .eq('id', studentId)
        .maybeSingle()

      if (studentRes.error) {
        setError(studentRes.error.message)
        setLoading(false)
        return
      }
      if (!studentRes.data) {
        setError('학생 정보를 찾을 수 없습니다.')
        setLoading(false)
        return
      }

      setStudent(studentRes.data)

      const recRes = await supabase
        .from('sm_subject_records')
        .select('*')
        .eq('student_id', studentId)
        .order('semester')
        .order('subject_name')

      if (recRes.data) setRecords(recRes.data)
      setLoading(false)
    }
    fetchData()
  }, [studentId])

  // 수정보완요청 전송
  const handleRequestRevision = async (recordId: string) => {
    if (!feedbackText.trim()) return
    setSaving(true)
    const { error: err } = await supabase
      .from('sm_subject_records')
      .update({
        completion_status: '수정요청',
        admin_feedback: feedbackText.trim(),
      })
      .eq('id', recordId)

    if (err) {
      showToast(err.message, 'error')
    } else {
      showToast('수정보완요청을 전송했습니다.')
      setRecords(prev => prev.map(r =>
        r.id === recordId
          ? { ...r, completion_status: '수정요청' as CompletionStatus, admin_feedback: feedbackText.trim() }
          : r
      ))
      setFeedbackId(null)
      setFeedbackText('')
    }
    setSaving(false)
  }

  // 직접 수정 저장
  const handleDirectEdit = async (recordId: string, data: Partial<SmSubjectRecord>) => {
    setSaving(true)
    const { error: err } = await supabase
      .from('sm_subject_records')
      .update(data)
      .eq('id', recordId)

    if (err) {
      showToast(err.message, 'error')
    } else {
      showToast('기록이 수정되었습니다.')
      setRecords(prev => prev.map(r =>
        r.id === recordId ? { ...r, ...data } : r
      ))
      setEditingId(null)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-200 border-t-teal-600" />
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="text-center py-20">
        <Link to="/admin" className="text-sm text-teal-500 hover:text-teal-700 transition-colors mb-4 inline-block">
          &larr; 학생 목록으로
        </Link>
        <p className="text-red-500">{error || '학생 정보를 찾을 수 없습니다.'}</p>
      </div>
    )
  }

  // Group records by semester
  const grouped = SEMESTER_OPTIONS.map(sem => ({
    ...sem,
    records: records.filter(r => r.semester === sem.value),
  })).filter(g => g.records.length > 0)

  return (
    <div className="animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <Link to="/admin" className="text-sm text-teal-500 hover:text-teal-700 transition-colors inline-flex items-center gap-1 mb-4">
        &larr; 학생 목록으로
      </Link>

      {/* Student profile header */}
      <div className="glass-card-solid p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">{(student.name || '?')[0]}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{student.name || student.student_login_id}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-slate-500 font-mono">{student.student_login_id}</span>
              {student.grade && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  {student.grade}학년
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subject records by semester */}
      {grouped.length > 0 ? (
        grouped.map(group => (
          <section key={group.value} className="glass-card-solid p-6 mb-6">
            <h3 className="section-title mb-4">
              {group.label} ({group.records.length}과목)
            </h3>
            <div className="space-y-3">
              {group.records.map(rec => {
                const statusColors = COMPLETION_STATUS_COLORS[rec.completion_status as CompletionStatus]
                const isExpanded = expandedId === rec.id
                const isEditing = editingId === rec.id
                const isFeedback = feedbackId === rec.id
                const hasSeukot = rec.seukot_attitude || rec.seukot_inquiry || rec.seukot_thinking || rec.seukot_career

                return (
                  <div key={rec.id} className={`border-l-[3px] ${statusColors.border} pl-4 py-3 rounded-r-lg hover:bg-slate-50/50 transition-colors`}>
                    {/* 헤더 행 */}
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          if (!isEditing && !isFeedback) setExpandedId(isExpanded ? null : rec.id)
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-medium text-slate-800">{rec.subject_name}</span>
                          {rec.achievement_level && (
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${ACHIEVEMENT_LEVEL_COLORS[rec.achievement_level as AchievementLevel]}`}>
                              {rec.achievement_level}
                            </span>
                          )}
                          {rec.grade_rank && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                              {rec.grade_rank}등급
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors.bg} ${statusColors.text}`}>
                            {rec.completion_status}
                          </span>
                        </div>
                        {rec.raw_score !== null && (
                          <p className="text-sm text-slate-500">
                            원점수: {rec.raw_score} / 과목평균: {rec.subject_average ?? '-'}
                          </p>
                        )}
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-1 ml-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setFeedbackId(isFeedback ? null : rec.id)
                            setFeedbackText(rec.admin_feedback || '')
                            if (!isFeedback) setExpandedId(rec.id)
                          }}
                          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                            isFeedback
                              ? 'text-white bg-rose-500'
                              : 'text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          수정요청
                        </button>
                        <button
                          onClick={() => {
                            setFeedbackId(null)
                            setEditingId(isEditing ? null : rec.id)
                            if (!isEditing) setExpandedId(rec.id)
                          }}
                          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                            isEditing
                              ? 'text-white bg-teal-500'
                              : 'text-teal-600 hover:bg-teal-50'
                          }`}
                        >
                          직접 수정
                        </button>
                      </div>
                    </div>

                    {/* 수정보완요청 입력 */}
                    {isFeedback && (
                      <div className="mt-3 p-4 bg-rose-50/50 rounded-xl border border-rose-200/50 animate-fade-in">
                        <label className="block text-sm font-semibold text-rose-700 mb-1.5">수정보완 요청사항</label>
                        <textarea
                          value={feedbackText}
                          onChange={e => setFeedbackText(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-300 resize-y"
                          placeholder="학생에게 전달할 수정 요청사항을 입력하세요..."
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleRequestRevision(rec.id)}
                            disabled={saving || !feedbackText.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                          >
                            {saving ? '전송 중...' : '요청 전송'}
                          </button>
                          <button
                            onClick={() => { setFeedbackId(null); setFeedbackText('') }}
                            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 직접 수정 폼 */}
                    {isEditing && (
                      <AdminRecordEditForm
                        record={rec}
                        onSave={async (data) => handleDirectEdit(rec.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    )}

                    {/* 펼친 내용 (편집 모드가 아닐 때만) */}
                    {isExpanded && !isEditing && !isFeedback && (hasSeukot || rec.admin_feedback) && (
                      <div className="mt-4 pt-4 border-t border-slate-100/80 space-y-3 text-sm animate-fade-in">
                        {rec.seukot_attitude && (
                          <div><span className="font-medium text-slate-400">학습태도:</span> <span className="text-slate-700 whitespace-pre-wrap">{rec.seukot_attitude}</span></div>
                        )}
                        {rec.seukot_inquiry && (
                          <div><span className="font-medium text-slate-400">탐구:</span> <span className="text-slate-700 whitespace-pre-wrap">{rec.seukot_inquiry}</span></div>
                        )}
                        {rec.seukot_thinking && (
                          <div><span className="font-medium text-slate-400">사고력:</span> <span className="text-slate-700 whitespace-pre-wrap">{rec.seukot_thinking}</span></div>
                        )}
                        {rec.seukot_career && (
                          <div><span className="font-medium text-slate-400">진로연계:</span> <span className="text-slate-700 whitespace-pre-wrap">{rec.seukot_career}</span></div>
                        )}
                        {Array.isArray(rec.inquiry_keywords) && rec.inquiry_keywords.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {rec.inquiry_keywords.map((kw, i) => (
                              <span key={i} className="px-2 py-0.5 bg-teal-50/80 text-teal-700 border border-teal-200/50 rounded-full text-xs">{kw}</span>
                            ))}
                          </div>
                        )}
                        {rec.admin_feedback && (
                          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/50 mt-3">
                            <p className="text-xs font-bold text-rose-600 mb-1">관리자 피드백</p>
                            <p className="text-sm text-rose-800 whitespace-pre-wrap">{rec.admin_feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))
      ) : (
        <div className="glass-card-solid p-6">
          <p className="text-slate-400 text-center">등록된 세특 기록이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
