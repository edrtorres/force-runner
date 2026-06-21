# Blueprint 1: Version minima entregable

## Proyecto

**Nombre de la app:** Force Runner

**Plataforma:** Android

**Tecnologias base:** Java + Groovy

**Base cloud principal:** Supabase en plan gratuito.

## Objetivo

Crear la primera version funcional y presentable de Force Runner, enfocada en las funciones obligatorias del proyecto: autenticacion, perfil, GPS, carreras, historial, estadisticas, ranking basico y persistencia de datos.

## Usuario

La app tendra por el momento un solo tipo de usuario:

- Usuario corredor

No se incluye administrador en esta version.

## Funciones incluidas

### Registro

El registro debe pedir toda la informacion de forma obligatoria:

- Nombre completo
- Edad
- Peso
- Correo electronico
- Telefono
- Contrasena
- Confirmar contrasena
- Pais
- Foto de perfil
- Aceptar terminos y condiciones

Al aceptar terminos y condiciones se debe guardar:

- acepta_terminos
- fecha_aceptacion_terminos
- version_terminos

### Verificacion de cuenta

- Enviar codigo de 6 digitos al correo electronico.
- El usuario ingresa el codigo.
- Si el codigo es correcto, la cuenta queda activa.
- Permitir reenviar codigo.

### Login

El usuario podra iniciar sesion con:

- Correo electronico registrado + contrasena
- Telefono registrado + contrasena

El campo principal puede llamarse:

**Correo electronico o telefono**

### Recuperar contrasena

Flujo:

1. El usuario toca "Olvidaste tu contrasena".
2. Ingresa correo electronico o telefono registrado.
3. El sistema identifica la cuenta.
4. Envia codigo de recuperacion al correo registrado.
5. El usuario ingresa el codigo.
6. Crea una nueva contrasena.
7. Confirma la nueva contrasena.
8. Regresa al login.

### Perfil de usuario

El perfil mostrara:

- Foto de perfil
- Nombre completo
- Edad
- Peso
- Correo electronico
- Telefono
- Pais
- Kilometros totales recorridos
- Carreras completadas
- Calorias quemadas
- Amigos agregados
- Boton para editar perfil
- Boton para cerrar sesion

## Permisos Android

La app necesitara:

- Internet
- Ubicacion/GPS
- Notificaciones
- Camara
- Galeria o almacenamiento de imagenes

## Pantalla de inicio / Dashboard

Debe mostrar:

- Saludo con nombre del usuario
- Foto pequena del usuario
- Resumen de esta semana
- Distancia recorrida
- Tiempo total
- Calorias quemadas
- Boton rapido: Iniciar carrera
- Boton rapido: Historial
- Boton rapido: Estadisticas
- Boton rapido: Ranking
- Actividad reciente de amigos
- Menu inferior:
  - Inicio
  - Carreras
  - Amigos
  - Chat
  - Perfil

## Carrera GPS

### Inicio de carrera

Al tocar "Iniciar carrera", la app debe:

- Verificar permisos de ubicacion.
- Verificar que el GPS este activo.
- Mostrar el mapa.
- Mostrar estado "GPS activo".
- Mostrar boton para iniciar carrera.
- Comenzar conteo de tiempo, distancia, ruta GPS y ritmo.

### Carrera en progreso

Mientras el usuario corre, debe mostrar:

- Tiempo actual de carrera
- Distancia recorrida
- Ritmo promedio
- Calorias quemadas
- Mapa con ruta en vivo
- Boton pausar
- Boton continuar
- Boton finalizar carrera
- Estado visible: "Estas corriendo"
- Notificacion a amigos: "comenzo a correr"

### Finalizacion de carrera

Cuando el usuario finaliza:

- Detener GPS.
- Detener cronometro.
- Calcular distancia total.
- Calcular tiempo total.
- Calcular ritmo promedio.
- Calcular calorias quemadas.
- Mostrar pantalla de resumen.
- Permitir guardar carrera.
- Permitir descartar carrera.
- Notificar a amigos que dejo de correr.

## Resumen de carrera

Debe mostrar:

- Mensaje de felicitacion
- Distancia total
- Tiempo total
- Ritmo promedio
- Calorias quemadas
- Fecha y hora
- Mapa del recorrido
- Pregunta: "Como te sentiste?"
- Seleccion de emocion
- Boton guardar
- Boton descartar

