# Radio Power 90.9 - Sitio Web Oficial & Multimedia

Landing page oficial de **Radio Power 90.9 FM**, diseñada con estética broadcast studio moderna, reproductor de streaming en vivo por YouTube, espacio para pauta comercial B2B y cotizador directo vía WhatsApp.

## 🚀 Características
- **Identidad Visual:** Inspirada en el logotipo oficial (esfera azul eléctrica, destellos neón y acento curvo rojo vibrante).
- **Enfoque de Expansión:** Posicionamiento como plataforma multimedia regional de alto impacto, combinando más de 30 años de trayectoria (desde 1993) con emisión digital sin fronteras.
- **Reproductor YouTube Live:** Contenedor adaptativo 16:9 con vúmetro animado y estado "EN EL AIRE".
- **Espacio Comercial:** Sección dedicada para marcas y comercios locales con desglose de pauta en FM, pauta digital/streaming y plan integral 360°.
- **Conversión Directa:** Botones y floating action button conectados a WhatsApp con mensajes preconfigurados para facilitar la consulta comercial.
- **Tecnología:** HTML5 semántico, Tailwind CSS CDN (sin dependencias complejas de build) y Google Fonts (*Montserrat* + *Plus Jakarta Sans*).

## 📁 Estructura de Archivos
```text
├── index.html       # Archivo principal de la web
├── README.md        # Documentación del proyecto
├── .gitignore       # Configuración de exclusiones Git
└── assets/          # Directorio para imágenes y logos
```

## 🌐 Cómo desplegar en GitHub Pages
1. Creá un nuevo repositorio en GitHub (ej: `radio-power-909`).
2. Subí los archivos del proyecto (`index.html`, `README.md`, `.gitignore`, carpeta `assets/`).
3. En GitHub, andá a **Settings** > **Pages**.
4. En **Build and deployment**, seleccioná la rama `main` (o `master`) y la carpeta `/ (root)`.
5. Guardá los cambios. En unos segundos tu web estará en línea con HTTPS.

## ⚡ Despliegue en Vercel o Netlify
- Simplemente conectá tu repositorio de GitHub en Vercel o Netlify. Al ser un sitio estático puro, se publicará de manera instantánea sin requerir pasos de compilación.

## ⚙️ Personalización
- **Cambiar enlace de YouTube:** En `index.html`, buscá la etiqueta `<iframe>` y reemplazá el atributo `src` con el ID de tu transmisión o video en vivo:
  ```html
  src="https://www.youtube.com/embed/TU_VIDEO_ID?autoplay=0&rel=0"
  ```
- **Cambiar número de WhatsApp:** Reemplazá el número `541141976436` por tu número comercial en formato internacional (sin signos `+` ni guiones).
