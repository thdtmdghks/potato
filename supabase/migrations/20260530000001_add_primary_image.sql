-- projects 및 reviews 테이블에 대표 이미지(primary_image) 컬럼 추가
ALTER TABLE projects ADD COLUMN primary_image text;
ALTER TABLE reviews ADD COLUMN primary_image text;

-- 기존 데이터는 이미지 배열의 첫 번째 원소(PG Array index 1)를 대표 이미지로 자동 이전
UPDATE projects SET primary_image = images[1] WHERE array_length(images, 1) > 0 AND primary_image IS NULL;
UPDATE reviews SET primary_image = images[1] WHERE array_length(images, 1) > 0 AND primary_image IS NULL;
