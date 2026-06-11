-- SEO 고도화용 컬럼 추가 (다중 카테고리, 지역명, 건물 유형)
ALTER TABLE projects ADD COLUMN categories text[] DEFAULT '{}'::text[] NOT NULL;
ALTER TABLE projects ADD COLUMN region text;
ALTER TABLE projects ADD COLUMN building_type text;

-- 기존 데이터 마이그레이션 (단일 category 값을 categories 배열의 첫 원소로 복사)
UPDATE projects SET categories = ARRAY[category] WHERE category IS NOT NULL AND category <> '';

-- 기존 category 컬럼 삭제
ALTER TABLE projects DROP COLUMN category;
