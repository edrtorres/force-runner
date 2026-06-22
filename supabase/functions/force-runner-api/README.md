# Force Runner API

Edge Function de Supabase organizada con Clean Architecture.

## Capas

- `domain`: modelos, errores e interfaces de repositorios.
- `application`: casos de uso, validaciones y servicios de aplicacion.
- `infrastructure`: implementaciones concretas con Supabase.
- `presentation`: router, autenticacion, controladores y armado HTTP.
- `shared`: contenedor de dependencias y utilidades compartidas.

## Principios aplicados

- Clean Architecture.
- SOLID.
- Repository Pattern.
- Use Case Pattern.
- Dependency Injection.
- Separacion entre reglas de negocio e infraestructura.

## Seguridad

La funcion requiere JWT valido (`verify_jwt = true`). El cliente `service_role` queda aislado en infraestructura y no debe exponerse en Android ni en Swagger.

## Variables requeridas

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Estas variables se configuran en Supabase como secretos de la funcion. No deben guardarse en GitHub.

## Despliegue

Desde la raiz del repositorio:

```powershell
supabase functions deploy force-runner-api --verify-jwt
```

La funcion publicada queda disponible en:

```text
https://mmhmtcotlirxhspeqhfh.supabase.co/functions/v1/force-runner-api
```

## Pruebas

Las pruebas estan en `tests/` y se enfocan en la capa de aplicacion, usando repositorios falsos para no depender de Supabase.

```powershell
deno test supabase/functions/force-runner-api/tests
```

## Flujo de mantenimiento

1. Cambiar primero casos de uso o repositorios segun corresponda.
2. Mantener las reglas de negocio fuera de `infrastructure`.
3. Agregar o actualizar pruebas.
4. Si cambia el contrato HTTP, actualizar `docs/swagger-ui/openapi.yaml`.
5. Desplegar la funcion en Supabase.
6. Probar endpoints reales con token de usuario.

## Limites pendientes

- Mantener actualizadas las pruebas cuando cambien contratos de API.
- Agregar integraciones externas solo si se aprueban como cambios funcionales: FCM real y proveedor IA real.

## Controles tecnicos activos

- `finish-run` usa una funcion RPC transaccional para guardar carrera, puntos, actividad y notificaciones.
- Endpoints sensibles tienen rate limiting por usuario y ventana de un minuto.
- Las rutas `/v1/...` funcionan como alias compatibles de las rutas actuales.
- Las entradas principales validan UUID, rangos numericos, coordenadas, enums y tamanos maximos.
- El router registra logs estructurados con `request_id`, ruta, estado y duracion.
