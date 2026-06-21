-- Force Runner - Initial Supabase schema
-- Target: Supabase PostgreSQL
-- Scope: auth profile, terms, GPS runs, friends, ranking, reactions,
-- chat, notifications, FCM tokens, Coach IA history and user preferences.

begin;

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Profiles and terms
-- ---------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  display_name text not null,
  country text not null default 'Honduras',
  avatar_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_not_blank check (length(trim(full_name)) > 0),
  constraint profiles_display_name_not_blank check (length(trim(display_name)) > 0)
);

create table if not exists public.profile_private_details (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  email text not null unique,
  phone text not null unique,
  age integer not null,
  weight_kg numeric(5,2) not null,
  accepted_terms boolean not null default false,
  terms_accepted_at timestamptz,
  terms_version text not null default '1.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_private_age_valid check (age between 10 and 100),
  constraint profile_private_weight_valid check (weight_kg between 25 and 300),
  constraint profile_private_email_valid check (position('@' in email) > 1),
  constraint profile_private_phone_valid check (length(regexp_replace(phone, '[^0-9+]', '', 'g')) >= 8),
  constraint profile_private_terms_valid check (
    (accepted_terms = false and terms_accepted_at is null)
    or
    (accepted_terms = true and terms_accepted_at is not null)
  )
);

create table if not exists public.terms_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  terms_version text not null,
  accepted_at timestamptz not null default now(),
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  unique (user_id, terms_version)
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  theme text not null default 'light',
  language text not null default 'es',
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_theme_valid check (theme in ('light', 'dark')),
  constraint user_preferences_language_valid check (language in ('es', 'en'))
);

-- ---------------------------------------------------------------------
-- Runs and GPS routes
-- ---------------------------------------------------------------------

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'saved',
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer not null default 0,
  distance_meters numeric(10,2) not null default 0,
  pace_seconds_per_km integer,
  calories numeric(10,2) not null default 0,
  mood text,
  source text not null default 'android',
  sync_status text not null default 'synced',
  local_uuid uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint runs_status_valid check (status in ('saved', 'discarded')),
  constraint runs_sync_status_valid check (sync_status in ('synced', 'pending', 'conflict')),
  constraint runs_duration_valid check (duration_seconds >= 0),
  constraint runs_distance_valid check (distance_meters >= 0),
  constraint runs_calories_valid check (calories >= 0),
  constraint runs_pace_valid check (pace_seconds_per_km is null or pace_seconds_per_km > 0),
  constraint runs_saved_has_activity check (
    status = 'discarded'
    or
    (duration_seconds > 0 and distance_meters > 0)
  )
);

create table if not exists public.run_points (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.runs(id) on delete cascade,
  point_order integer not null,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  accuracy_meters numeric(8,2),
  speed_meters_second numeric(8,2),
  recorded_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (run_id, point_order),
  constraint run_points_order_valid check (point_order >= 0),
  constraint run_points_latitude_valid check (latitude between -90 and 90),
  constraint run_points_longitude_valid check (longitude between -180 and 180)
);

-- ---------------------------------------------------------------------
-- Friends, activity, reactions and ranking
-- ---------------------------------------------------------------------

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint friendships_users_different check (requester_id <> addressee_id),
  constraint friendships_status_valid check (status in ('pending', 'accepted', 'rejected', 'deleted'))
);

