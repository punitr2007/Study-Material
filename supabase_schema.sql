-- ====================================================================
-- NSUT Hub - PostgreSQL / Supabase Row-Level-Security (RLS) Schema
-- ====================================================================

-- 1. Create User Academic Progress Table
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  photo_url text,
  version integer not null default 1,
  nptel_progress jsonb not null default '{}'::jsonb,
  flagged_question_ids text[] not null default '{}'::text[],
  bookmarked_doc_ids text[] not null default '{}'::text[],
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_active timestamptz not null default now(),

  -- Sanity constraints
  constraint valid_version check (version >= 0)
);

-- 2. Enable Row-Level Security
alter table public.user_progress enable row level security;

-- 3. Row-Level Security Policies
create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Explicitly disallow raw client DELETE queries; deletions must invoke RPC / Edge Function
create policy "Block direct client deletes"
  on public.user_progress for delete
  using (false);

-- 4. Atomic Upsert & Optimistic Concurrency RPC Function
create or replace function public.sync_academic_progress(
  p_incoming jsonb
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_existing public.user_progress%rowtype;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Select with Row Exclusive Lock (SELECT ... FOR UPDATE) to prevent race conditions
  select * into v_existing
  from public.user_progress
  where user_id = v_user_id
  for update;

  if not found then
    insert into public.user_progress (
      user_id,
      email,
      display_name,
      photo_url,
      version,
      nptel_progress,
      flagged_question_ids,
      bookmarked_doc_ids,
      notes,
      last_active
    ) values (
      v_user_id,
      p_incoming->>'email',
      p_incoming->>'displayName',
      p_incoming->>'photoURL',
      1,
      coalesce(p_incoming->'nptelProgress', '{}'::jsonb),
      array(select jsonb_array_elements_text(coalesce(p_incoming->'flaggedQuestionIds', '[]'::jsonb))),
      array(select jsonb_array_elements_text(coalesce(p_incoming->'bookmarkedDocIds', '[]'::jsonb))),
      coalesce(p_incoming->'notes', '{}'::jsonb),
      now()
    );
  else
    -- Update with optimistic version increment
    update public.user_progress
    set
      version = v_existing.version + 1,
      nptel_progress = v_existing.nptel_progress || coalesce(p_incoming->'nptelProgress', '{}'::jsonb),
      last_active = now()
    where user_id = v_user_id;
  end if;

  select to_jsonb(p) into v_result
  from public.user_progress p
  where user_id = v_user_id;

  return v_result;
end;
$$;
