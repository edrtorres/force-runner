-- Force Runner - Test data seed
-- Test password for all users: ForceRunner123!

begin;

with seed_users(id, email, phone, full_name, display_name, country, age, weight_kg, avatar_url) as (
  values
    ('11111111-1111-4111-8111-111111111111'::uuid, 'astrid@forcerunner.test', '+50490000001', 'ASTRID LIZBETH CASTELLANOS PINEDA', 'Astrid Castellanos', 'Honduras', 22, 58.00, 'profile-images/11111111-1111-4111-8111-111111111111/avatar.jpg'),
    ('22222222-2222-4222-8222-222222222222'::uuid, 'edwin@forcerunner.test', '+50490000002', 'EDWIN RENE TORRES HERNANDEZ', 'Edwin Torres', 'Honduras', 24, 78.00, 'profile-images/22222222-2222-4222-8222-222222222222/avatar.jpg'),
    ('33333333-3333-4333-8333-333333333333'::uuid, 'josue@forcerunner.test', '+50490000003', 'JOSUE ELIAS DURON MIGUEL', 'Josue Duron', 'Honduras', 23, 72.00, 'profile-images/33333333-3333-4333-8333-333333333333/avatar.jpg'),
    ('44444444-4444-4444-8444-444444444444'::uuid, 'michelle@forcerunner.test', '+50490000004', 'MICHELLE ALEJANDRA PERDOMO RAMOS', 'Michelle Perdomo', 'Honduras', 22, 62.00, 'profile-images/44444444-4444-4444-8444-444444444444/avatar.jpg')
)
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  reauthentication_token,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  is_sso_user,
  is_anonymous
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  id,
  'authenticated',
  'authenticated',
  email,
  crypt('ForceRunner123!', gen_salt('bf')),
  now(),
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  0,
  '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object(
    'full_name', full_name,
    'display_name', display_name,
    'country', country,
    'avatar_url', avatar_url,
    'phone', phone,
    'age', age,
    'weight_kg', weight_kg,
    'accepted_terms', true,
    'terms_version', '1.0'
  ),
  false,
  now(),
  now(),
  phone,
  now(),
  false,
  false
from seed_users
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  confirmation_token = excluded.confirmation_token,
  recovery_token = excluded.recovery_token,
  email_change_token_new = excluded.email_change_token_new,
  email_change = excluded.email_change,
  phone_change = excluded.phone_change,
  phone_change_token = excluded.phone_change_token,
  email_change_token_current = excluded.email_change_token_current,
  email_change_confirm_status = excluded.email_change_confirm_status,
  reauthentication_token = excluded.reauthentication_token,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  phone = excluded.phone,
  phone_confirmed_at = excluded.phone_confirmed_at,
  updated_at = now();

with seed_users(id, email, phone, full_name, display_name, country, age, weight_kg, avatar_url) as (
  values
    ('11111111-1111-4111-8111-111111111111'::uuid, 'astrid@forcerunner.test', '+50490000001', 'ASTRID LIZBETH CASTELLANOS PINEDA', 'Astrid Castellanos', 'Honduras', 22, 58.00, 'profile-images/11111111-1111-4111-8111-111111111111/avatar.jpg'),
    ('22222222-2222-4222-8222-222222222222'::uuid, 'edwin@forcerunner.test', '+50490000002', 'EDWIN RENE TORRES HERNANDEZ', 'Edwin Torres', 'Honduras', 24, 78.00, 'profile-images/22222222-2222-4222-8222-222222222222/avatar.jpg'),
    ('33333333-3333-4333-8333-333333333333'::uuid, 'josue@forcerunner.test', '+50490000003', 'JOSUE ELIAS DURON MIGUEL', 'Josue Duron', 'Honduras', 23, 72.00, 'profile-images/33333333-3333-4333-8333-333333333333/avatar.jpg'),
    ('44444444-4444-4444-8444-444444444444'::uuid, 'michelle@forcerunner.test', '+50490000004', 'MICHELLE ALEJANDRA PERDOMO RAMOS', 'Michelle Perdomo', 'Honduras', 22, 62.00, 'profile-images/44444444-4444-4444-8444-444444444444/avatar.jpg')
)
insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  id,
  id::text,
  id,
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true, 'phone_verified', true),
  'email',
  now(),
  now(),
  now()
from seed_users
on conflict (provider_id, provider) do update set
  identity_data = excluded.identity_data,
  updated_at = now();