create unique index if not exists friendships_pair_unique_idx
on public.friendships (
  least(requester_id, addressee_id),
  greatest(requester_id, addressee_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  run_id uuid references public.runs(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint activities_type_valid check (
    type in (
      'started_running',
      'stopped_running',
      'finished_run',
      'completed_distance',
      'ranking_up',
      'received_reaction'
    )
  )
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reaction_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, target_type, target_id),
  constraint reactions_target_type_valid check (target_type in ('run', 'activity')),
  constraint reactions_type_valid check (
    reaction_type in ('fire', 'strong', 'clap', 'heart', 'wow', 'trophy')
  )
);

create or replace view public.run_statistics_monthly
with (security_invoker = true) as
select
  r.user_id,
  date_trunc('month', r.started_at)::date as month_start,
  count(*)::integer as total_runs,
  coalesce(sum(r.distance_meters), 0)::numeric(12,2) as total_distance_meters,
  coalesce(sum(r.duration_seconds), 0)::integer as total_duration_seconds,
  coalesce(sum(r.calories), 0)::numeric(12,2) as total_calories,
  round(avg(nullif(r.pace_seconds_per_km, 0))::numeric, 2) as avg_pace_seconds_per_km
from public.runs r
where r.status = 'saved'
  and r.deleted_at is null
group by r.user_id, date_trunc('month', r.started_at)::date;

create or replace view public.run_statistics_weekly
with (security_invoker = true) as
select
  r.user_id,
  date_trunc('week', r.started_at)::date as week_start,
  count(*)::integer as total_runs,
  coalesce(sum(r.distance_meters), 0)::numeric(12,2) as total_distance_meters,
  coalesce(sum(r.duration_seconds), 0)::integer as total_duration_seconds,
  coalesce(sum(r.calories), 0)::numeric(12,2) as total_calories,
  round(avg(nullif(r.pace_seconds_per_km, 0))::numeric, 2) as avg_pace_seconds_per_km
from public.runs r
where r.status = 'saved'
  and r.deleted_at is null
group by r.user_id, date_trunc('week', r.started_at)::date;

create or replace view public.ranking_monthly
with (security_invoker = true) as
select
  p.id as user_id,
  p.display_name,
  p.country,
  p.avatar_url,
  s.month_start,
  s.total_runs,
  s.total_distance_meters,
  s.total_calories,
  dense_rank() over (
    partition by s.month_start
    order by s.total_distance_meters desc, s.total_calories desc
  ) as global_position
from public.run_statistics_monthly s
join public.profiles p on p.id = s.user_id;

-- ---------------------------------------------------------------------
-- Chat and notifications
-- ---------------------------------------------------------------------

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.profiles(id) on delete cascade,
  user_b_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz,
  constraint conversations_users_different check (user_a_id <> user_b_id)
);

create unique index if not exists conversations_pair_unique_idx
on public.conversations (
  least(user_a_id, user_b_id),
  greatest(user_a_id, user_b_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  deleted_at timestamptz,
  constraint messages_body_not_blank check (length(trim(body)) > 0)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references public.profiles(id) on delete cascade,
  actor_user_id uuid references public.profiles(id) on delete set null,
  type text not null,
  title text not null,
  body text not null,
  related_table text,
  related_id uuid,
  push_sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notifications_type_valid check (
    type in (
      'friend_started_running',
      'friend_stopped_running',
      'friend_finished_run',
      'ranking_up',
      'reaction_received',
      'friend_request_received',
      'friend_request_accepted',
      'chat_message_received',
      'coach_message'
    )
  )
);

create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique,
  platform text not null default 'android',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz,
  constraint device_tokens_platform_valid check (platform in ('android'))
);

-- ---------------------------------------------------------------------
-- Coach IA
-- ---------------------------------------------------------------------

create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  input_type text not null default 'text',
  question text not null,
  answer text,
  calories_goal numeric(10,2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint coach_messages_input_type_valid check (input_type in ('text', 'voice')),
  constraint coach_messages_question_not_blank check (length(trim(question)) > 0)
);

-- ---------------------------------------------------------------------
-- Security helper functions. These are created after tables so PostgreSQL
-- can validate referenced relations.
-- ---------------------------------------------------------------------

create or replace function public.is_friend(user_a uuid, user_b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.friendships f
    where f.status = 'accepted'
      and (
        (f.requester_id = user_a and f.addressee_id = user_b)
        or
        (f.requester_id = user_b and f.addressee_id = user_a)
      )
  );
$$;

create or replace function public.is_conversation_member(conversation_id uuid, user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (c.user_a_id = user_id or c.user_b_id = user_id)
  );
$$;

create or replace function public.can_view_run(run_id uuid, viewer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.runs r
    where r.id = run_id
      and r.status = 'saved'
      and (r.user_id = viewer_id or public.is_friend(r.user_id, viewer_id))
  );
$$;

create or replace function public.can_view_activity(activity_id uuid, viewer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.activities a
    where a.id = activity_id
      and (a.user_id = viewer_id or public.is_friend(a.user_id, viewer_id))
  );
$$;

