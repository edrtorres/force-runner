-- Force Runner - Security and performance hardening
-- Applies after 001_force_runner_initial_schema.sql

begin;

create schema if not exists private;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.is_friend(user_a uuid, user_b uuid)
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

create or replace function private.is_conversation_member(conversation_id uuid, user_id uuid)
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

create or replace function private.can_view_run(run_id uuid, viewer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1
    from public.runs r
    where r.id = run_id
      and r.status = 'saved'
      and (r.user_id = viewer_id or private.is_friend(r.user_id, viewer_id))
  );
$$;

create or replace function private.can_view_activity(activity_id uuid, viewer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1
    from public.activities a
    where a.id = activity_id
      and (a.user_id = viewer_id or private.is_friend(a.user_id, viewer_id))
  );
$$;

create or replace function private.can_view_reaction(target_type text, target_id uuid, viewer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select case
    when target_type = 'run' then private.can_view_run(target_id, viewer_id)
    when target_type = 'activity' then private.can_view_activity(target_id, viewer_id)
    else false
  end;
$$;

grant usage on schema private to authenticated;
grant execute on all functions in schema private to authenticated;

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
security invoker
set search_path = public, private
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
    where p.id = (select auth.uid())
       or private.is_friend(p.id, (select auth.uid()))
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

revoke all on function public.get_friend_ranking(text) from public, anon;
grant execute on function public.get_friend_ranking(text) to authenticated;

create or replace function private.handle_new_auth_user()
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
for each row execute function private.handle_new_auth_user();

revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

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

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = (select auth.uid()));

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "profile_private_select_own"
on public.profile_private_details
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "profile_private_insert_own"
on public.profile_private_details
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "profile_private_update_own"
on public.profile_private_details
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "terms_select_own"
on public.terms_acceptances
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "terms_insert_own"
on public.terms_acceptances
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "preferences_all_own"
on public.user_preferences
for all
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "runs_select_owner_or_friend"
on public.runs
for select
to authenticated
using (
  user_id = (select auth.uid())
  or
  (status = 'saved' and private.is_friend(user_id, (select auth.uid())))
);

create policy "runs_insert_own"
on public.runs
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "runs_update_own"
on public.runs
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "run_points_select_if_run_visible"
on public.run_points
for select
to authenticated
using (private.can_view_run(run_id, (select auth.uid())));

create policy "run_points_insert_if_run_owner"
on public.run_points
for insert
to authenticated
with check (
  exists (
    select 1 from public.runs r
    where r.id = run_id and r.user_id = (select auth.uid())
  )
);

create policy "friendships_select_involved"
on public.friendships
for select
to authenticated
using (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()));

create policy "friendships_insert_requester"
on public.friendships
for insert
to authenticated
with check (requester_id = (select auth.uid()) and status = 'pending');

create policy "friendships_update_involved"
on public.friendships
for update
to authenticated
using (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()))
with check (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()));

create policy "activities_select_owner_or_friend"
on public.activities
for select
to authenticated
using (user_id = (select auth.uid()) or private.is_friend(user_id, (select auth.uid())));

create policy "activities_insert_own"
on public.activities
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "reactions_select_if_target_visible"
on public.reactions
for select
to authenticated
using (private.can_view_reaction(target_type, target_id, (select auth.uid())));

create policy "reactions_insert_own_if_target_visible"
on public.reactions
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and private.can_view_reaction(target_type, target_id, (select auth.uid()))
);

create policy "reactions_update_own"
on public.reactions
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "conversations_select_member"
on public.conversations
for select
to authenticated
using (user_a_id = (select auth.uid()) or user_b_id = (select auth.uid()));

create policy "conversations_insert_friends"
on public.conversations
for insert
to authenticated
with check (
  (user_a_id = (select auth.uid()) or user_b_id = (select auth.uid()))
  and private.is_friend(user_a_id, user_b_id)
);

create policy "messages_select_conversation_member"
on public.messages
for select
to authenticated
using (private.is_conversation_member(conversation_id, (select auth.uid())));

create policy "messages_insert_conversation_member"
on public.messages
for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and private.is_conversation_member(conversation_id, (select auth.uid()))
);

create policy "notifications_select_recipient"
on public.notifications
for select
to authenticated
using (recipient_user_id = (select auth.uid()));

create policy "notifications_update_recipient"
on public.notifications
for update
to authenticated
using (recipient_user_id = (select auth.uid()))
with check (recipient_user_id = (select auth.uid()));

create policy "notifications_insert_friend_event"
on public.notifications
for insert
to authenticated
with check (
  actor_user_id = (select auth.uid())
  and (
    recipient_user_id = (select auth.uid())
    or private.is_friend(actor_user_id, recipient_user_id)
  )
);

create policy "device_tokens_all_own"
on public.device_tokens
for all
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "coach_messages_all_own"
on public.coach_messages
for all
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "profile_images_insert_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "profile_images_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create index if not exists activities_run_id_idx on public.activities (run_id);
create index if not exists messages_sender_id_idx on public.messages (sender_id);
create index if not exists notifications_actor_user_id_idx on public.notifications (actor_user_id);

drop function if exists public.can_view_reaction(text, uuid, uuid);
drop function if exists public.can_view_activity(uuid, uuid);
drop function if exists public.can_view_run(uuid, uuid);
drop function if exists public.is_conversation_member(uuid, uuid);
drop function if exists public.is_friend(uuid, uuid);
drop function if exists public.handle_new_auth_user();

commit;
