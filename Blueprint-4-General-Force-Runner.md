# Blueprint 4: Blueprint general de Force Runner

## Nombre oficial

**Force Runner**

## Plataforma

Android.

## Tecnologias

- Java
- Groovy
- Android Studio
- SQLite
- Supabase PostgreSQL
- Supabase REST API
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Firebase Cloud Messaging
- Google Maps Platform
- Google AI Studio / Gemini API
- GitHub

## Principios tecnicos obligatorios

El desarrollo de Force Runner usara:

- Clean Code
- Principios SOLID
- Clean Architecture

Capas principales:

- Presentation: Activities, Fragments, ViewModels, estados de UI y adaptadores.
- Domain: entidades, casos de uso, reglas de negocio e interfaces de repositorios.
- Data: Supabase, SQLite, Firebase FCM, Google Maps, Gemini, DTOs, mappers y data sources.
- Core/Common: constantes, validadores, manejo de errores y utilidades compartidas.

Regla principal:

- La interfaz de usuario no debe conectarse directamente a Supabase, SQLite, Firebase, Google Maps ni Gemini.
- La UI llama al ViewModel.
- El ViewModel llama casos de uso.
- Los casos de uso dependen de repositorios.
- Los repositorios deciden si usan SQLite, Supabase u otro servicio.

## Metodologia agil obligatoria

El proyecto usara Scrum simplificado con tablero Kanban.

Elementos obligatorios:

- Product Backlog
- Sprints
- Sprint Planning
- Sprint Review
- Sprint Retrospective
- Tablero Kanban

Columnas del tablero:

- Pendiente
- En progreso
- En pruebas
- Terminado

## Equipo y roles

Product Owner:

- EDWIN RENE TORRES HERNANDEZ

Scrum Master:

- EDWIN RENE TORRES HERNANDEZ

Equipo de desarrollo:

- ASTRID LIZBETH CASTELLANOS PINEDA
- EDWIN RENE TORRES HERNANDEZ
- JOSUE ELIAS DURON MIGUEL
- MICHELLE ALEJANDRA PERDOMO RAMOS

Todos los colaboradores forman parte del equipo de desarrollo.

## Objetivo principal

Force Runner tiene como objetivo registrar, medir y analizar recorridos de corredores mediante GPS, permitiendo guardar historial, consultar estadisticas, competir en rankings de amigos y motivar la actividad fisica mediante funciones sociales.

## Tipo de usuario

Por el momento habra un solo tipo de usuario:

- Usuario corredor

No se incluye administrador en la primera version.

## Pantallas identificadas

1. Splash Screen
2. Login
3. Registro / darse de alta
4. Recuperar contrasena
5. Verificacion de correo
6. Restablecer contrasena
7. Inicio / Dashboard
8. Iniciar carrera GPS
9. Carrera en progreso
10. Resumen de carrera
11. Historial de carreras
12. Estadisticas
13. Amigos
14. Estado: comenzo a correr
15. Chat entre amigos
16. Ranking de amigos
17. Reacciones en ranking
18. Quien reacciono
19. Notificacion a amigos

## Registro obligatorio

El registro debe pedir:

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

Toda la informacion es obligatoria.

Al aceptar terminos y condiciones se debe guardar:

- acepta_terminos
- fecha_aceptacion_terminos
- version_terminos

## Login

El usuario podra iniciar sesion con:

- Correo electronico registrado + contrasena
- Telefono registrado + contrasena

## Verificacion de cuenta

- Codigo de 6 digitos enviado al correo electronico.
- Opcion de reenviar codigo.
- Cuenta activa solo despues de verificar.

## Recuperacion de contrasena

El usuario puede recuperar su contrasena usando correo o telefono registrado. El sistema envia un codigo al correo registrado y luego permite crear una nueva contrasena.

## Perfil del usuario

Mostrara:

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
- Editar perfil
- Cerrar sesion

## Permisos Android

- Internet
- Ubicacion/GPS
- Notificaciones
- Camara
- Galeria o almacenamiento de imagenes

## Dashboard

Mostrara:

- Saludo con nombre del usuario
- Foto pequena
- Resumen semanal
- Distancia recorrida
- Tiempo total
- Calorias quemadas
- Accesos rapidos a carrera, historial, estadisticas y ranking
- Actividad reciente de amigos

## Navegacion principal

Menu inferior:

- Inicio
- Carreras
- Amigos
- Chat
- Perfil

Accesos secundarios:

- Ranking desde Amigos o Inicio
- Estadisticas desde Carreras o Inicio
- Historial desde Carreras
- Coach IA desde Inicio o Perfil
- Configuracion desde Perfil

