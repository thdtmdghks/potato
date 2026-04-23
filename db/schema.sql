-- 포트폴리오
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  images text[] default '{}',
  created_at timestamptz default now()
);

-- 제품
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  category text not null,
  image text,
  features text[] default '{}',
  created_at timestamptz default now()
);

-- 견적문의
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text,
  type text not null,
  address text not null,
  content text not null,
  status text default '신규',
  created_at timestamptz default now()
);

-- 푸시 알림 구독
create table push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  endpoint text not null,
  keys jsonb not null,
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- RLS 정책
alter table projects enable row level security;
alter table products enable row level security;
alter table inquiries enable row level security;
alter table push_subscriptions enable row level security;

-- 공개 읽기
create policy "공개 읽기" on projects for select using (true);
create policy "공개 읽기" on products for select using (true);

-- 인증된 사용자만 쓰기
create policy "인증 쓰기" on projects for all using (auth.role() = 'authenticated');
create policy "인증 쓰기" on products for all using (auth.role() = 'authenticated');
create policy "인증 쓰기" on inquiries for all using (auth.role() = 'authenticated');
create policy "문의 삽입" on inquiries for insert with check (true);
create policy "인증 쓰기" on push_subscriptions for all using (auth.role() = 'authenticated');
