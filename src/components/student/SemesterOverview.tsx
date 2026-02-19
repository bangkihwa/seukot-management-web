import { SmSubjectRecord, SEMESTER_OPTIONS, COMPLETION_STATUS_COLORS, ACHIEVEMENT_LEVEL_COLORS, Semester, AchievementLevel, CompletionStatus } from '../../types/database'

interface SemesterOverviewProps {
  records: SmSubjectRecord[]
}

interface SemesterData {
  value: Semester
  label: string
  records: SmSubjectRecord[]
  completedCount: number
  completionRate: number
  topKeywords: [string, number][]
  avgAchievement: number | null
}

export default function SemesterOverview({ records }: SemesterOverviewProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        등록된 세특 기록이 없습니다.
      </div>
    )
  }

  const semesters: SemesterData[] = []

  for (const sem of SEMESTER_OPTIONS) {
    const semRecords = records.filter(r => r.semester === sem.value)
    if (semRecords.length === 0) continue

    const completedCount = semRecords.filter(r => r.completion_status === '완료').length
    const completionRate = Math.round((completedCount / semRecords.length) * 100)

    const allKeywords = semRecords.flatMap(r =>
      Array.isArray(r.inquiry_keywords) ? r.inquiry_keywords : []
    )
    const keywordCounts: Record<string, number> = {}
    for (const kw of allKeywords) {
      keywordCounts[kw] = (keywordCounts[kw] || 0) + 1
    }
    const topKeywords: [string, number][] = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    const achievementValues: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 }
    const gradedRecords = semRecords.filter(r => r.achievement_level)
    const avgAchievement = gradedRecords.length > 0
      ? gradedRecords.reduce((sum, r) => sum + (achievementValues[r.achievement_level!] || 0), 0) / gradedRecords.length
      : null

    semesters.push({
      value: sem.value,
      label: sem.label,
      records: semRecords,
      completedCount,
      completionRate,
      topKeywords,
      avgAchievement,
    })
  }

  return (
    <div className="space-y-6">
      {semesters.map(sem => (
        <div key={sem.value} className="glass-card-solid p-6">
          <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {sem.value.replace('-', '.')}
            </span>
            {sem.label}
          </h4>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="glass-card p-3 text-center">
              <p className="text-2xl font-bold text-teal-700">{sem.records.length}</p>
              <p className="text-xs text-slate-500">과목 수</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-2xl font-bold text-teal-700">
                {sem.avgAchievement !== null ? ['', 'E', 'D', 'C', 'B', 'A'][Math.round(sem.avgAchievement)] || '-' : '-'}
              </p>
              <p className="text-xs text-slate-500">평균 성취도</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-2xl font-bold text-teal-700">{sem.completionRate}%</p>
              <p className="text-xs text-slate-500">세특 완성률</p>
            </div>
          </div>

          {/* Completion bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>완성 진행도</span>
              <span>{sem.completedCount} / {sem.records.length} 과목</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${sem.completionRate}%` }}
              />
            </div>
          </div>

          {/* Subject status chips */}
          <div className="flex gap-2 flex-wrap mb-4">
            {sem.records.map(rec => {
              const sc = COMPLETION_STATUS_COLORS[rec.completion_status as CompletionStatus]
              return (
                <span key={rec.id} className={`px-3 py-1.5 rounded-xl text-sm border transition-all duration-200 ${sc.bg} ${sc.text} ${sc.border}`}>
                  {rec.subject_name}
                  {rec.achievement_level && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs font-medium ${ACHIEVEMENT_LEVEL_COLORS[rec.achievement_level as AchievementLevel]}`}>
                      {rec.achievement_level}
                    </span>
                  )}
                </span>
              )
            })}
          </div>

          {/* Keyword cloud */}
          {sem.topKeywords.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">탐구 키워드</p>
              <div className="flex gap-1.5 flex-wrap">
                {sem.topKeywords.map(([kw, count]) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-teal-50/80 text-teal-700 border border-teal-200/30 rounded-full text-xs"
                  >
                    {kw} {count > 1 && <span className="text-teal-400">x{count}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
