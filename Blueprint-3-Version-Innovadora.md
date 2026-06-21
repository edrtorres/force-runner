# Blueprint 3: Version innovadora

## Proyecto

**Nombre de la app:** Force Runner

**Plataforma:** Android

**Tecnologias base:** Java + Groovy

**Base cloud principal:** Supabase en plan gratuito.

## Objetivo

Agregar funciones innovadoras a Force Runner mediante un Coach IA, consultas por texto y voz, recomendaciones personalizadas y soporte de temas Light/Dark.

## Base necesaria

Este blueprint depende de:

- Registro completo
- Perfil con edad y peso
- Historial de carreras
- Estadisticas
- Calorias quemadas
- Ritmo promedio
- API REST
- Base de datos remota

## Coach IA

El Coach IA sera un asistente de consejos, motivacion y consultas utiles.

Funciones:

- Dar frases motivacionales despues de correr.
- Recomendar mejoras segun el historial.
- Mostrar consejos simples segun rendimiento.
- Permitir preguntas por texto.
- Permitir preguntas por voz.
- Responder consultas utiles para el corredor.

## Preguntas por texto

El usuario podra escribir preguntas como:

- Cuanto debo correr para quemar 500 calorias?
- Cuantos kilometros necesito para mejorar mi promedio?
- Que dia me conviene correr esta semana?
- Como voy comparado con la semana pasada?
- Cuantas calorias puedo quemar en 30 minutos?

## Preguntas por voz

El usuario podra hacer preguntas por voz al Coach IA.

Flujo:

1. El usuario toca el boton de voz.
2. La app activa reconocimiento de voz.
3. Convierte la voz en texto.
4. Envia la pregunta al Coach IA.
5. Muestra la respuesta en pantalla.
6. Opcionalmente puede leer la respuesta en voz alta.

## Datos usados por el Coach IA

El Coach IA debe usar:

- Peso del usuario
- Edad del usuario
- Historial de carreras
- Ritmo promedio
- Tiempo disponible
- Calorias objetivo
- Kilometros recorridos
- Comparacion semanal
- Comparacion mensual

## Recomendaciones personalizadas

El Coach IA podra recomendar:

- Cuanto correr para quemar cierta cantidad de calorias.
- Como mejorar el ritmo.
- Si conviene correr mas distancia o mas tiempo.
- Si el usuario esta mejorando respecto a semanas anteriores.
- Consejos de hidratacion y recuperacion.
- Motivacion despues de finalizar una carrera.

## Calorias objetivo

Funcion esperada:

- El usuario pregunta cuantas calorias quiere quemar.
- La app usa el peso del usuario y su historial.
- El Coach IA estima tiempo o distancia aproximada.
- La respuesta debe aclarar que es una estimacion.

Ejemplo:

"Para quemar aproximadamente 500 calorias, podrias correr cerca de 45 a 55 minutos segun tu peso y ritmo promedio."

## Motivacion automatica

Despues de una carrera, el Coach IA puede mostrar mensajes como:

- Hoy corriste mas que la semana pasada.
- Buen ritmo, intenta mantenerlo en tu proxima carrera.
- Recuerda hidratarte antes y despues de correr.
- Vas mejorando tu distancia mensual.

## Temas Light/Dark

Force Runner tendra soporte para dos temas:

- Tema Light: por defecto.
- Tema Dark: disponible como opcion para el usuario.

Reglas:

- La app inicia en tema Light.
- El usuario puede cambiar a tema Dark desde configuracion o perfil.
- La preferencia se guarda localmente.
- La preferencia puede sincronizarse con la cuenta.

## Diseno visual

Estilo general:

- Diseno deportivo.
- Color principal verde.
- Botones de accion en verde.
- Iconos deportivos y sociales.
- Tarjetas limpias y legibles.
- Mapas con rutas destacadas.
- Identidad visual con el nombre Force Runner.
- Splash screen con logo o imagen de corredor.

## API REST innovadora

Modulos:

- Coach IA
- Consultas por texto
- Consultas por voz
- Recomendaciones
- Preferencias de tema

La logica innovadora puede apoyarse en Supabase REST API y, si se necesita proteger claves privadas, en Supabase Edge Functions.

Servicios principales:

- Enviar pregunta al Coach IA.
- Obtener respuesta del Coach IA.
- Consultar recomendaciones segun historial.
- Guardar preferencias de tema.
- Consultar preferencias de tema.

## Servicios cloud de esta version

- Supabase PostgreSQL
- Supabase REST API
- Supabase Edge Functions si se requieren claves privadas
- Google AI Studio / Gemini API
- Servicios de voz de Android o Google Cloud Speech-to-Text
- Android Text-to-Speech o Google Cloud Text-to-Speech
- GitHub para versionamiento y despliegues del APK/AAB

## Reglas de negocio

- El Coach IA debe usar datos reales del perfil y del historial cuando esten disponibles.
- Si no hay suficiente historial, debe dar recomendaciones generales.
- Las calorias estimadas deben mostrarse como aproximadas.
- Las preguntas por voz deben convertirse a texto antes de procesarse.
- El tema Light sera el predeterminado.
- El cambio de tema debe aplicarse sin afectar los datos del usuario.

## Criterio de finalizacion de esta version

Esta version se considera lista cuando:

- El usuario puede abrir el Coach IA.
- El usuario puede hacer preguntas por texto.
- El usuario puede hacer preguntas por voz.
- El Coach IA responde preguntas utiles.
- El Coach IA usa peso, historial, ritmo y calorias objetivo.
- La app puede estimar cuanto correr para quemar cierta cantidad de calorias.
- La app muestra motivacion despues de correr.
- La app permite cambiar entre tema Light y Dark.
- El tema Light aparece por defecto.
- La preferencia de tema se mantiene guardada.
- Las claves del Coach IA no quedan expuestas dentro de la app si se usa una funcion intermedia.
