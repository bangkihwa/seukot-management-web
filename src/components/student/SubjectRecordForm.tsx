import { useState, useEffect, FormEvent } from 'react'
import { SmSubjectRecord, SEMESTER_OPTIONS, ACHIEVEMENT_LEVELS, COMPLETION_STATUSES, INQUIRY_KEYWORD_PRESETS, Semester, AchievementLevel, CompletionStatus } from '../../types/database'
import TagInput from '../common/TagInput'

interface SubjectRecordFormProps {
  editTarget?: SmSubjectRecord | null
  onSave: (data: Omit<SmSubjectRecord, 'id' | 'student_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}

const emptyForm = {
  semester: '1-1' as Semester,
  subject_name: '',
  achievement_level: null as AchievementLevel | null,
  grade_rank: null as number | null,
  raw_score: null as number | null,
  subject_average: null as number | null,
  seukot_attitude: '',
  seukot_inquiry: '',
  seukot_thinking: '',
  seukot_career: '',
  inquiry_keywords: [] as string[],
  completion_status: '미작성' as CompletionStatus,
  admin_feedback: '',
}

export default function SubjectRecordForm({ editTarget, onSave, onCancel }: SubjectRecordFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editTarget) {
      setForm({
        semester: editTarget.semester,
        subject_name: editTarget.subject_name,
        achievement_level: editTarget.achievement_level,
        grade_rank: editTarget.grade_rank,
        raw_score: editTarget.raw_score,
        subject_average: editTarget.subject_average,
        seukot_attitude: editTarget.seukot_attitude,
        seukot_inquiry: editTarget.seukot_inquiry,
        seukot_thinking: editTarget.seukot_thinking,
        seukot_career: editTarget.seukot_career,
        inquiry_keywords: Array.isArray(editTarget.inquiry_keywords) ? editTarget.inquiry_keywords : [],
        completion_status: editTarget.completion_status,
        admin_feedback: editTarget.admin_feedback || '',
      })
    }
  }, [editTarget])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card-solid p-8 space-y-5 animate-scale-in">
      <h3 className="section-title">
        {editTarget ? '세특 기록 수정' : '새 과목 세특 추가'}
      </h3>

      {editTarget?.completion_status === '수정요청' && (
        <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/50">
          <p className="text-sm text-rose-700 font-medium">
            관리자가 수정을 요청했습니다. 내용을 수정한 후 "검토요청" 상태로 다시 제출해주세요.
          </p>
          {editTarget.admin_feedback && (
            <p className="text-sm text-rose-800 mt-1 whitespace-pre-wrap">{editTarget.admin_feedback}</p>
          )}
        </div>
      )}

      {/* Semester + Subject name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">학기</label>
          <select
            value={form.semester}
            onChange={e => setForm(f => ({ ...f, semester: e.target.value as Semester }))}
            className="input-field"
          >
            {SEMESTER_OPTIONS.map(sem => (
              <option key={sem.value} value={sem.value}>{sem.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">과목명</label>
          <input
            type="text"
            value={form.subject_name}
            onChange={e => setForm(f => ({ ...f, subject_name: e.target.value }))}
            required
            className="input-field"
            placeholder="예: 국어, 수학, 영어"
          />
        </div>
      </div>

      {/* Grades row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">성취도</label>
          <select
            value={form.achievement_level ?? ''}
            onChange={e => setForm(f => ({ ...f, achievement_level: (e.target.value || null) as AchievementLevel | null }))}
            className="input-field"
          >
            <option value="">미입력</option>
            {ACHIEVEMENT_LEVELS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">석차등급</label>
          <select
            value={form.grade_rank ?? ''}
            onChange={e => setForm(f => ({ ...f, grade_rank: e.target.value ? Number(e.target.value) : null }))}
            className="input-field"
          >
            <option value="">미입력</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => (
              <option key={r} value={r}>{r}등급</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">원점수</label>
          <input
            type="number"
            value={form.raw_score ?? ''}
            onChange={e => setForm(f => ({ ...f, raw_score: e.target.value ? Number(e.target.value) : null }))}
            min={0}
            max={100}
            className="input-field"
            placeholder="0~100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">과목평균</label>
          <input
            type="number"
            value={form.subject_average ?? ''}
            onChange={e => setForm(f => ({ ...f, subject_average: e.target.value ? Number(e.target.value) : null }))}
            min={0}
            max={100}
            step="0.1"
            className="input-field"
            placeholder="0~100"
          />
        </div>
      </div>

      {/* Seukot text fields */}
      {[
        { key: 'seukot_attitude', label: '학습태도', placeholder: '수업 태도, 학습 의욕, 성실성, 참여도 등' },
        { key: 'seukot_inquiry', label: '탐구 · 프로젝트', placeholder: '탐구활동, 프로젝트 참여, 보고서 작성 등' },
        { key: 'seukot_thinking', label: '사고력 · 문제해결', placeholder: '분석력, 비판적 사고, 창의적 문제해결 등' },
        { key: 'seukot_career', label: '진로연계', placeholder: '진로와 연결된 학습 태도, 관심 분야 탐색 등' },
      ].map(({ key, label, placeholder }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-slate-700">{label}</label>
            <span className={`text-xs ${
              (form[key as keyof typeof form] as string).length > 500
                ? 'text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full'
                : 'text-slate-400'
            }`}>
              {(form[key as keyof typeof form] as string).length} / 500자
            </span>
          </div>
          <textarea
            value={form[key as keyof typeof form] as string}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            rows={3}
            className="input-field resize-y"
            placeholder={placeholder}
          />
        </div>
      ))}

      {/* Inquiry keywords */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">탐구주제 키워드</label>
        <TagInput
          value={form.inquiry_keywords}
          onChange={keywords => setForm(f => ({ ...f, inquiry_keywords: keywords }))}
          maxTags={5}
          placeholder="키워드 입력 후 Enter"
          presets={INQUIRY_KEYWORD_PRESETS}
          color="teal"
        />
      </div>

      {/* Completion status */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">완성도</label>
        <div className="flex gap-2 flex-wrap">
          {COMPLETION_STATUSES.filter(s => s !== '수정요청').map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setForm(f => ({ ...f, completion_status: status }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                form.completion_status === status
                  ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary-student"
        >
          {saving ? '저장 중...' : editTarget ? '수정' : '추가'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost"
        >
          취소
        </button>
      </div>
    </form>
  )
}
