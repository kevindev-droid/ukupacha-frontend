# Uku Pacha — Frontend

Sitio web de **Uku Pacha Diseño y Publicidad**. Construido con HTML, CSS y JavaScript puro.

## Tecnologías
- HTML5
- CSS3
- JavaScript vanilla
- Font Awesome (iconos)
- Live Server (desarrollo local)

## Estructura del proyecto

impactprint-frontend/
├── img/                  # Imágenes y logos
├── servicios/            # Páginas individuales de cada servicio
│   ├── vinilos.html
│   ├── banners.html
│   ├── mural.html
│   ├── gran-formato.html
│   ├── rotulacion.html
│   └── senaletica.html
├── index.html            # Página principal
├── portafolio.html       # Página de portafolio
├── style.css             # Estilos globales
└── script.js             # Lógica del frontend

## Páginas
- **Inicio** — Hero con carrusel animado, servicios, clientes, proceso y formulario de cotización
- **Portafolio** — Galería de trabajos con filtros por categoría
- **Servicios** — Página detallada por cada servicio ofrecido

## Conexión con el backend
El formulario de cotización se conecta al backend en `http://localhost:3000/api/cotizaciones`. Para producción actualizar la URL en `script.js`.

## Cómo visualizar
1. Abre la carpeta en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona **Open with Live Server**

## Notas
- Los espacios marcados como "Foto real del proyecto" deben reemplazarse con imágenes reales del cliente
- Los datos de contacto en el footer deben actualizarse con la información real