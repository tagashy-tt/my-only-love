# Para Lucy

Una página dedicada a Lucía (Lucy) en español, portugués y japonés.
Sin dependencias ni paso de compilación: son tres archivos.

```
index.html   estructura y textos de la carta
style.css    todo el diseño (colores en las variables de :root)
script.js    cielo animado, constelación, idiomas y easter eggs
```

## Verla en tu computadora

Abre `index.html` en el navegador. Si prefieres un servidor local:

```
npx serve .
```

Las fuentes vienen de Google Fonts, así que hace falta internet la primera vez.

## Publicarla gratis con GitHub Pages

1. Crea el repositorio y sube estos archivos a la rama `main`.
2. En el repositorio: **Settings → Pages**.
3. En "Build and deployment" elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Espera un minuto. El enlace aparece en esa misma pantalla.

## Lo que tienes que personalizar

- **Fecha juntos**: en `script.js`, dentro de `CONFIG`, escribe la fecha, por ejemplo
  `since: "2025-02-14T00:00:00"`. Aparece un contador de días, horas, minutos y segundos.
  Si lo dejas vacío, esa sección no se muestra.
- **Textos**: la carta está en `index.html` (una sección por idioma). Las razones, los
  deseos y los textos sueltos están en el objeto `dict` de `script.js`.
- **Colores**: en `style.css`, bloque `:root` (modo noche) y `:root[data-mode="dawn"]` (amanecer).

## Qué tiene

- Selector de idioma (la dirección cambia a `#es`, `#pt` o `#ja`) y modo noche / amanecer.
- Saludo según la hora, barra de progreso al hacer scroll y luz que sigue el cursor o el dedo.
- Constelación con forma de corazón: se enciende estrella por estrella.
- "Una razón" (12 razones al azar) y "Un deseo" (8 deseos con estrella fugaz).
- Tu nombre en tres idiomas: tocar un nombre cambia la carta a ese idioma.

## Easter eggs

| Qué hacer | Qué pasa |
|---|---|
| Tocar el orbe de luz | La palabra cambia: luz → lux → 光 → ひかり, con un dato de su origen |
| Tocar "Lucy" en grande | El nombre cambia: Lucy → Lucía → Lúcia → ルシア |
| Escribir `lucy` en el teclado | Lluvia de corazones |
| Código Konami: ↑ ↑ ↓ ↓ ← → ← → B A | Lluvia de corazones |
| Completar la constelación y tocar el corazón | El corazón late |
| Tocar cualquier parte de la pantalla | Destellos de luz |
| La estrellita al final de la página | Se abre una posdata secreta |
| Abrir la consola del navegador | Un mensaje escondido con pistas |
