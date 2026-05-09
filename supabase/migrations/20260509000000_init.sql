-- MedLens MVP tables. Access from Next.js server with service role; filter by user_id (Clerk subject).

create table if not exists public.symptom_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  body_region text,
  symptom_data jsonb not null,
  ai_output jsonb,
  rule_output jsonb,
  urgency text not null,
  created_at timestamptz not null default now()
);

create index if not exists symptom_sessions_user_created_idx
  on public.symptom_sessions (user_id, created_at desc);

create table if not exists public.image_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  image_url text,
  ai_result jsonb,
  severity text,
  created_at timestamptz not null default now()
);

create index if not exists image_analyses_user_created_idx
  on public.image_analyses (user_id, created_at desc);

alter table public.symptom_sessions enable row level security;
alter table public.image_analyses enable row level security;

-- Deny direct client access; server uses service role (bypasses RLS).
create policy "deny_anon_symptom" on public.symptom_sessions for all to anon using (false);
create policy "deny_auth_symptom" on public.symptom_sessions for all to authenticated using (false);
create policy "deny_anon_image" on public.image_analyses for all to anon using (false);
create policy "deny_auth_image" on public.image_analyses for all to authenticated using (false);
