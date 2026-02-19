-- ============================================================
-- 관리자 피드백 기능 추가
-- admin_feedback 컬럼 + completion_status에 '수정요청' 추가
-- ============================================================

-- 1. 관리자 피드백 메시지 컬럼 추가
ALTER TABLE sm_subject_records
  ADD COLUMN admin_feedback TEXT NOT NULL DEFAULT '';

-- 2. 기존 completion_status CHECK 제약조건 삭제 후 재생성 (수정요청 추가)
ALTER TABLE sm_subject_records
  DROP CONSTRAINT sm_subject_records_completion_status_check;

ALTER TABLE sm_subject_records
  ADD CONSTRAINT sm_subject_records_completion_status_check
  CHECK (completion_status IN ('미작성','작성중','검토요청','수정요청','완료'));
