# Force Runner - Aplicar y verificar migracion Supabase

## Archivo a ejecutar

Migracion principal:

```text
supabase/migrations/001_force_runner_initial_schema.sql
```

## Como aplicarla en Supabase

1. Abrir Supabase.
2. Entrar al proyecto Force Runner.
3. Ir a SQL Editor.
4. Crear una nueva consulta.
5. Copiar todo el contenido de:

```text
supabase/migrations/001_force_runner_initial_schema.sql
```

6. Pegar en SQL Editor.
7. Ejecutar.

## Verificaciones despues de ejecutar

### 1. Confirmar tablas principales

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'profiles',
    'profile_private_details',
    'terms_acceptances',
    'user_preferences',
    'runs',
    'run_points',
    'friendships',
    'activities',
    'reactions',
    'conversations',
    'messages',
    'notifications',
    'device_tokens',
    'coach_messages'
  )
order by table_name;
```

Resultado esperado:

- 14 tablas.

### 2. Confirmar RLS activado

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles',
    'profile_private_details',
    'terms_acceptances',
    'user_preferences',
    'runs',
    'run_points',
    'friendships',
    'activities',
    'reactions',
    'conversations',
    'messages',
    'notifications',
    'device_tokens',
    'coach_messages'
  )
order by tablename;
```

Resultado esperado:

- `rowsecurity = true` en todas.

### 3. Confirmar politicas RLS

```sql
select schemaname, tablename, policyname
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;
```

Resultado esperado:

- Politicas para perfiles, carreras, amigos, actividad, reacciones, chat, notificaciones, tokens, Coach IA y storage.

### 4. Confirmar bucket de fotos

```sql
select id, name, public
from storage.buckets
where id = 'profile-images';
```

Resultado esperado:

- Bucket `profile-images`.

### 5. Confirmar funcion de ranking de amigos

```sql
select proname
from pg_proc
where proname = 'get_friend_ranking';
```

Resultado esperado:

- Funcion `get_friend_ranking`.

## Nota importante

La funcion `get_friend_ranking` depende del usuario autenticado mediante `auth.uid()`. Si se prueba desde SQL Editor sin contexto de usuario autenticado, puede devolver datos vacios. La prueba real debe hacerse desde Android o desde una sesion autenticada.

## Si aparece un error

No ejecutar cambios al azar. Copiar el mensaje exacto del error y revisarlo antes de modificar la migracion.