## Historial de recorridos

Debe incluir:

- Lista de carreras guardadas
- Filtros:
  - Todas
  - Semana
  - Mes
  - Ano

Cada carrera mostrara:

- Mapa pequeno o imagen del recorrido
- Distancia
- Fecha
- Ritmo promedio
- Tiempo total
- Calorias quemadas

Al tocar una carrera, se abre el detalle del recorrido.

## Detalle de recorrido

Debe mostrar:

- Mapa del recorrido completo
- Distancia total
- Tiempo total
- Ritmo promedio
- Calorias quemadas
- Fecha y hora
- Estado emocional seleccionado
- Lista de reacciones recibidas
- Boton para compartir o publicar en actividad

## Estadisticas

Debe mostrar:

- Distancia total
- Tiempo total
- Calorias totales
- Kilometros por semana
- Kilometros por mes
- Promedio de ritmo
- Cantidad de carreras realizadas
- Comparacion:
  - Semana actual vs semana anterior
  - Mes actual vs mes anterior
- Filtros:
  - Resumen
  - Mensual
  - Anual

## Ranking basico

Debe incluir:

- Ranking solo entre amigos
- Filtros:
  - Este mes
  - Semana
  - Ano
- Cada corredor mostrara:
  - Posicion
  - Foto
  - Nombre
  - Pais
  - Kilometros del periodo
  - Calorias quemadas
  - Boton de reaccion
- Ordenado por kilometros recorridos de mayor a menor

## Base de datos local

Force Runner usara SQLite para guardar:

- Datos basicos de sesion
- Usuario activo
- Carreras recientes
- Historial temporal
- Estado de sincronizacion
- Preferencias de la app
- Datos pendientes de subir cuando no haya internet

## Base de datos remota

En Supabase PostgreSQL se guardara:

- Usuarios
- Perfiles
- Carreras
- Rutas GPS
- Historial
- Estadisticas
- Ranking
- Datos de sincronizacion

## API REST minima

Modulos principales:

- Supabase Auth
- Usuarios/perfil
- Carreras
- Estadisticas
- Ranking
- Sincronizacion SQLite/remoto

La API REST minima sera la API REST automatica de Supabase sobre PostgreSQL.

Servicios principales:

- Registrar usuario
- Iniciar sesion
- Verificar correo
- Recuperar contrasena
- Actualizar perfil
- Guardar carrera
- Consultar historial
- Consultar estadisticas
- Consultar ranking
- Sincronizar datos locales con remoto

## Servicios cloud de esta version

- Supabase PostgreSQL
- Supabase REST API
- Supabase Auth
- Supabase Storage
- Supabase Auth Email o Brevo SMTP
- Google Maps Platform
- GitHub para repositorio y control de versiones

## Modo sin internet

Sin internet, la app permitira:

- Iniciar y finalizar carrera usando GPS.
- Guardar la carrera en SQLite.
- Marcar la carrera como pendiente de sincronizar.
- Mostrar historial local reciente.
- Mantener sesion si ya habia una sesion guardada.
- Sincronizar automaticamente cuando vuelva la conexion.

Sin internet, no permitira:

- Login nuevo si no hay sesion guardada.
- Ranking en tiempo real.
- Chat.
- Amigos.
- Reacciones en tiempo real.

## Criterio de finalizacion de esta version

Esta version se considera lista cuando:

- La app instala correctamente en Android.
- El usuario puede registrarse con todos los datos obligatorios.
- El usuario puede verificar su correo.
- El usuario puede iniciar sesion con correo o telefono.
- El usuario puede recuperar contrasena.
- El perfil muestra toda la informacion del usuario.
- La app solicita y usa permisos correctamente.
- El usuario puede iniciar una carrera con GPS.
- La app mide tiempo, distancia, ritmo y calorias.
- El usuario puede finalizar, guardar o descartar una carrera.
- Las carreras guardadas aparecen en historial.
- Las estadisticas se calculan correctamente.
- El ranking basico funciona.
- Los datos se guardan en SQLite y en Supabase PostgreSQL.
- La app sincroniza datos pendientes cuando vuelve internet.
- El codigo fuente esta versionado en GitHub.
- Se genera APK o AAB para entrega del proyecto.
