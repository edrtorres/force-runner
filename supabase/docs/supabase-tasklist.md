# Force Runner - Tasklist Supabase

## Estado actual

Se aplicaron correctamente las migraciones iniciales del modelo Supabase:

```text
supabase/migrations/001_force_runner_initial_schema.sql
supabase/migrations/002_force_runner_security_hardening.sql
```

Supabase confirma 14 tablas publicas con RLS activo. Los advisors no reportan errores del esquema; queda como recomendacion activar leaked password protection en Auth.
Tambien quedaron cargados los datos de prueba del equipo y se valido el login con la cuenta de Edwin.

## Fase 1: Base de datos principal

- [x] Definir separacion entre perfil publico y datos privados.
- [x] Crear modelo de usuarios y perfiles.
- [x] Crear registro de terminos y condiciones.
- [x] Crear preferencias de usuario.
- [x] Crear modelo de carreras.
- [x] Crear puntos GPS de rutas.
- [x] Crear amistades y solicitudes.
- [x] Crear actividad social.
- [x] Crear reacciones.
- [x] Crear chat.
- [x] Crear notificaciones internas.
- [x] Crear tokens FCM.
- [x] Crear historial de Coach IA.
- [x] Crear vistas semanales y mensuales.
- [x] Crear indices principales.
- [x] Crear politicas RLS base.

## Fase 2: Revision antes de aplicar en Supabase

- [ ] Revisar nombres de tablas y campos con el equipo.
- [ ] Confirmar si se agregara genero del usuario.
- [ ] Confirmar si `profiles` puede ser visible para busqueda publica autenticada.
- [ ] Confirmar si ranking global se mantiene o solo ranking de amigos.
- [ ] Confirmar texto final de tipos de notificacion.
- [ ] Confirmar version inicial de terminos y condiciones.

## Fase 3: Aplicacion en Supabase

- [x] Ejecutar migracion SQL en Supabase.
- [x] Confirmar que todas las tablas fueron creadas.
- [x] Confirmar que RLS esta activo.
- [x] Confirmar que no quedan alertas de seguridad en advisors.
- [x] Confirmar que el bucket `profile-images` existe.
- [x] Probar insercion de perfil.
- [ ] Probar subida de foto.
- [ ] Probar registro de carrera.
- [ ] Probar solicitud de amistad.
- [ ] Probar chat entre amigos.
- [ ] Probar bloqueo de chat entre no-amigos.

## Fase 4: Datos de prueba

- [x] Crear usuarios de prueba para:
  - Astrid Castellanos
  - Edwin Torres
  - Josue Duron
  - Michelle Perdomo
- [x] Crear amistades aceptadas.
- [x] Crear carreras de prueba.
- [x] Crear ranking de prueba.
- [x] Crear reacciones.
- [x] Crear mensajes.
- [x] Crear notificaciones.
- [x] Validar login con una cuenta de prueba.

## Fase 5: Edge Functions

- [x] Crear funcion principal `force-runner-api`.
- [x] API para iniciar carrera.
- [x] API para finalizar carrera.
- [x] API para cancelar carrera.
- [x] API para solicitudes de amistad.
- [x] API para responder solicitudes de amistad.
- [x] API para ranking de amigos.
- [x] API para reacciones.
- [x] API para ver quien reacciono.
- [x] API para chat entre amigos.
- [x] API para notificar amigos.
- [x] API base para Coach IA.
- [x] Validar endpoint de ranking con login real.
- [x] Probar todas las APIs personalizadas.
- [x] Corregir y validar chat entre amigos.
- [ ] Conectar envio real de push notifications con FCM.
- [ ] Conectar Coach IA real usando Gemini.
- [x] Crear documentacion Swagger/OpenAPI formal.

## Fase 6: Android

- [ ] Definir DTOs Java.
- [ ] Definir entidades de dominio.
- [ ] Definir repositorios.
- [ ] Definir data sources Supabase.
- [ ] Definir sincronizacion SQLite a Supabase.
- [ ] Definir manejo de errores.
- [ ] Definir estados de pantalla.
