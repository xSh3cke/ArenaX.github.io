# Arena X — web lista para GitHub Pages

Página promocional estática en HTML, CSS y JavaScript. Incluye el juego, el creador, Discord, redes sociales, seis idiomas, cinco temas y efectos VFX. Los recursos visuales y las fuentes son locales. No requiere compilación, npm install, claves ni servidor de pago.

## Publicar en GitHub

1. Descomprime este ZIP.
2. Crea un repositorio en GitHub, por ejemplo `arena-x-web`.
3. Usa **Add file → Upload files** y sube los archivos descomprimidos y la carpeta `assets`. `index.html` debe quedar en la raíz del repositorio; no subas únicamente el ZIP.
4. Guarda con **Commit changes**.
5. Abre **Settings → Pages → Build and deployment**.
6. En **Source**, elige **Deploy from a branch**. Selecciona **main** y **/(root)**, y pulsa **Save**.
7. Espera a que GitHub muestre la dirección de la web. Será similar a `https://TU_USUARIO.github.io/arena-x-web/`.

Los enlaces a archivos son relativos, por lo que la web funciona dentro de la carpeta de un repositorio de GitHub Pages. La entrega incluye `.nojekyll`. Para actualizar, edita los archivos en la rama publicada y guarda los cambios.

Documentación oficial: https://docs.github.com/es/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Enlaces ya configurados

| Destino | Enlace |
| --- | --- |
| Arena X en Roblox | https://www.roblox.com/es/games/121220795158723/Arena-X |
| Discord | https://discord.gg/4JzWcYacKF |
| TikTok del juego | https://www.tiktok.com/@roblox_arena_x |
| TikTok del creador | https://www.tiktok.com/@yxsus.57 |
| Instagram del creador | https://www.instagram.com/yxsvs.57/ |

El nombre visible del creador es **Yxsus**, tomado del usuario de TikTok. Puedes cambiarlo en `config.js`. Los botones de seguir abren el perfil correspondiente para que el visitante lo siga desde esa plataforma.

El botón de jugar abre dos opciones: **Abrir Roblox** usa `roblox://placeId=121220795158723`; **Ver en navegador** abre la página del juego. La primera opción depende de que Roblox esté instalado y de que el navegador permita abrir la aplicación. La página del juego queda disponible como alternativa. Los enlaces principales también funcionan si JavaScript está desactivado.

## Discord: en línea, offline y total

Servidor configurado: **1549515247612592378**. El ID está guardado como texto para evitar pérdida de precisión.

La web consulta la invitación pública con `with_counts=true`. Discord devuelve el total aproximado y los miembros aproximadamente en línea. La web calcula **offline = total − en línea** y muestra claramente que las cifras son aproximadas. Un estado invisible puede aparecer como offline; los contadores corresponden a miembros de Discord, no a jugadores dentro del juego.

Se actualizan cada dos minutos mientras la pestaña está visible. La web no utiliza un bot ni tokens. Si la invitación falla, consulta el widget público del servidor. El widget solo proporciona miembros en línea: en ese caso muestra `—` en offline y total, sin inventarlos. Si tampoco hay datos, aparece un aviso y el enlace para entrar en Discord sigue funcionando. Si ya existía una consulta correcta, conserva sus cifras y las identifica como pendientes de actualizar.

Para habilitar el respaldo del widget: **Discord → Ajustes del servidor → Widget → Habilitar widget del servidor**. Si cambias de servidor, modifica `discord.guildId`, `discord.inviteCode` y `links.discord` juntos. La invitación debe ser válida y los datos públicos deben estar disponibles. Un límite de peticiones de Discord aplaza la siguiente consulta.

Documentación: https://docs.discord.com/developers/resources/invite y https://docs.discord.com/developers/resources/guild#get-guild-widget

## Idiomas y temas

El selector ofrece **español, inglés, portugués, francés, alemán e italiano**. Traduce las secciones, el menú, los botones, los avisos, las preguntas frecuentes y los textos de Discord. Las traducciones están en `locales.js`.

El icono de paleta ofrece **rojo carmesí, azul medianoche, verde esmeralda, violeta y plata**. Cambia los fondos, botones, acentos y efectos. El arte promocional original conserva sus colores. Las paletas están al comienzo de `themes-effects.css`.

Las preferencias se guardan en el navegador mediante `localStorage`. Si el almacenamiento no está disponible, los controles siguen funcionando durante la visita. Los valores iniciales se cambian con `defaultLanguage` y `defaultTheme` en `config.js`.

## Animaciones y personalización

Incluye partículas, una línea de energía, brillo en las tarjetas, entradas suaves al desplazarse, una barra de progreso de lectura y una ligera profundidad de la imagen en escritorio. No reproduce sonidos. Respeta la preferencia del dispositivo de reducir movimiento. Para desactivar los VFX, cambia `effects.enabled` a `false`; `effects.particles` controla las partículas (máximo 24). La barra de progreso seguirá indicando la posición de lectura, sin animación.

Edita `config.js` para cambiar el nombre del juego, creador, iniciales, textos principales en español, imágenes y enlaces. Si cambias esos textos, actualiza también las otras traducciones en `locales.js`. Los textos de configuración se insertan como texto, no como HTML. No incluyas contraseñas, claves ni tokens: todos estos archivos serán públicos.

## Imagen del hero

La imagen es una **ilustración promocional original generada con IA**, no una captura real de Arena X. Para reemplazarla por una captura tuya, guarda la imagen en `assets` y cambia `hero.image`, `hero.mobileImage` y `hero.imageAlt` en `config.js`. Actualiza también `hero.alt` en las traducciones. Se recomienda una imagen horizontal 16:9 con el personaje o punto de interés hacia la derecha.

## Ver la web en tu computadora

Abre `index.html` en Chrome, Edge o Firefox. Mantén todos los archivos junto a la carpeta `assets`. Para comprobar los contadores de Discord, utiliza un servidor HTTP o GitHub Pages; algunos navegadores limitan las consultas al abrir archivos locales.

Si tienes Node.js, ejecuta `npm run dev` en la carpeta y visita la dirección que indica. El servidor es opcional, no necesita instalar dependencias y no se usa en GitHub Pages.

Con Node.js puedes ejecutar `npm test` para verificar los contadores, la validación del servidor y las respuestas de respaldo de Discord.

## Archivos

| Archivo | Función |
| --- | --- |
| `index.html` | Estructura, secciones y enlaces de respaldo |
| `styles.css` | Diseño base y adaptación a pantalla |
| `themes-effects.css` | Cinco paletas, controles, Discord y animaciones |
| `config.js` | Configuración del juego, creador, enlaces y servidor |
| `locales.js` | 100 textos por idioma, en seis idiomas |
| `script.js` | Preferencias, menú, opciones para jugar y actualización de Discord |
| `discord-stats.js` | Consulta y validación de contadores públicos |
| `effects.js` | Partículas, desplazamiento, brillo y profundidad |
| `assets/` | Imágenes, fuentes y licencia de las fuentes |
| `preview.mjs` y `package.json` | Servidor local opcional sin dependencias |
| `tests/discord.test.cjs` | Pruebas de la lógica de contadores de Discord |
| `.nojekyll` | Publicación estática en GitHub Pages |

Las fuentes Nimbus pertenecen al paquete URW Base 35; su licencia está en `assets/fonts/LICENSE.txt`. Roblox y las redes sociales conservan sus respectivas marcas.