create or replace function public.can_view_reaction(target_type text, target_id uuid, viewer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when target_type = 'run' then public.can_view_run(target_id, viewer_id)
    when target_type = 'activity' then public.can_view_activity(target_id, viewer_id)
    else false
  end;
$$;

create or replace function public.get_friend_ranking(period_type text default 'month')
returns table (
  rank_position bigint,
  user_id uuid,
  display_name text,
  country text,
  avatar_url text,
  total_runs integer,
  total_distance_meters numeric,
  total_calories numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with period_bounds as (
    select
      case
        when period_type = 'week' then date_trunc('week', now())
        when period_type = 'year' then date_trunc('year', now())
        else date_trunc('month', now())
      end as start_at,
      case
        when period_type = 'week' then date_trunc('week', now()) + interval '1 week'
        when period_type = 'year' then date_trunc('year', now()) + interval '1 year'
        else date_trunc('month', now()) + interval '1 month'
      end as end_at
  ),
  visible_users as (
    select p.id, p.display_name, p.country, p.avatar_url
    from public.profiles p
    where p.id = auth.uid()
       or public.is_friend(p.id, auth.uid())
  ),
  totals as (
    select
      vu.id as user_id,
      vu.display_name,
      vu.country,
      vu.avatar_url,
      count(r.id)::integer as total_runs,
      coalesce(sum(r.distance_meters), 0)::numeric(12,2) as total_distance_meters,
      coalesce(sum(r.calories), 0)::numeric(12,2) as total_calories
    from visible_users vu
    cross join period_bounds pb
    left join public.runs r
      on r.user_id = vu.id
     and r.status = 'saved'
     and r.deleted_at is null
     and r.started_at >= pb.start_at
     and r.started_at < pb.end_at
    group by vu.id, vu.display_name, vu.country, vu.avatar_url
  )
  select
    dense_rank() over (order by t.total_distance_meters desc, t.total_calories desc) as rank_position,
    t.user_id,
    t.display_name,
    t.country,
    t.avatar_url,
    t.total_runs,
    t.total_distance_meters,
    t.total_calories
  from totals t
  order by rank_position, t.display_name;
$$;

-- ---------------------------------------------------------------------
-- Storage bucket for profile images
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------

create index if not exists profile_private_email_idx on public.profile_private_details (lower(email));
create index if not exists profile_private_phone_idx on public.profile_private_details (phone);
create index if not exists profiles_display_name_idx on public.profiles (lower(display_name));
create index if not exists runs_user_started_idx on public.runs (user_id, started_at desc);
create index if not exists runs_status_started_idx on public.runs (status, started_at desc);
create index if not exists run_points_run_order_idx on public.run_points (run_id, point_order);
create index if not exists friendships_requester_idx on public.friendships (requester_id, status);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id, status);
create index if not exists activities_user_created_idx on public.activities (user_id, created_at desc);
create index if not exists reactions_target_idx on public.reactions (target_type, target_id);
create index if not exists conversations_user_a_idx on public.conversations (user_a_id);
create index if not exists conversations_user_b_idx on public.conversations (user_b_id);
create index if not exists messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index if not exists notifications_recipient_created_idx on public.notifications (recipient_user_id, created_at desc);
create index if not exists device_tokens_user_idx on public.device_tokens (user_id, is_active);
create index if not exists coach_messages_user_created_idx on public.coach_messages (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- Updated-at triggers
-- ---------------------------------------------------------------------

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_private_details_updated_at on public.profile_private_details;
create trigger set_profile_private_details_updated_at
before update on public.profile_private_details
for each row execute function public.set_updated_at();

drop trigger if exists set_user_preferences_updated_at on public.user_preferences;
create trigger set_user_preferences_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

drop trigger if exists set_runs_updated_at on public.runs;
create trigger set_runs_updated_at
before update on public.runs
for each row execute function public.set_updated_at();

drop trigger if exists set_friendships_updated_at on public.friendships;
create trigger set_friendships_updated_at
before update on public.friendships
for each row execute function public.set_updated_at();

drop trigger if exists set_reactions_updated_at on public.reactions;
create trigger set_reactions_updated_at
before update on public.reactions
for each row execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists set_device_tokens_updated_at on public.device_tokens;
create trigger set_device_tokens_updated_at
before update on public.device_tokens
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.profile_private_details enable row level security;
alter table public.terms_acceptances enable row level security;
alter table public.user_preferences enable row level security;
alter table public.runs enable row level security;
alter table public.run_points enable row level security;
alter table public.friendships enable row level security;
alter table public.activities enable row level security;
alter table public.reactions enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.device_tokens enable row level security;
alter table public.coach_messages enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profile_private_select_own" on public.profile_private_details;
drop policy if exists "profile_private_insert_own" on public.profile_private_details;
drop policy if exists "profile_private_update_own" on public.profile_private_details;
drop policy if exists "terms_select_own" on public.terms_acceptances;
drop policy if exists "terms_insert_own" on public.terms_acceptances;
drop policy if exists "preferences_all_own" on public.user_preferences;
drop policy if exists "runs_select_owner_or_friend" on public.runs;
drop policy if exists "runs_insert_own" on public.runs;
drop policy if exists "runs_update_own" on public.runs;
drop policy if exists "run_points_select_if_run_visible" on public.run_points;
drop policy if exists "run_points_insert_if_run_owner" on public.run_points;
drop policy if exists "friendships_select_involved" on public.friendships;
drop policy if exists "friendships_insert_requester" on public.friendships;
drop policy if exists "friendships_update_involved" on public.friendships;
drop policy if exists "activities_select_owner_or_friend" on public.activities;
drop policy if exists "activities_insert_own" on public.activities;
drop policy if exists "reactions_select_if_target_visible" on public.reactions;
drop policy if exists "reactions_insert_own_if_target_visible" on public.reactions;
drop policy if exists "reactions_update_own" on public.reactions;
drop policy if exists "conversations_select_member" on public.conversations;
drop policy if exists "conversations_insert_friends" on public.conversations;
drop policy if exists "messages_select_conversation_member" on public.messages;
drop policy if exists "messages_insert_conversation_member" on public.messages;
drop policy if exists "notifications_select_recipient" on public.notifications;
drop policy if exists "notifications_update_recipient" on public.notifications;
drop policy if exists "notifications_insert_friend_event" on public.notifications;
drop policy if exists "device_tokens_all_own" on public.device_tokens;
drop policy if exists "coach_messages_all_own" on public.coach_messages;
drop policy if exists "profile_images_select_authenticated" on storage.objects;
drop policy if exists "profile_images_insert_own_folder" on storage.objects;
drop policy if exists "profile_images_update_own_folder" on storage.objects;

-- Public profile fields are searchable by authenticated users.
create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "profile_private_select_own"
on public.profile_private_details
for select
to authenticated
using (user_id = auth.uid());

create policy "profile_private_insert_own"
on public.profile_private_details
for insert
to authenticated
with check (user_id = auth.uid());

create policy "profile_private_update_own"
on public.profile_private_details
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "terms_select_own"
on public.terms_acceptances
for select
to authenticated
using (user_id = auth.uid());

create policy "terms_insert_own"
on public.terms_acceptances
for insert
to authenticated
with check (user_id = auth.uid());

create policy "preferences_all_own"
on public.user_preferences
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "runs_select_owner_or_friend"
on public.runs
for select
to authenticated
using (
  user_id = auth.uid()
  or
  (status = 'saved' and public.is_friend(user_id, auth.uid()))
);

create policy "runs_insert_own"
on public.runs
for insert
to authenticated
with check (user_id = auth.uid());

create policy "runs_update_own"
on public.runs
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "run_points_select_if_run_visible"
on public.run_points
for select
to authenticated
using (public.can_view_run(run_id, auth.uid()));

create policy "run_points_insert_if_run_owner"
on public.run_points
for insert
to authenticated
with check (
  exists (
    select 1 from public.runs r
    where r.id = run_id and r.user_id = auth.uid()
  )
);

create policy "friendships_select_involved"
on public.friendships
for select
to authenticated
using (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "friendships_insert_requester"
on public.friendships
for insert
to authenticated
with check (requester_id = auth.uid() and status = 'pending');

create policy "friendships_update_involved"
on public.friendships
for update
to authenticated
using (requester_id = auth.uid() or addressee_id = auth.uid())
with check (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "activities_select_owner_or_friend"
on public.activities
for select
to authenticated
using (user_id = auth.uid() or public.is_friend(user_id, auth.uid()));

create policy "activities_insert_own"
on public.activities
for insert
to authenticated
with check (user_id = auth.uid());

create policy "reactions_select_if_target_visible"
on public.reactions
for select
to authenticated
using (public.can_view_reaction(target_type, target_id, auth.uid()));

create policy "reactions_insert_own_if_target_visible"
on public.reactions
for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.can_view_reaction(target_type, target_id, auth.uid())
);

create policy "reactions_update_own"
on public.reactions
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "conversations_select_member"
on public.conversations
for select
to authenticated
using (user_a_id = auth.uid() or user_b_id = auth.uid());

create policy "conversations_insert_friends"
on public.conversations
for insert
to authenticated
with check (
  (user_a_id = auth.uid() or user_b_id = auth.uid())
  and public.is_friend(user_a_id, user_b_id)
);

create policy "messages_select_conversation_member"
on public.messages
for select
to authenticated
using (public.is_conversation_member(conversation_id, auth.uid()));

create policy "messages_insert_conversation_member"
on public.messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and public.is_conversation_member(conversation_id, auth.uid())
);

create policy "notifications_select_recipient"
on public.notifications
for select
to authenticated
using (recipient_user_id = auth.uid());

create policy "notifications_update_recipient"
on public.notifications
for update
to authenticated
using (recipient_user_id = auth.uid())
with check (recipient_user_id = auth.uid());

create policy "notifications_insert_friend_event"
on public.notifications
for insert
to authenticated
with check (
  actor_user_id = auth.uid()
  and (
    recipient_user_id = auth.uid()
    or public.is_friend(actor_user_id, recipient_user_id)
  )
);

create policy "device_tokens_all_own"
on public.device_tokens
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "coach_messages_all_own"
on public.coach_messages
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Storage policies for profile images.
create policy "profile_images_select_authenticated"
on storage.objects
for select
to authenticated
using (bucket_id = 'profile-images');

create policy "profile_images_insert_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile_images_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- ---------------------------------------------------------------------
-- Optional profile bootstrap from Supabase Auth metadata.
-- Android can also create profiles explicitly after sign-up.
-- ---------------------------------------------------------------------

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  full_name_value text;
  display_name_value text;
  country_value text;
  avatar_value text;
  phone_value text;
  age_value integer;
  weight_value numeric(5,2);
  accepted_terms_value boolean;
  terms_version_value text;
begin
  full_name_value := coalesce(new.raw_user_meta_data->>'full_name', 'Usuario Force Runner');
  display_name_value := coalesce(new.raw_user_meta_data->>'display_name', split_part(full_name_value, ' ', 1));
  country_value := coalesce(new.raw_user_meta_data->>'country', 'Honduras');
  avatar_value := coalesce(new.raw_user_meta_data->>'avatar_url', 'pending');
  phone_value := coalesce(new.raw_user_meta_data->>'phone', new.phone, 'pending-' || new.id::text);
  age_value := coalesce(nullif(new.raw_user_meta_data->>'age', '')::integer, 18);
  weight_value := coalesce(nullif(new.raw_user_meta_data->>'weight_kg', '')::numeric, 70);
  accepted_terms_value := coalesce((new.raw_user_meta_data->>'accepted_terms')::boolean, false);
  terms_version_value := coalesce(new.raw_user_meta_data->>'terms_version', '1.0');

  insert into public.profiles (id, full_name, display_name, country, avatar_url)
  values (new.id, full_name_value, display_name_value, country_value, avatar_value)
  on conflict (id) do nothing;

  insert into public.profile_private_details (
    user_id,
    email,
    phone,
    age,
    weight_kg,
    accepted_terms,
    terms_accepted_at,
    terms_version
  )
  values (
    new.id,
    coalesce(new.email, 'pending-' || new.id::text || '@forcerunner.local'),
    phone_value,
    age_value,
    weight_value,
    accepted_terms_value,
    case when accepted_terms_value then now() else null end,
    terms_version_value
  )
  on conflict (user_id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  if accepted_terms_value then
    insert into public.terms_acceptances (user_id, terms_version, accepted_at)
    values (new.id, terms_version_value, now())
    on conflict (user_id, terms_version) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

commit;
