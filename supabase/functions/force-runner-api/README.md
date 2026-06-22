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
