-- projects 테이블에 status 컬럼 추가 (기본값 'active')
ALTER TABLE projects ADD COLUMN status text DEFAULT 'active' NOT NULL;
