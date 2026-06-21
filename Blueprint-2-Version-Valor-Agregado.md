# Blueprint 2: Version con valor agregado

## Proyecto

**Nombre de la app:** Force Runner

**Plataforma:** Android

**Tecnologias base:** Java + Groovy

**Base cloud principal:** Supabase en plan gratuito.

## Objetivo

Agregar funciones sociales a Force Runner para que los corredores puedan interactuar, motivarse, competir entre amigos y recibir notificaciones sobre la actividad de otros usuarios.

## Base necesaria

Este blueprint depende de la version minima entregable, especialmente:

- Usuario registrado
- Perfil completo
- Carreras guardadas
- Historial
- Estadisticas
- Ranking basico
- API REST
- SQLite
- Base de datos remota

## Sistema de amigos

La app permitira:

- Buscar usuarios por nombre.
- Buscar usuarios por correo.
- Buscar usuarios por telefono.
- Ver corredores del mismo pais.
- Enviar solicitud de amistad.
- Aceptar solicitud.
- Rechazar solicitud.
- Eliminar amigo.

## Solicitudes de amistad

Estados:

- Pendiente
- Aceptada
- Rechazada
- Eliminada

Reglas:

- Si esta pendiente, el usuario receptor puede aceptar o rechazar.
- Si se acepta, ambos usuarios aparecen como amigos.
- Si se rechaza, no se agregan como amigos.
- Si se elimina, deja de aparecer como amigo.

## Actividad de amigos

La actividad mostrara eventos como:

- "Carlos comenzo a correr"
- "Ana finalizo su carrera"
- "Luis completo 5 km"
- "Maria subio de posicion en el ranking"
- "Jose recibio una reaccion"

Cada actividad mostrara:

- Foto del amigo
- Nombre del amigo
- Tipo de actividad
- Hora aproximada del evento
- Indicador de estado en linea o activo

## Estado "comenzo a correr"

Funcionamiento:

- Se activa cuando el usuario inicia una carrera.
- Los amigos ven que el usuario comenzo a correr.
- Se mantiene mientras la carrera este activa.
- Al finalizar o descartar la carrera, cambia a "dejo de correr".

Puede mostrarse en:

- Dashboard
- Actividad de amigos
- Perfil del usuario
- Notificaciones

## Notificaciones a amigos

Force Runner enviara notificaciones cuando:

- Un amigo comienza a correr.
- Un amigo deja de correr.
- Un amigo finaliza y guarda una carrera.
- Un amigo sube de posicion en el ranking.
- Alguien reacciona a una carrera.
- Llega una solicitud de amistad.
- Una solicitud de amistad es aceptada.
- Llega un mensaje de chat.

## Reacciones tipo Facebook

Force Runner tendra 6 reacciones:

- Fuego: Excelente rendimiento
- Brazo fuerte: Sigue fuerte
- Aplauso: Buen trabajo
- Corazon: Apoyo
- Sorpresa: Impresionante
- Trofeo: Campeon

Estas reacciones se podran usar en:

- Carreras
- Ranking
- Publicaciones de actividad

## Ver quien reacciono

Al tocar el contador de reacciones, se abre una pantalla/lista con:

- Foto del usuario que reacciono
- Nombre del usuario
- Tipo de reaccion
- Hora de la reaccion
- Carrera o publicacion relacionada

Tambien se mostrara el total por tipo de reaccion, por ejemplo:

- Fuego: 12
- Brazo fuerte: 8
- Aplauso: 5

## Chat entre amigos

El chat sera simple y solo entre amigos aceptados.

Permitira:

- Mensajes de texto
- Emojis basicos
- Hora del mensaje
- Estado: enviado / recibido
- Lista de conversaciones
- Notificacion al recibir mensaje

No incluira:

- Audios
- Imagenes
- Videos
- Llamadas

## Ranking completo con reacciones

El ranking funcionara asi:

- Ranking solo entre amigos.
- Filtros:
  - Este mes
  - Semana
  - Ano
- Ordenado por kilometros recorridos de mayor a menor.

Cada corredor mostrara:

- Posicion
- Foto
- Nombre
- Pais
- Kilometros del periodo
- Calorias quemadas
- Boton de reaccion
- Conteo de reacciones

## Base de datos remota

La base remota en Supabase PostgreSQL debe incluir:

- Amigos
- Solicitudes de amistad
- Actividad de amigos
- Reacciones
- Chat
- Notificaciones

## API REST de valor agregado

Modulos:

- Amigos
- Solicitudes
- Actividad social
- Reacciones
- Chat con Supabase Realtime
- Notificaciones
- Ranking social

La API REST de valor agregado se apoyara en Supabase REST API. Para datos en tiempo real, como chat y actividad social, se usara Supabase Realtime.

Servicios principales:

- Buscar usuarios.
- Enviar solicitud de amistad.
- Aceptar solicitud.
- Rechazar solicitud.
- Eliminar amigo.
- Consultar actividad de amigos.
- Notificar inicio de carrera.
- Notificar fin de carrera.
- Enviar reaccion.
- Cambiar reaccion.
- Ver quienes reaccionaron.
- Enviar mensaje.
- Consultar conversaciones.
- Consultar notificaciones.

## Servicios cloud de esta version

- Supabase PostgreSQL
- Supabase REST API
- Supabase Realtime
- Firebase Cloud Messaging
- GitHub para control de versiones y seguimiento del avance

## Reglas de negocio

- Solo amigos aceptados pueden chatear.
- Solo amigos aceptados pueden ver actividad social.
- El usuario solo puede reaccionar una vez por carrera o publicacion.
- El usuario puede cambiar su reaccion.
- Las carreras descartadas no generan actividad social publica.
- Las carreras descartadas no cuentan para ranking.
- El ranking se ordena por kilometros recorridos.
- El ranking mensual se reinicia cada mes.

## Criterio de finalizacion de esta version

Esta version se considera lista cuando:

- El usuario puede buscar amigos.
- El usuario puede enviar solicitudes.
- El usuario puede aceptar o rechazar solicitudes.
- Los amigos aparecen en la lista.
- La actividad de amigos se muestra correctamente.
- Se notifica cuando un amigo comienza a correr.
- Se notifica cuando un amigo deja de correr.
- Se pueden enviar reacciones.
- Se puede ver quien reacciono.
- El chat permite texto y emojis.
- El ranking muestra reacciones.
- Las notificaciones sociales llegan correctamente.
- La actividad social y el chat usan Supabase Realtime cuando aplique.
- Los tokens de dispositivos para notificaciones se guardan en Supabase.
