-- 포트폴리오 테이블 생성
CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  images text[] DEFAULT '{}' NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS 정책 설정
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 허용
CREATE POLICY "공개 읽기" ON projects FOR SELECT USING (true);

-- 인증된 사용자만 모든 권한 허용
CREATE POLICY "인증 쓰기" ON projects FOR ALL USING (auth.role() = 'authenticated');
