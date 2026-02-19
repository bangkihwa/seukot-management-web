import { useState } from 'react'
import { SmSubjectRecord, SEMESTER_OPTIONS, COMPLETION_STATUSES, Semester, CompletionStatus } from '../../types/database'
import SubjectRecordCard from './SubjectRecordCard'
import SubjectRecordForm from './SubjectRecordForm'
import { useToast } from '../common/Toast'

interface SubjectRecordListProps {
  records: SmSubjectRecord[]
  loading: boolean
  onAdd: (data: Omit<SmSubjectRecord, 'id' | 'student_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onUpdate: (id: string, data: Partial<Omit<SmSubjectRecord, 'id' | 'student_id' | 'created_at' | 'updated_at'>>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function SubjectRecordList({ records, loading, onAdd, onUpdate, onDelete }: SubjectRecordListProps) {
  const [filterSemester, setFilterSemester] = useState<Semester | null>(null)
  const [filterStatus, setFilterStatus] = useState<CompletionStatus | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<SmSubjectRecord | null>(null)
  const { showToast } = useToast()

  const filtered = records
    .filter(r => !filterSemester || r.semester === filterSemester)
    .filter(r => !filterStatus || r.completion_status === filterStatus)

  const handleSave = async (data: Omit<SmSubjectRecord, 'id' | 'student_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editTarget) {
        await onUpdate(editTarget.id, data)
        showToast('세특 기록이 수정되었습니다.')
      } else {
        await onAdd(data)
        showToast('세특 기록이 추가되었습니다.')
      }
      setShowForm(false)
      setEditTarget(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : '저장 실패', 'error')
    }
  }

  const handleEdit = (record: SmSubjectRecord) => {
    setEditTarget(record)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id)
      showToast('세특 기록이 삭제되었습니다.')
    } catch (err) {
      showToast(err instanceof Error ? err.message : '삭제 실패', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-200 border-t-teal-600" />
      </div>
    )
  }

  return (
    <div>
      {/* Semester filter */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          onClick={() => setFilterSemester(null)}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            filterSemester === null
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/20'
              : 'bg-white/60 backdrop-blur-sm text-slate-600 border border-slate-200/50 hover:bg-white/80 hover:border-teal-300'
          }`}
        >
          전체 ({records.length})
        </button>
        {SEMESTER_OPTIONS.map(sem => {
          const count = records.filter(r => r.semester === sem.value).length
          return (
            <button
              key={sem.value}
              onClick={() => setFilterSemester(sem.value)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                filterSemester === sem.value
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/20'
                  : 'bg-white/60 backdrop-blur-sm text-slate-600 border border-slate-200/50 hover:bg-white/80 hover:border-teal-300'
              }`}
            >
              {sem.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setFilterStatus(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
            filterStatus === null
              ? 'bg-slate-700 text-white'
              : 'bg-white/60 text-slate-500 border border-slate-200/50 hover:bg-white/80'
          }`}
        >
          상태: 전체
        </button>
        {COMPLETION_STATUSES.map(status => {
          const count = records
            .filter(r => !filterSemester || r.semester === filterSemester)
            .filter(r => r.completion_status === status).length
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-slate-700 text-white'
                  : 'bg-white/60 text-slate-500 border border-slate-200/50 hover:bg-white/80'
              }`}
            >
              {status} ({count})
            </button>
          )
        })}
      </div>

      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => { setEditTarget(null); setShowForm(true) }}
          className="w-full py-4 border-2 border-dashed border-teal-300/50 text-teal-500 rounded-2xl hover:border-teal-400 hover:bg-teal-50/30 hover:text-teal-600 transition-all duration-200 mb-4 font-semibold text-sm"
        >
          + 새 과목 세특 추가
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-4">
          <SubjectRecordForm
            editTarget={editTarget}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditTarget(null) }}
          />
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.map(record => (
          <SubjectRecordCard
            key={record.id}
            record={record}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        {filtered.length === 0 && !showForm && (
          <p className="text-center text-slate-400 py-8">
            {filterSemester || filterStatus ? '조건에 맞는 기록이 없습니다.' : '등록된 세특 기록이 없습니다. 위 버튼을 눌러 추가해보세요.'}
          </p>
        )}
      </div>
    </div>
  )
}
