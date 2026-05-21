-- projects 테이블에 created_by 컬럼 추가
-- 기존 row는 관리자 kakaoId로 채움
ALTER TABLE projects ADD COLUMN created_by text;
UPDATE projects SET created_by = '4904776698' WHERE created_by IS NULL;
ALTER TABLE projects ALTER COLUMN created_by SET NOT NULL;
