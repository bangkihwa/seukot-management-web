export type Semester = '1-1' | '1-2' | '2-1' | '2-2' | '3-1' | '3-2'

export const SEMESTER_OPTIONS: { value: Semester; label: string }[] = [
  { value: '1-1', label: '1학년 1학기' },
  { value: '1-2', label: '1학년 2학기' },
  { value: '2-1', label: '2학년 1학기' },
  { value: '2-2', label: '2학년 2학기' },
  { value: '3-1', label: '3학년 1학기' },
  { value: '3-2', label: '3학년 2학기' },
]

export type AchievementLevel = 'A' | 'B' | 'C' | 'D' | 'E'

export const ACHIEVEMENT_LEVELS: AchievementLevel[] = ['A', 'B', 'C', 'D', 'E']

export type CompletionStatus = '미작성' | '작성중' | '검토요청' | '수정요청' | '완료'

export const COMPLETION_STATUSES: CompletionStatus[] = ['미작성', '작성중', '검토요청', '수정요청', '완료']

export const COMPLETION_STATUS_COLORS: Record<CompletionStatus, { bg: string; text: string; border: string }> = {
  '미작성': { bg: 'bg-slate-50/80', text: 'text-slate-500', border: 'border-slate-300' },
  '작성중': { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-400' },
  '검토요청': { bg: 'bg-sky-50/80', text: 'text-sky-700', border: 'border-sky-400' },
  '수정요청': { bg: 'bg-rose-50/80', text: 'text-rose-700', border: 'border-rose-400' },
  '완료': { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-400' },
}

export const ACHIEVEMENT_LEVEL_COLORS: Record<AchievementLevel, string> = {
  'A': 'bg-emerald-100 text-emerald-800',
  'B': 'bg-teal-100 text-teal-800',
  'C': 'bg-amber-100 text-amber-800',
  'D': 'bg-orange-100 text-orange-800',
  'E': 'bg-red-100 text-red-800',
}

export const INQUIRY_KEYWORD_PRESETS = [
  '탐구', '실험', '프로젝트', '발표', '보고서',
  '토론', '분석', '창의', '융합', '진로연계',
] as const

export interface SmSubjectRecord {
  id: string
  student_id: string
  semester: Semester
  subject_name: string
  achievement_level: AchievementLevel | null
  grade_rank: number | null
  raw_score: number | null
  subject_average: number | null
  seukot_attitude: string
  seukot_inquiry: string
  seukot_thinking: string
  seukot_career: string
  inquiry_keywords: string[]
  completion_status: CompletionStatus
  admin_feedback: string
  created_at: string
  updated_at: string
}

export interface SmStudent {
  id: string
  student_login_id: string
  name: string
  grade: string
  enrollment_year: number | null
  graduation_year: number | null
  high_school_name: string
  student_phone: string
  parent_phone: string
  consultant_name: string
  created_by: string
  is_active: boolean
  created_at: string
  updated_at: string
}
