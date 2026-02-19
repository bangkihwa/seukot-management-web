-- ============================================================
-- 세특 관리 - RLS 정책 + RPC 함수
-- ============================================================

ALTER TABLE sm_subject_records ENABLE ROW LEVEL SECURITY;

-- 관리자: 자신의 학생 데이터만 접근
CREATE POLICY "admin_manage_subject_records"
  ON sm_subject_records FOR ALL
  USING (EXISTS (
    SELECT 1 FROM sm_students s
    WHERE s.id = sm_subject_records.student_id AND s.created_by = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM sm_students s
    WHERE s.id = sm_subject_records.student_id AND s.created_by = auth.uid()
  ));

-- ============================================================
-- 학생용 RPC 함수 (SECURITY DEFINER)
-- ============================================================

-- 내 세특 기록 목록 조회
CREATE OR REPLACE FUNCTION sm_get_my_subject_records(
  p_session_token TEXT,
  p_semester TEXT DEFAULT NULL
)
RETURNS SETOF sm_subject_records AS $$
DECLARE
  v_student_id UUID;
BEGIN
  v_student_id := sm_get_student_by_session(p_session_token);
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired session';
  END IF;
  RETURN QUERY
    SELECT * FROM sm_subject_records
    WHERE student_id = v_student_id
      AND (p_semester IS NULL OR semester = p_semester)
    ORDER BY semester, subject_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 세특 기록 추가
CREATE OR REPLACE FUNCTION sm_add_my_subject_record(
  p_session_token TEXT,
  p_semester TEXT,
  p_subject_name TEXT,
  p_achievement_level TEXT DEFAULT NULL,
  p_grade_rank INTEGER DEFAULT NULL,
  p_raw_score NUMERIC DEFAULT NULL,
  p_subject_average NUMERIC DEFAULT NULL,
  p_seukot_attitude TEXT DEFAULT '',
  p_seukot_inquiry TEXT DEFAULT '',
  p_seukot_thinking TEXT DEFAULT '',
  p_seukot_career TEXT DEFAULT '',
  p_inquiry_keywords JSONB DEFAULT '[]'::jsonb,
  p_completion_status TEXT DEFAULT '미작성'
)
RETURNS UUID AS $$
DECLARE
  v_student_id UUID;
  v_new_id UUID;
BEGIN
  v_student_id := sm_get_student_by_session(p_session_token);
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired session';
  END IF;
  INSERT INTO sm_subject_records (
    student_id, semester, subject_name,
    achievement_level, grade_rank, raw_score, subject_average,
    seukot_attitude, seukot_inquiry, seukot_thinking, seukot_career,
    inquiry_keywords, completion_status
  ) VALUES (
    v_student_id, p_semester, p_subject_name,
    p_achievement_level, p_grade_rank, p_raw_score, p_subject_average,
    p_seukot_attitude, p_seukot_inquiry, p_seukot_thinking, p_seukot_career,
    p_inquiry_keywords, p_completion_status
  )
  RETURNING id INTO v_new_id;
  RETURN v_new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 세특 기록 수정
CREATE OR REPLACE FUNCTION sm_update_my_subject_record(
  p_session_token TEXT,
  p_record_id UUID,
  p_semester TEXT DEFAULT NULL,
  p_subject_name TEXT DEFAULT NULL,
  p_achievement_level TEXT DEFAULT NULL,
  p_grade_rank INTEGER DEFAULT NULL,
  p_raw_score NUMERIC DEFAULT NULL,
  p_subject_average NUMERIC DEFAULT NULL,
  p_seukot_attitude TEXT DEFAULT NULL,
  p_seukot_inquiry TEXT DEFAULT NULL,
  p_seukot_thinking TEXT DEFAULT NULL,
  p_seukot_career TEXT DEFAULT NULL,
  p_inquiry_keywords JSONB DEFAULT NULL,
  p_completion_status TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_student_id UUID;
BEGIN
  v_student_id := sm_get_student_by_session(p_session_token);
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired session';
  END IF;
  UPDATE sm_subject_records SET
    semester          = COALESCE(p_semester, semester),
    subject_name      = COALESCE(p_subject_name, subject_name),
    achievement_level = COALESCE(p_achievement_level, achievement_level),
    grade_rank        = COALESCE(p_grade_rank, grade_rank),
    raw_score         = COALESCE(p_raw_score, raw_score),
    subject_average   = COALESCE(p_subject_average, subject_average),
    seukot_attitude   = COALESCE(p_seukot_attitude, seukot_attitude),
    seukot_inquiry    = COALESCE(p_seukot_inquiry, seukot_inquiry),
    seukot_thinking   = COALESCE(p_seukot_thinking, seukot_thinking),
    seukot_career     = COALESCE(p_seukot_career, seukot_career),
    inquiry_keywords  = COALESCE(p_inquiry_keywords, inquiry_keywords),
    completion_status = COALESCE(p_completion_status, completion_status)
  WHERE id = p_record_id AND student_id = v_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 세특 기록 삭제
CREATE OR REPLACE FUNCTION sm_delete_my_subject_record(
  p_session_token TEXT,
  p_record_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_student_id UUID;
BEGIN
  v_student_id := sm_get_student_by_session(p_session_token);
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired session';
  END IF;
  DELETE FROM sm_subject_records
  WHERE id = p_record_id AND student_id = v_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- anon 사용자에게 실행 권한 부여
GRANT EXECUTE ON FUNCTION sm_get_my_subject_records TO anon;
GRANT EXECUTE ON FUNCTION sm_add_my_subject_record TO anon;
GRANT EXECUTE ON FUNCTION sm_update_my_subject_record TO anon;
GRANT EXECUTE ON FUNCTION sm_delete_my_subject_record TO anon;
