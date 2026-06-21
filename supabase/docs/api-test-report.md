# Force Runner - Reporte de pruebas de APIs

Fecha de prueba: 2026-06-21

Funcion probada:

```text
force-runner-api
```

Base URL:

```text
https://mmhmtcotlirxhspeqhfh.supabase.co/functions/v1/force-runner-api
```

## Resultado general

Todas las APIs personalizadas fueron probadas con usuario autenticado y respondieron correctamente.

## Cuentas usadas

```text
edwin@forcerunner.test
api.tester@forcerunner.test
```

Password:

```text
ForceRunner123!
```

## Pruebas realizadas

| Prueba | Estado | Resultado |
|---|---:|---|
| Login Edwin | OK | Se obtuvo `access_token` |
| Login API Tester | OK | Se obtuvo `access_token` |
| `POST /start-run` | OK | Creo actividad y notificaciones a amigos |
| `POST /finish-run` | OK | Creo carrera, puntos GPS, actividad y notificaciones |
| `POST /cancel-run` | OK | Creo actividad de carrera detenida y notificaciones |
| `POST /create-friend-request` | OK | Creo solicitud de amistad |
| `POST /respond-friend-request` | OK | Acepto solicitud de amistad |
| `GET /friend-ranking?period=month` | OK | Devolvio ranking mensual |
| `GET /friend-ranking?period=week` | OK | Devolvio ranking semanal |
| `POST /send-reaction` | OK | Creo reaccion sobre carrera |
| `GET /get-reactions` | OK | Devolvio reaccion y perfil del usuario |
| `POST /send-message` | OK | Creo mensaje en conversacion existente |
| `POST /notify-friends` | OK | Creo notificaciones internas |
| `POST /coach-ai` | OK | Creo respuesta base de Coach IA |

## Correccion realizada durante la prueba

La primera prueba de `POST /send-message` fallo porque la funcion buscaba la conversacion en un solo orden de usuarios. Se corrigio para buscar ambos sentidos:

```text
usuario A -> usuario B
usuario B -> usuario A
```

Luego se desplego la version 2 de `force-runner-api` y la prueba de chat paso correctamente.

## Conteos posteriores a pruebas

| Tabla | Filas |
|---|---:|
| activities | 7 |
| coach_messages | 3 |
| conversations | 2 |
| friendships | 7 |
| messages | 4 |
| notifications | 20 |
| reactions | 5 |
| run_points | 11 |
| runs | 9 |

## Estado final

```text
force-runner-api: ACTIVE
version: 2
JWT requerido: si
```