## Carreras GPS

La app permitira:

- Verificar permisos de ubicacion.
- Verificar GPS activo.
- Mostrar mapa.
- Iniciar carrera.
- Medir tiempo, distancia, ritmo y calorias.
- Pausar, continuar y finalizar.
- Mostrar ruta en vivo.
- Guardar o descartar carrera.
- Notificar a amigos cuando comenzo a correr.
- Notificar a amigos cuando dejo de correr.

## Historial y detalle

El historial tendra filtros:

- Todas
- Semana
- Mes
- Ano

Cada carrera mostrara:

- Mapa pequeno
- Distancia
- Fecha
- Ritmo promedio
- Tiempo total
- Calorias quemadas

El detalle mostrara:

- Mapa completo
- Distancia total
- Tiempo total
- Ritmo promedio
- Calorias quemadas
- Fecha y hora
- Estado emocional
- Reacciones recibidas
- Boton para compartir o publicar

## Estadisticas

Incluira:

- Distancia total
- Tiempo total
- Calorias totales
- Kilometros por semana
- Kilometros por mes
- Promedio de ritmo
- Cantidad de carreras
- Semana actual vs semana anterior
- Mes actual vs mes anterior
- Filtros: Resumen, Mensual, Anual

## Ranking

El ranking sera solo entre amigos.

Filtros:

- Este mes
- Semana
- Ano

Cada corredor mostrara:

- Posicion
- Foto
- Nombre
- Pais
- Kilometros del periodo
- Calorias quemadas
- Boton de reaccion

Orden:

- De mayor a menor kilometros recorridos.

## Amigos

Funciones:

- Buscar usuarios por nombre
- Buscar usuarios por correo
- Buscar usuarios por telefono
- Ver corredores del mismo pais
- Enviar solicitud
- Aceptar solicitud
- Rechazar solicitud
- Eliminar amigo

Estados de solicitud:

- Pendiente
- Aceptada
- Rechazada
- Eliminada

## Actividad social

Eventos:

- Comenzo a correr
- Dejo de correr
- Finalizo carrera
- Completo cierta distancia
- Subio en ranking
- Recibio una reaccion

## Notificaciones

La app notificara cuando:

- Un amigo comienza a correr.
- Un amigo deja de correr.
- Un amigo finaliza y guarda una carrera.
- Un amigo sube de posicion en el ranking.
- Alguien reacciona a una carrera.
- Llega una solicitud de amistad.
- Una solicitud de amistad es aceptada.
- Llega un mensaje de chat.

## Reacciones

Reacciones disponibles:

- Fuego: Excelente rendimiento
- Brazo fuerte: Sigue fuerte
- Aplauso: Buen trabajo
- Corazon: Apoyo
- Sorpresa: Impresionante
- Trofeo: Campeon

## Ver quien reacciono

Debe mostrar:

- Foto del usuario
- Nombre
- Tipo de reaccion
- Hora
- Carrera o publicacion relacionada
- Total por tipo de reaccion

## Chat

Chat simple entre amigos aceptados.

Incluye:

- Mensajes de texto
- Emojis basicos
- Hora del mensaje
- Estado enviado / recibido
- Lista de conversaciones
- Notificacion al recibir mensaje

No incluye:

- Audios
- Imagenes
- Videos
- Llamadas

## Coach IA

Funciones:

- Consejos motivacionales.
- Preguntas por texto.
- Preguntas por voz.
- Recomendaciones con historial.
- Calculo aproximado para quemar cierta cantidad de calorias.
- Comparaciones de rendimiento.

Datos usados:

- Peso
- Edad
- Historial
- Ritmo promedio
- Tiempo disponible
- Calorias objetivo

## Temas

La app tendra:

- Tema Light por defecto.
- Tema Dark opcional.

El usuario podra cambiarlo desde configuracion o perfil.

## Base de datos local

SQLite guardara:

- Sesion
- Usuario activo
- Carreras recientes
- Historial temporal
- Estado de sincronizacion
- Preferencias
- Datos pendientes de subir

## Base de datos remota

Supabase PostgreSQL guardara:

- Usuarios
- Perfiles
- Carreras
- Rutas GPS
- Historial
- Estadisticas
- Amigos
- Solicitudes
- Ranking
- Reacciones
- Chat
- Notificaciones
- Datos para Coach IA

## API REST

Modulos:

