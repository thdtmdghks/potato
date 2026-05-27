-- 리뷰 테이블 생성
CREATE TABLE reviews (
  id uuid PRIMARY KEY,
  kakao_id text NOT NULL,
  author_name text NOT NULL,
  author_avatar text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  images text[] DEFAULT '{}' NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 수정 요청 대기 테이블 생성 (1대1 매핑)
CREATE TABLE review_edits (
  review_id uuid PRIMARY KEY REFERENCES reviews(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  images text[] DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);


