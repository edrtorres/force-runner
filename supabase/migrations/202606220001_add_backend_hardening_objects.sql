create table if not exists public.api_rate_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  route text not null,
  window_start timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, route, window_start)
);

alter table public.api_rate_limits enable row level security;

revoke all on public.api_rate_limits from anon, authenticated;

create index if not exists idx_api_rate_limits_user_route_window
  on public.api_rate_limits (user_id, route, window_start desc);

create index if not exists idx_runs_user_started_at
  on public.runs (user_id, started_at desc)
  where deleted_at is null;

create index if not exists idx_messages_conversation_created_at
  on public.messages (conversation_id, created_at);

create or replace function public.finish_run_transaction(
  p_user_id uuid,
  p_run jsonb,
  p_points jsonb,
  p_activity jsonb,
  p_notifications jsonb
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_run public.runs%rowtype;
  v_activity public.activities%rowtype;
  v_point_count integer := 0;
  v_notification_count integer := 0;
begin
  insert into public.runs (
    user_id,
    started_at,
    ended_at,
    duration_seconds,
    distance_meters,
    pace_seconds_per_km,
    calories,
    mood
  ) values (
    p_user_id,
    coalesce((p_run->>'started_at')::timestamptz, now() - make_interval(secs => (p_run->>'duration_seconds')::integer)),
    coalesce((p_run->>'ended_at')::timestamptz, now()),
    (p_run->>'duration_seconds')::integer,
    (p_run->>'distance_meters')::numeric,
    nullif(p_run->>'pace_seconds_per_km', '')::integer,
    coalesce(nullif(p_run->>'calories', '')::numeric, 0),
    nullif(p_run->>'mood', '')
  ) returning * into v_run;

  insert into public.run_points (
    run_id,
    point_order,
    latitude,
    longitude,
    accuracy_meters,
    speed_meters_second,
    recorded_at
  )
  select
    v_run.id,
    coalesce((point->>'point_order')::integer, point_index - 1),
    (point->>'latitude')::numeric,
    (point->>'longitude')::numeric,
    nullif(point->>'accuracy_meters', '')::numeric,
    nullif(point->>'speed_meters_second', '')::numeric,
    coalesce((point->>'recorded_at')::timestamptz, v_run.ended_at)
  from jsonb_array_elements(coalesce(p_points, '[]'::jsonb)) with ordinality as point_rows(point, point_index);

  get diagnostics v_point_count = row_count;

  insert into public.activities (
    user_id,
    run_id,
    type,
    title,
    body,
    metadata
  ) values (
    p_user_id,
    v_run.id,
    p_activity->>'type',
    p_activity->>'title',
    nullif(p_activity->>'body', ''),
    coalesce(p_activity->'metadata', '{}'::jsonb)
  ) returning * into v_activity;

  insert into public.notifications (
    recipient_user_id,
    actor_user_id,
    type,
    title,
    body,
    related_table,
    related_id
  )
  select
    (notification->>'recipient_user_id')::uuid,
    p_user_id,
    notification->>'type',
    notification->>'title',
    notification->>'body',
    nullif(notification->>'related_table', ''),
    coalesce(nullif(notification->>'related_id', '')::uuid, v_run.id)
  from jsonb_array_elements(coalesce(p_notifications, '[]'::jsonb)) as notification_rows(notification);

  get diagnostics v_notification_count = row_count;

  return jsonb_build_object(
    'run', to_jsonb(v_run),
    'activity', to_jsonb(v_activity),
    'points_created', v_point_count,
    'notifications_created', v_notification_count
  );
end;
$$;

revoke all on function public.finish_run_transaction(uuid, jsonb, jsonb, jsonb, jsonb) from public, anon, authenticated;

do $$
begin
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('profile-images', 'profile-images', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
  on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
exception when undefined_table then
  null;
end $$;
