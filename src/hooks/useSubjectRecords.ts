import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useStudentSession } from '../contexts/StudentSessionContext'
import { SmSubjectRecord, Semester } from '../types/database'

export function useSubjectRecords(filterSemester?: Semester | null) {
  const { sessionToken } = useStudentSession()
  const [records, setRecords] = useState<SmSubjectRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = useCallback(async () => {
    if (!sessionToken) return
    setLoading(true)
    const { data, error: err } = await supabase.rpc('sm_get_my_subject_records', {
      p_session_token: sessionToken,
      p_semester: filterSemester ?? null,
    })
    if (err) {
      setError(err.message)
    } else {
      setRecords(data || [])
      setError(null)
    }
    setLoading(false)
  }, [sessionToken, filterSemester])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const addRecord = async (payload: Omit<SmSubjectRecord, 'id' | 'student_id' | 'created_at' | 'updated_at'>) => {
    if (!sessionToken) throw new Error('세션이 만료되었습니다.')
    const { error: err } = await supabase.rpc('sm_add_my_subject_record', {
      p_session_token: sessionToken,
      p_semester: payload.semester,
      p_subject_name: payload.subject_name,
      p_achievement_level: payload.achievement_level,
      p_grade_rank: payload.grade_rank,
      p_raw_score: payload.raw_score,
      p_subject_average: payload.subject_average,
      p_seukot_attitude: payload.seukot_attitude,
      p_seukot_inquiry: payload.seukot_inquiry,
      p_seukot_thinking: payload.seukot_thinking,
      p_seukot_career: payload.seukot_career,
      p_inquiry_keywords: payload.inquiry_keywords,
      p_completion_status: payload.completion_status,
    })
    if (err) throw new Error(err.message)
    await fetchRecords()
  }

  const updateRecord = async (id: string, payload: Partial<Omit<SmSubjectRecord, 'id' | 'student_id' | 'created_at' | 'updated_at'>>) => {
    if (!sessionToken) throw new Error('세션이 만료되었습니다.')
    const { error: err } = await supabase.rpc('sm_update_my_subject_record', {
      p_session_token: sessionToken,
      p_record_id: id,
      p_semester: payload.semester ?? null,
      p_subject_name: payload.subject_name ?? null,
      p_achievement_level: payload.achievement_level ?? null,
      p_grade_rank: payload.grade_rank ?? null,
      p_raw_score: payload.raw_score ?? null,
      p_subject_average: payload.subject_average ?? null,
      p_seukot_attitude: payload.seukot_attitude ?? null,
      p_seukot_inquiry: payload.seukot_inquiry ?? null,
      p_seukot_thinking: payload.seukot_thinking ?? null,
      p_seukot_career: payload.seukot_career ?? null,
      p_inquiry_keywords: payload.inquiry_keywords ?? null,
      p_completion_status: payload.completion_status ?? null,
    })
    if (err) throw new Error(err.message)
    await fetchRecords()
  }

  const deleteRecord = async (id: string) => {
    if (!sessionToken) throw new Error('세션이 만료되었습니다.')
    const { error: err } = await supabase.rpc('sm_delete_my_subject_record', {
      p_session_token: sessionToken,
      p_record_id: id,
    })
    if (err) throw new Error(err.message)
    await fetchRecords()
  }

  return { records, loading, error, addRecord, updateRecord, deleteRecord, refresh: fetchRecords }
}
