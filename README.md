# Uku Pacha Frontend

Sitio web estatico de Uku Pacha para Vercel. Incluye paginas informativas, portafolio y formulario de cotizacion conectado al backend en Railway.

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla
- Font Awesome
- Vercel

## Estructura

```text
impactprint-frontend/
├── img/
├── servicios/
├── index.html
├── portafolio.html
├── style.css
└── script.js
```

## Backend configurado

El formulario envia solicitudes a:

```text
https://ukupacha-backend-production.up.railway.app/api/cotizaciones
```

En desarrollo local, si el sitio se abre desde `localhost` o `127.0.0.1`, usara:

```text
http://localhost:3000/api/cotizaciones
```

## Desarrollo local

Puedes abrir `index.html` directamente o usar una extension tipo Live Server.

## Deploy en Vercel

1. Sube esta carpeta a GitHub.
2. Importa el proyecto en Vercel.
3. Framework Preset: `Other`.
4. Build Command: vacio.
5. Output Directory: vacio o raiz del proyecto.
6. Verifica que el dominio final este configurado en `FRONTEND_URL` del backend en Railway.

## Notas de integracion

- El formulario valida campos antes de enviar.
- El frontend tolera respuestas no JSON del backend o del proxy.
- Al recibir `whatsappUrl`, abre WhatsApp en una nueva pestana.
- No requiere variables de entorno en Vercel mientras se use la URL actual del backend.
