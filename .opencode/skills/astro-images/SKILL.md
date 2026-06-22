---
name: astro-images
description: Use when adding, displaying or optimizing images in this project. Covers public/ product images, src/assets/ imports, and the difference between JSON collection images vs markdown frontmatter images.
---

# Imágenes — morosviejos

## Dónde poner las imágenes

| Ubicación | Optimización | Cuándo usarla |
|---|---|---|
| `src/assets/` | ✅ Con `<Image>` de astro:assets | Imágenes del sitio: hero, fotos de contenido |
| `public/` | ❌ Sin optimización | Favicons, og:image, imágenes de productos |
| `src/content/noticias/` | ✅ Con helper `image()` | Portadas de noticias en frontmatter markdown |

## Imágenes de productos (colección JSON)

Los productos usan `imagen: z.string().optional()` apuntando a una ruta de `public/`:

```json
{ "imagen": "/productos/camiseta.svg" }
```

Los placeholders SVG están en `public/productos/`. Para reemplazar por una foto real:
1. Copiar `camiseta.jpg` a `public/productos/`.
2. Actualizar el JSON: `"imagen": "/productos/camiseta.jpg"`.

En `ProductoCard.astro`, renderizar con `<img>` plain (no `<Image>`) ya que la ruta es de `public/`:

```astro
{imagen ? (
  <img
    src={imagen}
    alt={nombre}
    class="producto-card__foto"
    loading="lazy"
    decoding="async"
  />
) : (
  <svg><!-- fallback --></svg>
)}
```

**No usar** el helper `image()` del schema para colecciones JSON — ese helper espera una importación de archivo, no una ruta de `public/`.

## Imágenes de noticias (colección markdown)

La portada de noticias es `cover: z.string().optional()` en el schema — también una ruta de `public/` o URL, no una importación. Usar `<img src={cover} />`.

## Imágenes en src/assets/ (optimizadas con `<Image>`)

Para imágenes del sitio (hero, ilustraciones) que se quieran optimizar con Astro:

```astro
---
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.jpg';
---

<Image
  src={heroImg}
  alt="Descripción obligatoria"
  width={1200}
  height={630}
  loading="eager"
/>
```

`loading="eager"` solo para la imagen LCP (above-the-fold). El resto: `loading="lazy"`.

## `image()` helper — solo para frontmatter markdown

```typescript
// Solo para colecciones markdown con imagen relativa al archivo .md
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/posts' }),
  schema: ({ image }) => z.object({
    cover: image(), // resuelve la ruta relativa al .md y la optimiza
  }),
});
```

```astro
<Image src={entry.data.cover} alt={entry.data.title} width={800} height={450} />
```

## Anti-patrones

- ❌ `image()` helper en schemas de colecciones JSON — usar `z.string().optional()`.
- ❌ `<img src="../../assets/foto.jpg">` para imágenes locales en src/ — usar `<Image>` o importar.
- ❌ `loading="eager"` en todas las imágenes — solo en la imagen LCP.
- ❌ Omitir `alt` — obligatorio; `alt=""` solo para imágenes decorativas.
- ✅ `public/` para imágenes de productos (rutas fijas, sin necesidad de optimización en build).
- ✅ `src/assets/` + `<Image>` para imágenes del sitio que se beneficien de WebP/AVIF automático.
