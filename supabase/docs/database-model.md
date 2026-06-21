# Force Runner - Modelo de base de datos Supabase

## Objetivo

Este modelo permite que Force Runner funcione con Supabase usando:

- PostgreSQL como base de datos principal.
- Supabase REST API para operaciones CRUD.
- Supabase Auth para autenticacion.
- Supabase Storage para fotos de perfil.
- Supabase Realtime para chat y actividad social.
- Firebase Cloud Messaging para notificaciones push.

## Decision importante de privacidad

El perfil se separa en dos tablas:

1. `profiles`
   - Datos publicos minimos.
   - Sirve para busqueda de usuarios, ranking y listas de amigos.
   - Incluye nombre visible, pais y foto.

2. `profile_private_details`
   - Datos privados.
   - Solo los puede ver el propio usuario.
   - Incluye correo, telefono, edad, peso y aceptacion de terminos.

Esto evita que un usuario cualquiera pueda ver telefono, correo, edad o peso de otra persona.

## Tablas principales

### `profiles`

Perfil publico del usuario.

Campos clave:

- `id`: mismo ID de `auth.users`.
- `full_name`: nombre completo.
- `display_name`: nombre corto para pantallas.
- `country`: pais.
- `avatar_url`: URL de foto de perfil.

Uso:

- Busqueda de corredores.
- Ranking.
- Lista de amigos.
- Chat.
- Reacciones.

### `profile_private_details`

Datos privados obligatorios del usuario.

Campos clave:

- `user_id`
- `email`
- `phone`
- `age`
- `weight_kg`
- `accepted_terms`
- `terms_accepted_at`
- `terms_version`

Regla:

- Solo el usuario propietario puede leer o modificar estos datos.

### `terms_acceptances`

Historial de aceptaciones de terminos.

Guarda:

- usuario
- version de terminos
- fecha de aceptacion
- IP opcional
- user agent opcional

Esto permite demostrar que el usuario acepto terminos y condiciones.

### `user_preferences`

Preferencias del usuario.

Campos:

- tema: `light` o `dark`
- idioma
- notificaciones activadas

## Carreras y rutas GPS

### `runs`

Guarda una carrera.

Campos clave:

- usuario
- estado: `saved` o `discarded`
- inicio
- fin
- duracion
- distancia
- ritmo
- calorias
- estado emocional
- estado de sincronizacion

Reglas:

- Una carrera guardada debe tener distancia mayor que 0.
- Una carrera guardada debe tener tiempo mayor que 0.
- Las carreras descartadas no cuentan para ranking ni estadisticas.

### `run_points`

Guarda los puntos GPS de una carrera.

Campos clave:

- carrera relacionada
- orden del punto
- latitud
- longitud
- precision
- velocidad
- fecha/hora del punto

Uso:

- Dibujar la ruta en el mapa.
- Mostrar detalle de recorrido.

## Amigos y privacidad social

### `friendships`

Guarda solicitudes y relaciones de amistad.

Estados:

- `pending`
- `accepted`
- `rejected`
- `deleted`

Regla:

- Solo amigos aceptados pueden ver estado, actividad social, ranking social, chat y reacciones.

### `activities`

Guarda eventos sociales.

Tipos:

- `started_running`
- `stopped_running`
- `finished_run`
- `completed_distance`
- `ranking_up`
- `received_reaction`

Uso:

- Dashboard.
- Actividad de amigos.
- Notificaciones.

### `reactions`

Guarda reacciones a carreras o actividades.

Tipos permitidos:

- `fire`
- `strong`
- `clap`
- `heart`
- `wow`
- `trophy`

Regla:

- Un usuario solo puede reaccionar una vez por carrera o publicacion.
- Puede cambiar su reaccion.

## Ranking y estadisticas

### `run_statistics_monthly`

Vista SQL mensual.

Calcula:

- carreras totales
- distancia total
- tiempo total
- calorias totales
- ritmo promedio

### `run_statistics_weekly`

Vista SQL semanal.

Calcula los mismos datos, agrupados por semana.

### `ranking_monthly`

Vista SQL de ranking mensual global.

Nota:

- La vista usa `security_invoker` para respetar RLS.
- El ranking social de la app debe usar preferiblemente la funcion `get_friend_ranking`.
- El ranking social no debe mostrar usuarios que no sean amigos.

### `get_friend_ranking(period_type)`

Funcion SQL para obtener ranking solo entre:

- usuario actual
- amigos aceptados

Valores permitidos esperados:

- `week`
- `month`
- `year`

Uso recomendado desde Android/Supabase REST RPC:

```text
rpc/get_friend_ranking
```

Campo de posicion devuelto:

```text
rank_position
```

## Chat

### `conversations`

Representa una conversacion entre dos usuarios.

Regla:

- Solo se puede crear conversacion entre amigos aceptados.

### `messages`

Guarda mensajes del chat.

Campos:

- conversacion
- remitente
- texto
- fecha
- fecha de lectura

Regla:

- Solo miembros de la conversacion pueden leer o escribir mensajes.

## Notificaciones

### `notifications`

Guarda notificaciones internas.

Tipos:

- amigo comenzo a correr
- amigo dejo de correr
- amigo finalizo carrera
- subio en ranking
- recibio reaccion
- solicitud recibida
- solicitud aceptada
- mensaje recibido
- mensaje del Coach IA

### `device_tokens`

Guarda tokens FCM de cada dispositivo Android.

Uso:

- Enviar push notifications con Firebase Cloud Messaging.

## Coach IA

### `coach_messages`

Guarda preguntas y respuestas del Coach IA.

Campos:

- usuario
- tipo de entrada: texto o voz
- pregunta
- respuesta
- calorias objetivo
- metadatos

Uso:

- Historial de consultas.
- Mejorar recomendaciones.
- Auditar respuestas del Coach IA.

## Storage

### Bucket `profile-images`

Guarda fotos de perfil.

Regla:

- Cada usuario sube fotos dentro de su propia carpeta.
- La ruta recomendada es:

```text
profile-images/{user_id}/avatar.jpg
```

La URL se guarda en `profiles.avatar_url`.

## RLS y seguridad

Reglas principales:

- Un usuario solo ve sus datos privados.
- Un usuario puede buscar perfiles publicos minimos.
- Un usuario solo modifica su propio perfil.
- Un usuario solo crea carreras para si mismo.
- Un amigo aceptado puede ver carreras guardadas.
- Un no-amigo no ve estado, actividad, chat ni ranking social.
- Solo amigos aceptados pueden chatear.
- Solo miembros de una conversacion ven sus mensajes.
- Solo el destinatario ve sus notificaciones.
- Solo el usuario administra sus tokens FCM.

## Archivos generados

Migracion principal:

```text
supabase/migrations/001_force_runner_initial_schema.sql
```

Este archivo contiene:

- tablas
- relaciones
- restricciones
- indices
- vistas
- funciones de seguridad
- triggers `updated_at`
- bucket de Storage
- politicas RLS