with seed_users(id, email, phone, full_name, display_name, country, age, weight_kg, avatar_url) as (
  values
    ('11111111-1111-4111-8111-111111111111'::uuid, 'astrid@forcerunner.test', '+50490000001', 'ASTRID LIZBETH CASTELLANOS PINEDA', 'Astrid Castellanos', 'Honduras', 22, 58.00, 'profile-images/11111111-1111-4111-8111-111111111111/avatar.jpg'),
    ('22222222-2222-4222-8222-222222222222'::uuid, 'edwin@forcerunner.test', '+50490000002', 'EDWIN RENE TORRES HERNANDEZ', 'Edwin Torres', 'Honduras', 24, 78.00, 'profile-images/22222222-2222-4222-8222-222222222222/avatar.jpg'),
    ('33333333-3333-4333-8333-333333333333'::uuid, 'josue@forcerunner.test', '+50490000003', 'JOSUE ELIAS DURON MIGUEL', 'Josue Duron', 'Honduras', 23, 72.00, 'profile-images/33333333-3333-4333-8333-333333333333/avatar.jpg'),
    ('44444444-4444-4444-8444-444444444444'::uuid, 'michelle@forcerunner.test', '+50490000004', 'MICHELLE ALEJANDRA PERDOMO RAMOS', 'Michelle Perdomo', 'Honduras', 22, 62.00, 'profile-images/44444444-4444-4444-8444-444444444444/avatar.jpg')
)
insert into public.profiles (id, full_name, display_name, country, avatar_url)
select id, full_name, display_name, country, avatar_url
from seed_users
on conflict (id) do update set
  full_name = excluded.full_name,
  display_name = excluded.display_name,
  country = excluded.country,
  avatar_url = excluded.avatar_url,
  updated_at = now();

with seed_users(id, email, phone, full_name, display_name, country, age, weight_kg, avatar_url) as (
  values
    ('11111111-1111-4111-8111-111111111111'::uuid, 'astrid@forcerunner.test', '+50490000001', 'ASTRID LIZBETH CASTELLANOS PINEDA', 'Astrid Castellanos', 'Honduras', 22, 58.00, 'profile-images/11111111-1111-4111-8111-111111111111/avatar.jpg'),
    ('22222222-2222-4222-8222-222222222222'::uuid, 'edwin@forcerunner.test', '+50490000002', 'EDWIN RENE TORRES HERNANDEZ', 'Edwin Torres', 'Honduras', 24, 78.00, 'profile-images/22222222-2222-4222-8222-222222222222/avatar.jpg'),
    ('33333333-3333-4333-8333-333333333333'::uuid, 'josue@forcerunner.test', '+50490000003', 'JOSUE ELIAS DURON MIGUEL', 'Josue Duron', 'Honduras', 23, 72.00, 'profile-images/33333333-3333-4333-8333-333333333333/avatar.jpg'),
    ('44444444-4444-4444-8444-444444444444'::uuid, 'michelle@forcerunner.test', '+50490000004', 'MICHELLE ALEJANDRA PERDOMO RAMOS', 'Michelle Perdomo', 'Honduras', 22, 62.00, 'profile-images/44444444-4444-4444-8444-444444444444/avatar.jpg')
)
insert into public.profile_private_details (user_id, email, phone, age, weight_kg, accepted_terms, terms_accepted_at, terms_version)
select id, email, phone, age, weight_kg, true, now(), '1.0'
from seed_users
on conflict (user_id) do update set
  email = excluded.email,
  phone = excluded.phone,
  age = excluded.age,
  weight_kg = excluded.weight_kg,
  accepted_terms = true,
  terms_accepted_at = excluded.terms_accepted_at,
  terms_version = excluded.terms_version,
  updated_at = now();

insert into public.terms_acceptances (user_id, terms_version, accepted_at)
values
  ('11111111-1111-4111-8111-111111111111', '1.0', now()),
  ('22222222-2222-4222-8222-222222222222', '1.0', now()),
  ('33333333-3333-4333-8333-333333333333', '1.0', now()),
  ('44444444-4444-4444-8444-444444444444', '1.0', now())
on conflict (user_id, terms_version) do nothing;

insert into public.user_preferences (user_id, theme, language, notifications_enabled)
values
  ('11111111-1111-4111-8111-111111111111', 'light', 'es', true),
  ('22222222-2222-4222-8222-222222222222', 'light', 'es', true),
  ('33333333-3333-4333-8333-333333333333', 'dark', 'es', true),
  ('44444444-4444-4444-8444-444444444444', 'light', 'es', true)
on conflict (user_id) do update set
  theme = excluded.theme,
  language = excluded.language,
  notifications_enabled = excluded.notifications_enabled,
  updated_at = now();

