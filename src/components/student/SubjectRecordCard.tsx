import { useState } from 'react'
import { SmSubjectRecord, COMPLETION_STATUS_COLORS, ACHIEVEMENT_LEVEL_COLORS, SEMESTER_OPTIONS, AchievementLevel, CompletionStatus } from '../../types/database'

interface SubjectRecordCardProps {
  record: SmSubjectRecord
  onEdit: (record: SmSubjectRecord) => void
  onDelete: (id: string) => void
}

export default function SubjectRecordCard({ record, onEdit, onDelete }: SubjectRecordCardProps) {
  const [expanded, setExpanded] = useState(record.completion_status === '수정요청')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const statusColors = COMPLETION_STATUS_COLORS[record.completion_status as CompletionStatus]
  const semesterLabel = SEMESTER_OPTIONS.find(s => s.value === record.semester)?.label ?? record.semester

  const hasSeukot = record.seukot_attitude || record.seukot_inquiry || record.seukot_thinking || record.seukot_career

  return (
    <div className={`border-l-[3px] ${statusColors.border} glass-card-solid p-5 hover:shadow-card-hover transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">{semesterLabel}</span>
            {record.achievement_level && (
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${ACHIEVEMENT_LEVEL_COLORS[record.achievement_level as AchievementLevel]}`}>
                {record.achievement_level}
              </span>
            )}
            {record.grade_rank && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">
                {record.grade_rank}등급
              </span>
            )}
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors.bg} ${statusColors.text}`}>
              {record.completion_status}
            </span>
          </div>
          <h4 className="font-medium text-slate-800">{record.subject_name}</h4>
          {record.raw_score !== null && (
            <p className="text-xs text-slate-400 mt-0.5">
              원점수: {record.raw_score} / 과목평균: {record.subject_average ?? '-'}
            </p>
          )}
        </div>
        <div className="flex gap-1 ml-2 shrink-0">
          <button
            onClick={() => onEdit(record)}
            className="px-3 py-1.5 text-xs text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors"
          >
            수정
          </button>
          {deleteConfirm ? (
            <button
              onClick={() => { onDelete(record.id); setDeleteConfirm(false) }}
              className="px-3 py-1.5 text-xs text-white bg-red-500 rounded-lg font-medium"
            >
              확인
            </button>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {expanded && (hasSeukot || record.admin_feedback) && (
        <div className="mt-4 pt-4 border-t border-slate-100/80 space-y-3 text-sm animate-fade-in">
          {record.admin_feedback && record.completion_status === '수정요청' && (
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/50">
              <p className="text-xs font-bold text-rose-600 mb-1">관리자 수정요청</p>
              <p className="text-sm text-rose-800 whitespace-pre-wrap">{record.admin_feedback}</p>
            </div>
          )}
          {record.seukot_attitude && (
            <div><span className="font-medium text-slate-400">학습태도:</span> <span className="text-slate-700 whitespace-pre-wrap">{record.seukot_attitude}</span></div>
          )}
          {record.seukot_inquiry && (
            <div><span className="font-medium text-slate-400">탐구/프로젝트:</span> <span className="text-slate-700 whitespace-pre-wrap">{record.seukot_inquiry}</span></div>
          )}
          {record.seukot_thinking && (
            <div><span className="font-medium text-slate-400">사고력/문제해결:</span> <span className="text-slate-700 whitespace-pre-wrap">{record.seukot_thinking}</span></div>
          )}
          {record.seukot_career && (
            <div><span className="font-medium text-slate-400">진로연계:</span> <span className="text-slate-700 whitespace-pre-wrap">{record.seukot_career}</span></div>
          )}
          {Array.isArray(record.inquiry_keywords) && record.inquiry_keywords.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {record.inquiry_keywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-teal-50/80 text-teal-600 border border-teal-200/30 rounded-full text-xs">{kw}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
