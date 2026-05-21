-- 포트폴리오
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  images text[] default '{}',
  created_by text not null,
  created_at timestamptz default now()
);

-- RLS 정책
alter table projects enable row level security;

-- 공개 읽기
create policy "공개 읽기" on projects for select using (true);

-- 인증된 사용자만 쓰기
create policy "인증 쓰기" on projects for all using (auth.role() = 'authenticated');

