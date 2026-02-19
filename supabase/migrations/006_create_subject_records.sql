-- ============================================================
-- 세특 관리 시스템 - sm_subject_records 테이블 생성
-- 기존 sm_ 접두사 유지, sm_students 참조
-- ============================================================

CREATE TABLE sm_subject_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES sm_students(id) ON DELETE CASCADE,

  -- 학기 구분
  semester TEXT NOT NULL CHECK (semester IN ('1-1','1-2','2-1','2-2','3-1','3-2')),

  -- 과목 정보
  subject_name TEXT NOT NULL DEFAULT '',

  -- 성적
  achievement_level TEXT CHECK (achievement_level IN ('A','B','C','D','E') OR achievement_level IS NULL),
  grade_rank INTEGER CHECK ((grade_rank BETWEEN 1 AND 9) OR grade_rank IS NULL),
  raw_score NUMERIC CHECK ((raw_score BETWEEN 0 AND 100) OR raw_score IS NULL),
  subject_average NUMERIC CHECK ((subject_average BETWEEN 0 AND 100) OR subject_average IS NULL),

  -- 세특 4영역
  seukot_attitude TEXT NOT NULL DEFAULT '',
  seukot_inquiry TEXT NOT NULL DEFAULT '',
  seukot_thinking TEXT NOT NULL DEFAULT '',
  seukot_career TEXT NOT NULL DEFAULT '',

  -- 탐구 키워드
  inquiry_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- 완성도 상태
  completion_status TEXT NOT NULL DEFAULT '미작성'
    CHECK (completion_status IN ('미작성','작성중','검토요청','완료')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_sm_subject_records_updated_at
  BEFORE UPDATE ON sm_subject_records
  FOR EACH ROW EXECUTE FUNCTION sm_update_updated_at();

CREATE INDEX idx_sm_subject_records_student_id ON sm_subject_records(student_id);
CREATE INDEX idx_sm_subject_records_semester ON sm_subject_records(semester);
CREATE INDEX idx_sm_subject_records_status ON sm_subject_records(completion_status);

-- 같은 학생, 같은 학기, 같은 과목은 중복 불가
CREATE UNIQUE INDEX idx_sm_subject_records_unique
  ON sm_subject_records(student_id, semester, subject_name);
