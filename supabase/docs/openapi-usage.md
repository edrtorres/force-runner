# Force Runner - Uso de OpenAPI / Swagger

Archivo principal:

```text
supabase/docs/openapi.yaml
```

Pagina Swagger UI lista para colaboradores:

```text
docs/swagger-ui/index.html
```

La pagina carga automaticamente:

```text
docs/swagger-ui/openapi.yaml
```

## Como verlo en Swagger Editor

1. Abrir:

```text
https://editor.swagger.io/
```

2. Copiar el contenido de:

```text
supabase/docs/openapi.yaml
```

3. Pegar el contenido en el panel izquierdo.

4. Swagger mostrara la documentacion visual en el panel derecho.

## Mejor opcion para el equipo

Subir el proyecto a GitHub y activar GitHub Pages apuntando a la carpeta:

```text
docs
```

Luego los colaboradores podran abrir:

```text
https://USUARIO.github.io/REPOSITORIO/swagger-ui/
```

## Seguridad requerida

Todas las APIs personalizadas requieren:

```text
apikey: sb_publishable_BBbGd3Iz4Qy7MpmdwjntHg_okDftI2O
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

El `ACCESS_TOKEN` se obtiene iniciando sesion con Supabase Auth.

## Base URL documentada

```text
https://mmhmtcotlirxhspeqhfh.supabase.co/functions/v1/force-runner-api
```

Para autenticacion, Swagger tambien documenta:

```text
https://mmhmtcotlirxhspeqhfh.supabase.co/auth/v1
```

## Endpoints documentados

```text
POST /signup
POST /token?grant_type=password
POST /recover
POST /logout
POST /start-run
POST /finish-run
POST /cancel-run
POST /create-friend-request
POST /respond-friend-request
GET  /friend-ranking
POST /send-reaction
GET  /get-reactions
POST /send-message
POST /notify-friends
POST /coach-ai
```
