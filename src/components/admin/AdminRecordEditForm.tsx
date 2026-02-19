import { useState, FormEvent } from 'react'
import { SmSubjectRecord, ACHIEVEMENT_LEVELS, COMPLETION_STATUSES, INQUIRY_KEYWORD_PRESETS, AchievementLevel, CompletionStatus } from '../../types/database'
import TagInput from '../common/TagInput'

interface AdminRecordEditFormProps {
  record: SmSubjectRecord
  onSave: (data: Partial<SmSubjectRecord>) => Promise<void>
  onCancel: () => void
}

export default function AdminRecordEditForm({ record, onSave, onCancel }: AdminRecordEditFormProps) {
  const [form, setForm] = useState({
    achievement_level: record.achievement_level,
    grade_rank: record.grade_rank,
    raw_score: record.raw_score,
    subject_average: record.subject_average,
    seukot_attitude: record.seukot_attitude,
    seukot_inquiry: record.seukot_inquiry,
    seukot_thinking: record.seukot_thinking,
    seukot_career: record.seukot_career,
    inquiry_keywords: Array.isArray(record.inquiry_keywords) ? record.inquiry_keywords : [],
    completion_status: record.completion_status as CompletionStatus,
  })
  const [saving, setSaving] = useState(false)

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
    <form onSubmit={handleSubmit} className="mt-4 p-5 bg-white/80 rounded-xl border border-teal-200/50 space-y-4 animate-fade-in">
      {/* 성적 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">성취도</label>
          <select
            value={form.achievement_level ?? ''}
            onChange={e => setForm(f => ({ ...f, achievement_level: (e.target.value || null) as AchievementLevel | null }))}
            className="input-field !py-1.5 text-sm"
          >
            <option value="">미입력</option>
            {ACHIEVEMENT_LEVELS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">석차등급</label>
          <select
            value={form.grade_rank ?? ''}
            onChange={e => setForm(f => ({ ...f, grade_rank: e.target.value ? Number(e.target.value) : null }))}
            className="input-field !py-1.5 text-sm"
          >
            <option value="">미입력</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => (
              <option key={r} value={r}>{r}등급</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">원점수</label>
          <input
            type="number"
            value={form.raw_score ?? ''}
            onChange={e => setForm(f => ({ ...f, raw_score: e.target.value ? Number(e.target.value) : null }))}
            min={0} max={100}
            className="input-field !py-1.5 text-sm"
            placeholder="0~100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">과목평균</label>
          <input
            type="number"
            value={form.subject_average ?? ''}
            onChange={e => setForm(f => ({ ...f, subject_average: e.target.value ? Number(e.target.value) : null }))}
            min={0} max={100} step="0.1"
            className="input-field !py-1.5 text-sm"
            placeholder="0~100"
          />
        </div>
      </div>

      {/* 세특 4영역 */}
      {[
        { key: 'seukot_attitude', label: '학습태도' },
        { key: 'seukot_inquiry', label: '탐구 / 프로젝트' },
        { key: 'seukot_thinking', label: '사고력 / 문제해결' },
        { key: 'seukot_career', label: '진로연계' },
      ].map(({ key, label }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-600">{label}</label>
            <span className={`text-xs ${
              (form[key as keyof typeof form] as string).length > 500
                ? 'text-red-500 font-semibold'
                : 'text-slate-400'
            }`}>
              {(form[key as keyof typeof form] as string).length}/500
            </span>
          </div>
          <textarea
            value={form[key as keyof typeof form] as string}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            rows={3}
            className="input-field resize-y text-sm"
          />
        </div>
      ))}

      {/* 키워드 */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">탐구주제 키워드</label>
        <TagInput
          value={form.inquiry_keywords}
          onChange={keywords => setForm(f => ({ ...f, inquiry_keywords: keywords }))}
          maxTags={5}
          placeholder="키워드 입력 후 Enter"
          presets={INQUIRY_KEYWORD_PRESETS}
          color="teal"
        />
      </div>

      {/* 완성도 */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">완성도</label>
        <div className="flex gap-2 flex-wrap">
          {COMPLETION_STATUSES.map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setForm(f => ({ ...f, completion_status: status }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all duration-200 ${
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

      {/* 버튼 */}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}
