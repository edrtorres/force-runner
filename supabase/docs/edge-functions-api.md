# Force Runner - APIs personalizadas

Base URL:

```text
https://mmhmtcotlirxhspeqhfh.supabase.co/functions/v1/force-runner-api
```

Headers obligatorios:

```text
apikey: sb_publishable_BBbGd3Iz4Qy7MpmdwjntHg_okDftI2O
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

## Endpoints creados

### 1. Iniciar carrera

```http
POST /start-run
```

Body:

```json
{
  "latitude": 14.0818,
  "longitude": -87.2068
}
```

### 2. Finalizar carrera

```http
POST /finish-run
```

Body:

```json
{
  "duration_seconds": 2700,
  "distance_meters": 6320,
  "pace_seconds_per_km": 427,
  "calories": 512,
  "mood": "feliz",
  "points": [
    {
      "latitude": 14.0818,
      "longitude": -87.2068,
      "recorded_at": "2026-06-21T12:00:00Z"
    }
  ]
}
```

### 3. Cancelar carrera

```http
POST /cancel-run
```

Body:

```json
{
  "reason": "Usuario detuvo la carrera"
}
```

### 4. Crear solicitud de amistad

```http
POST /create-friend-request
```

Body:

```json
{
  "addressee_id": "11111111-1111-4111-8111-111111111111"
}
```

### 5. Responder solicitud de amistad

```http
POST /respond-friend-request
```

Body:

```json
{
  "friendship_id": "aaaaaaaa-0001-4000-8000-000000000001",
  "status": "accepted"
}
```

### 6. Ranking de amigos

```http
GET /friend-ranking?period=month
GET /friend-ranking?period=week
```

### 7. Enviar reaccion

```http
POST /send-reaction
```

Body:

```json
{
  "target_type": "run",
  "target_id": "bbbbbbbb-0001-4000-8000-000000000001",
  "reaction_type": "fire"
}
```

Tipos permitidos:

```text
fire, strong, clap, heart, wow, trophy
```

### 8. Ver reacciones

```http
GET /get-reactions?target_type=run&target_id=bbbbbbbb-0001-4000-8000-000000000001
```

### 9. Enviar mensaje

```http
POST /send-message
```

Body:

```json
{
  "recipient_user_id": "11111111-1111-4111-8111-111111111111",
  "body": "Listo para correr?"
}
```

### 10. Notificar amigos

```http
POST /notify-friends
```

Body:

```json
{
  "type": "friend_started_running",
  "title": "Edwin comenzo a correr",
  "body": "Enviale apoyo y motivacion",
  "related_table": "activities",
  "related_id": "cccccccc-0001-4000-8000-000000000001"
}
```

### 11. Coach IA

```http
POST /coach-ai
```

Body:

```json
{
  "input_type": "text",
  "question": "Cuanto debo correr para quemar 500 calorias?",
  "calories_goal": 500
}
```

## Estado

- Funcion desplegada: `force-runner-api`
- JWT requerido: si
- Endpoint probado: `GET /friend-ranking?period=month`
- Cuenta usada en prueba: `edwin@forcerunner.test`
