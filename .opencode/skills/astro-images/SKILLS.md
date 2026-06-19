# Astro Images (astro:assets)

## Regla de oro

**Nunca usar `<img>` plano para imágenes locales.** Siempre usar `<Image>` o `<Picture>` de `astro:assets` para obtener optimización automática (WebP/AVIF, lazy loading, dimensiones, CLS prevention).

## Componente Image (caso más común)

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg'; // Importación local tipada
---

<!-- Imagen local: width y height son opcionales (Astro los infiere) -->
<Image
  src={heroImage}
  alt="Descripción descriptiva obligatoria"
  width={800}
  height={450}
  format="webp"
  quality={80}
  loading="lazy"   <!-- "eager" solo para LCP (imagen above-the-fold) -->
/>

<!-- Imagen remota: width y height son OBLIGATORIOS -->
<Image
  src="https://ejemplo.com/foto.jpg"
  alt="Foto de ejemplo"
  width={600}
  height={400}
/>
```

## Componente Picture (múltiples formatos/tamaños)

```astro
---
import { Picture } from 'astro:assets';
import hero from '../assets/hero.jpg';
---

<!-- Genera <picture> con múltiples sources automáticamente -->
<Picture
  src={hero}
  formats={['avif', 'webp']}
  alt="Hero de la página"
  widths={[400, 800, 1200]}
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
/>
```

## Imágenes en Content Collections

```typescript
// src/content/config.ts — usar el helper image() del schema
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image(), // Habilita optimización automática para esta imagen
    coverAlt: z.string(),
  }),
});
```

```astro
---
import { Image } from 'astro:assets';
const { post } = Astro.props;
---
<Image src={post.data.cover} alt={post.data.coverAlt} width={1200} height={630} />
```

## Dónde poner las imágenes

| Ubicación | Optimización | Cuándo usarla |
|---|---|---|
| `src/assets/` | ✅ Automática | Imágenes del sitio: hero, ilustraciones, fotos de contenido |
| `public/` | ❌ Sin optimización | Favicons, og:image, imágenes referenciadas por URL fija |
| `src/content/*/` | ✅ Con `image()` helper | Imágenes de colecciones de contenido |

## Imágenes en public/ (sin optimización)

```astro
<!-- Solo para casos donde se necesita URL fija: og:image, favicons -->
<img src="/og-default.jpg" alt="" width="1200" height="630" />
```

## getImage() — generar URL programáticamente

```typescript
---
// Para meta tags og:image u otros casos donde necesitas la URL procesada
import { getImage } from 'astro:assets';
import ogImage from '../assets/og-default.jpg';

const optimizedOg = await getImage({
  src: ogImage,
  width: 1200,
  height: 630,
  format: 'jpg',
});
---
<meta property="og:image" content={optimizedOg.src} />
```

## Dominos remotos permitidos (astro.config.mjs)

```javascript
// Si usas imágenes de dominios externos
export default defineConfig({
  image: {
    domains: ['images.unsplash.com', 'cdn.sanity.io'],
    // O usar remotePatterns para más control:
    remotePatterns: [{ protocol: 'https', hostname: '**.cloudinary.com' }],
  },
});
```

## Anti-patrones

- ❌ No usar `<img src="../../assets/foto.jpg">` — sin optimización ni tipado
- ❌ No poner `loading="eager"` en todas las imágenes — solo en la imagen LCP (above-the-fold)
- ❌ No omitir `alt` — es obligatorio; usar `alt=""` solo para imágenes decorativas
- ❌ No importar imágenes grandes en `public/` si van a usarse en el contenido
- ✅ Dar preferencia a `format="webp"` para fotos, `format="svg"` para logos e iconos
- ✅ Especificar `widths` y `sizes` en `<Picture>` para imágenes responsivas