- Supabase Auth
- Usuarios/perfil
- Carreras
- Estadisticas
- Amigos
- Ranking
- Reacciones
- Chat
- Notificaciones
- Coach IA
- Sincronizacion

La API REST principal sera la API REST automatica de Supabase.

## Servicios en la nube confirmados

1. Supabase PostgreSQL
2. Supabase REST API
3. Supabase Auth
4. Supabase Storage
5. Supabase Realtime
6. Firebase Cloud Messaging
7. Supabase Auth Email o Brevo SMTP
8. Google Maps Platform
9. Google AI Studio / Gemini API
10. Android Voice Services o Google Cloud Speech-to-Text + Text-to-Speech

## GitHub y despliegues

GitHub se usara para:

- Guardar el codigo fuente.
- Controlar versiones.
- Trabajar con ramas.
- Tener historial de cambios.
- Crear README del proyecto.
- Entregar repositorio al catedratico.
- Publicar APK/AAB en GitHub Releases si aplica.

Despliegues previstos:

- Supabase: base de datos, REST API, Auth, Storage y Realtime.
- Firebase: configuracion de Firebase Cloud Messaging.
- Google Cloud/Google AI: mapas, voz y Coach IA.
- Android Studio: generacion de APK o AAB.
- GitHub Releases o plataforma del catedratico: entrega del APK/AAB.

## Reglas de negocio

- No se puede registrar correo repetido.
- No se puede registrar telefono repetido.
- La contrasena debe cumplir minimo de seguridad.
- No se puede iniciar carrera sin GPS activo.
- No se puede guardar carrera con 0 km.
- No se puede guardar carrera sin tiempo registrado.
- El usuario solo puede reaccionar una vez por carrera o publicacion.
- El usuario puede cambiar su reaccion.
- El ranking se ordena por kilometros recorridos.
- El ranking mensual se reinicia cada mes.
- Solo amigos aceptados pueden chatear.
- Solo amigos aceptados pueden ver actividad social.
- Las carreras descartadas no cuentan para estadisticas ni ranking.
- Si no hay internet, la carrera se guarda localmente y se sincroniza despues.

## Validaciones

- Nombre obligatorio.
- Edad obligatoria y valida.
- Peso obligatorio y valido.
- Correo obligatorio con formato valido.
- Telefono obligatorio con formato valido.
- Pais obligatorio.
- Foto obligatoria.
- Contrasena obligatoria con minimo 8 caracteres.
- Confirmar contrasena debe coincidir.
- Aceptar terminos obligatorio.
- Guardar fecha y version de terminos aceptados.
- Codigo de verificacion obligatorio de 6 digitos.
- Distancia mayor a 0.
- Tiempo mayor a 0.
- Calorias no negativas.
- Mensaje de chat no vacio.
- Reaccion dentro de las 6 permitidas.

## Modo sin internet

Permite:

- Iniciar y finalizar carrera usando GPS.
- Guardar carrera en SQLite.
- Marcar carrera como pendiente de sincronizar.
- Mostrar historial local reciente.
- Mantener sesion si ya habia sesion guardada.
- Sincronizar automaticamente cuando vuelva internet.

No permite:

- Login nuevo si no hay sesion guardada.
- Ranking en tiempo real.
- Chat.
- Amigos.
- Reacciones en tiempo real.

## Fases del proyecto

### Blueprint 1: Version minima entregable

Incluye las funciones obligatorias necesarias para que la app sea funcional y presentable.

### Blueprint 2: Version con valor agregado

Incluye funciones sociales: amigos, actividad, notificaciones, reacciones y chat.

### Blueprint 3: Version innovadora

Incluye Coach IA, preguntas por texto y voz, recomendaciones personalizadas y temas Light/Dark.

## Criterios generales para considerar terminado el proyecto

El proyecto se considera terminado cuando:

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
- Las carreras guardadas aparecen en el historial.
- Las estadisticas se calculan correctamente.
- El ranking ordena a los amigos por kilometros.
- Los datos se guardan en SQLite y en la base remota.
- La app sincroniza datos pendientes cuando vuelve internet.
- Amigos, reacciones, chat y notificaciones funcionan si estan dentro del alcance entregado.
- El Coach IA responde preguntas por texto y voz si se incluye en la version innovadora.
- La app respeta tema Light por defecto y permite Dark.
- No hay errores criticos en navegacion, login, GPS ni guardado de datos.
- El codigo fuente esta en GitHub.
- El proyecto aplica Clean Code, SOLID y Clean Architecture.
- El proyecto evidencia metodologia agil con backlog, sprints y tablero Kanban.
- El APK o AAB esta generado para entrega.
