# Force Runner - Swagger UI

Esta carpeta contiene una pagina visual para consultar la documentacion de las APIs del proyecto.

## Archivos

```text
index.html
openapi.yaml
```

## Como abrirlo

Opcion recomendada para colaboradores:

1. Subir el proyecto a GitHub.
2. Activar GitHub Pages apuntando a la carpeta `docs`.
3. Abrir la URL publicada en:

```text
https://USUARIO.github.io/REPOSITORIO/swagger-ui/
```

## Como probar localmente

Desde la raiz del proyecto:

```powershell
python -m http.server 8080
```

Luego abrir:

```text
http://localhost:8080/docs/swagger-ui/
```

Nota: abrir `index.html` directamente con doble clic puede bloquear la carga de `openapi.yaml` en algunos navegadores. Por eso se recomienda usar un servidor local o GitHub Pages.