insert into public.friendships (id, requester_id, addressee_id, status, requested_at, responded_at)
values
  ('aaaaaaaa-0001-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'accepted', now() - interval '9 days', now() - interval '9 days'),
  ('aaaaaaaa-0002-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333', 'accepted', now() - interval '8 days', now() - interval '8 days'),
  ('aaaaaaaa-0003-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', '44444444-4444-4444-8444-444444444444', 'accepted', now() - interval '7 days', now() - interval '7 days'),
  ('aaaaaaaa-0004-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333', 'accepted', now() - interval '6 days', now() - interval '6 days'),
  ('aaaaaaaa-0005-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', '44444444-4444-4444-8444-444444444444', 'accepted', now() - interval '5 days', now() - interval '5 days'),
  ('aaaaaaaa-0006-4000-8000-000000000006', '33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444', 'accepted', now() - interval '4 days', now() - interval '4 days')
on conflict (id) do update set
  status = excluded.status,
  requester_id = excluded.requester_id,
  addressee_id = excluded.addressee_id,
  requested_at = excluded.requested_at,
  responded_at = excluded.responded_at,
  updated_at = now();

insert into public.runs (id, user_id, status, started_at, ended_at, duration_seconds, distance_meters, pace_seconds_per_km, calories, mood)
values
  ('bbbbbbbb-0001-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'saved', now() - interval '2 days', now() - interval '2 days' + interval '45 minutes', 2700, 6320, 427, 512, 'feliz'),
  ('bbbbbbbb-0002-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'saved', now() - interval '8 days', now() - interval '8 days' + interval '38 minutes', 2280, 5210, 437, 421, 'fuerte'),
  ('bbbbbbbb-0003-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'saved', now() - interval '1 day', now() - interval '1 day' + interval '41 minutes', 2460, 5840, 421, 388, 'motivada'),
  ('bbbbbbbb-0004-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'saved', now() - interval '11 days', now() - interval '11 days' + interval '35 minutes', 2100, 4800, 438, 318, 'bien'),
  ('bbbbbbbb-0005-4000-8000-000000000005', '33333333-3333-4333-8333-333333333333', 'saved', now() - interval '3 days', now() - interval '3 days' + interval '39 minutes', 2340, 5520, 424, 430, 'excelente'),
  ('bbbbbbbb-0006-4000-8000-000000000006', '33333333-3333-4333-8333-333333333333', 'saved', now() - interval '13 days', now() - interval '13 days' + interval '33 minutes', 1980, 4400, 450, 342, 'cansado'),
  ('bbbbbbbb-0007-4000-8000-000000000007', '44444444-4444-4444-8444-444444444444', 'saved', now() - interval '4 days', now() - interval '4 days' + interval '37 minutes', 2220, 5010, 443, 336, 'feliz'),
  ('bbbbbbbb-0008-4000-8000-000000000008', '44444444-4444-4444-8444-444444444444', 'saved', now() - interval '12 days', now() - interval '12 days' + interval '31 minutes', 1860, 3890, 478, 260, 'bien')
on conflict (id) do update set
  duration_seconds = excluded.duration_seconds,
  distance_meters = excluded.distance_meters,
  pace_seconds_per_km = excluded.pace_seconds_per_km,
  calories = excluded.calories,
  mood = excluded.mood,
  updated_at = now();

insert into public.run_points (run_id, point_order, latitude, longitude, recorded_at)
select run_id, point_order, latitude, longitude, recorded_at
from (
  values
    ('bbbbbbbb-0001-4000-8000-000000000001'::uuid, 0, 14.081800, -87.206800, now() - interval '2 days'),
    ('bbbbbbbb-0001-4000-8000-000000000001'::uuid, 1, 14.085300, -87.199500, now() - interval '2 days' + interval '15 minutes'),
    ('bbbbbbbb-0001-4000-8000-000000000001'::uuid, 2, 14.090100, -87.193200, now() - interval '2 days' + interval '30 minutes'),
    ('bbbbbbbb-0003-4000-8000-000000000003'::uuid, 0, 14.073800, -87.210200, now() - interval '1 day'),
    ('bbbbbbbb-0003-4000-8000-000000000003'::uuid, 1, 14.077200, -87.202400, now() - interval '1 day' + interval '20 minutes'),
    ('bbbbbbbb-0005-4000-8000-000000000005'::uuid, 0, 14.092000, -87.205000, now() - interval '3 days'),
    ('bbbbbbbb-0005-4000-8000-000000000005'::uuid, 1, 14.096500, -87.198900, now() - interval '3 days' + interval '19 minutes'),
    ('bbbbbbbb-0007-4000-8000-000000000007'::uuid, 0, 14.065000, -87.215000, now() - interval '4 days'),
    ('bbbbbbbb-0007-4000-8000-000000000007'::uuid, 1, 14.070200, -87.207800, now() - interval '4 days' + interval '18 minutes')
) as points(run_id, point_order, latitude, longitude, recorded_at)
on conflict (run_id, point_order) do update set
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  recorded_at = excluded.recorded_at;

insert into public.activities (id, user_id, run_id, type, title, body, metadata, created_at)
values
  ('cccccccc-0001-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 'bbbbbbbb-0007-4000-8000-000000000007', 'started_running', 'Michelle comenzo a correr', 'Enviale apoyo y motivacion.', '{}', now() - interval '4 days'),
  ('cccccccc-0002-4000-8000-000000000002', '33333333-3333-4333-8333-333333333333', 'bbbbbbbb-0005-4000-8000-000000000005', 'finished_run', 'Josue finalizo su carrera', 'Completo 5.52 km.', '{\"distance_km\":5.52}', now() - interval '3 days'),
  ('cccccccc-0003-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'bbbbbbbb-0003-4000-8000-000000000003', 'completed_distance', 'Astrid completo 5 km', 'Buen ritmo en su carrera.', '{\"distance_km\":5.84}', now() - interval '1 day'),
  ('cccccccc-0004-4000-8000-000000000004', '22222222-2222-4222-8222-222222222222', 'bbbbbbbb-0001-4000-8000-000000000001', 'finished_run', 'Edwin completo una carrera', '6.32 km registrados.', '{\"distance_km\":6.32}', now() - interval '2 days')
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  metadata = excluded.metadata;

insert into public.reactions (user_id, target_type, target_id, reaction_type)
values
  ('11111111-1111-4111-8111-111111111111', 'run', 'bbbbbbbb-0001-4000-8000-000000000001', 'fire'),
  ('33333333-3333-4333-8333-333333333333', 'run', 'bbbbbbbb-0001-4000-8000-000000000001', 'strong'),
  ('44444444-4444-4444-8444-444444444444', 'run', 'bbbbbbbb-0001-4000-8000-000000000001', 'trophy'),
  ('22222222-2222-4222-8222-222222222222', 'activity', 'cccccccc-0003-4000-8000-000000000003', 'clap')
on conflict (user_id, target_type, target_id) do update set
  reaction_type = excluded.reaction_type,
  updated_at = now();

insert into public.conversations (id, user_a_id, user_b_id, last_message_at)
values
  ('dddddddd-0001-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', now() - interval '1 hour'),
  ('dddddddd-0002-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', '44444444-4444-4444-8444-444444444444', now() - interval '2 hours')
on conflict (id) do update set
  user_a_id = excluded.user_a_id,
  user_b_id = excluded.user_b_id,
  last_message_at = excluded.last_message_at,
  updated_at = now();

insert into public.messages (id, conversation_id, sender_id, body, created_at)
values
  ('eeeeeeee-0001-4000-8000-000000000001', 'dddddddd-0001-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Hola Edwin, listo para correr?', now() - interval '2 hours'),
  ('eeeeeeee-0002-4000-8000-000000000002', 'dddddddd-0001-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'Si, vamos por esos kilometros!', now() - interval '1 hour'),
  ('eeeeeeee-0003-4000-8000-000000000003', 'dddddddd-0002-4000-8000-000000000002', '44444444-4444-4444-8444-444444444444', 'Hoy quiero mejorar mi ritmo.', now() - interval '2 hours')
on conflict (id) do update set
  body = excluded.body;

insert into public.notifications (id, recipient_user_id, actor_user_id, type, title, body, related_table, related_id, created_at)
values
  ('ffffffff-0001-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', '44444444-4444-4444-8444-444444444444', 'friend_started_running', 'Michelle comenzo a correr', 'Enviale apoyo y motivacion.', 'activities', 'cccccccc-0001-4000-8000-000000000001', now() - interval '4 days'),
  ('ffffffff-0002-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'reaction_received', 'Astrid reacciono a tu carrera', 'Excelente rendimiento.', 'runs', 'bbbbbbbb-0001-4000-8000-000000000001', now() - interval '2 days'),
  ('ffffffff-0003-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'chat_message_received', 'Nuevo mensaje de Edwin', 'Si, vamos por esos kilometros!', 'messages', 'eeeeeeee-0002-4000-8000-000000000002', now() - interval '1 hour')
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body;

insert into public.device_tokens (id, user_id, token, platform, is_active, last_seen_at)
values
  ('99999999-0001-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'test-fcm-token-edwin', 'android', true, now()),
  ('99999999-0002-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'test-fcm-token-astrid', 'android', true, now())
on conflict (token) do update set
  is_active = excluded.is_active,
  last_seen_at = excluded.last_seen_at,
  updated_at = now();

insert into public.coach_messages (id, user_id, input_type, question, answer, calories_goal, metadata)
values
  ('77777777-0001-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'text', 'Cuanto debo correr para quemar 500 calorias?', 'Segun tu peso y ritmo, podrias correr aproximadamente entre 45 y 55 minutos.', 500, '{\"source\":\"seed\"}'),
  ('77777777-0002-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'voice', 'Que dia me conviene correr esta semana?', 'Podrias correr martes, jueves y sabado para mantener descanso entre sesiones.', null, '{\"source\":\"seed\"}')
on conflict (id) do update set
  answer = excluded.answer,
  metadata = excluded.metadata;

commit;
