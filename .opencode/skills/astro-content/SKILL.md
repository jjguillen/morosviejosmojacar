---
name: astro-content
description: Use when working with Astro 6 content collections, src/content.config.ts, getCollection, getEntry, render(), or getStaticPaths with dynamic routes. Contains Astro 6 loader API patterns — NOT the old type:'content'/type:'data' API.
---

# Astro 6 — Content Collections

## Configuración (`src/content.config.ts`)

En Astro 6 la config va en `src/content.config.ts` (NO `src/content/config.ts`).
Cada colección necesita un `loader`. No existe `type: 'content'` ni `type: 'data'`.

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/noticias' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    excerpt: z.string(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const productos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/productos' }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    precio: z.number(),
    imagen: z.string().optional(), // ruta public/ — NO usar image() helper con JSON
    categoria: z.enum(['ropa', 'complementos', 'indumentaria']),
    activo: z.boolean().default(true),
  }),
});

export const collections = { noticias, productos };
```

## Consultar colecciones

```typescript
import { getCollection, getEntry } from 'astro:content';

// Todas las entradas, filtrando borradores
const noticias = await getCollection('noticias', ({ data }) => !data.draft);

// Ordenar por fecha descendente
noticias.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

// Entrada específica por id (el id es el nombre del archivo sin extensión)
const entry = await getEntry('noticias', 'mi-noticia');
```

## Rutas dinámicas con `getStaticPaths()`

**IMPORTANTE**: en Astro 6 NO pasar el entry completo como prop — pierde la capacidad de `render()`.
Pasar solo el `id` y recargar con `getEntry()` dentro del componente.

```astro
---
// src/pages/noticias/[slug].astro
import { getCollection, getEntry, render } from 'astro:content';

export async function getStaticPaths() {
  const noticias = await getCollection('noticias', ({ data }) => !data.draft);
  return noticias.map((entry) => ({
    params: { slug: entry.id },   // entry.id, NO entry.slug
    props: { id: entry.id },      // pasar solo id, NO el entry completo
  }));
}

const { id } = Astro.props;
const entry = await getEntry('noticias', id);  // recargar aquí
if (!entry) return Astro.redirect('/noticias');

const { Content } = await render(entry);       // render() importado de 'astro:content'
---

<article>
  <h1>{entry.data.title}</h1>
  <Content />
</article>
```

## Renderizar markdown

```typescript
// Astro 6: render() es una función importada, NO un método del entry
import { render } from 'astro:content';

const { Content, headings } = await render(entry);
// headings: array de { depth, slug, text } para tabla de contenidos
```

❌ `await entry.render()` — API de Astro 4/5, no funciona en Astro 6.
✅ `await render(entry)` — correcto en Astro 6.

## Identificadores de entrada

- Las entradas tienen `.id`, no `.slug`.
- El `id` es el nombre del archivo sin extensión: `"mi-noticia"` para `mi-noticia.md`.

## Imágenes en colecciones JSON

Para colecciones JSON (productos, galería de data), usar `z.string().optional()` apuntando a `public/`:

```json
{ "imagen": "/productos/camiseta.svg" }
```

```astro
<img src={producto.data.imagen} alt={producto.data.nombre} />
```

NO usar el helper `image()` con colecciones JSON — ese helper es para imágenes en frontmatter markdown.

## Anti-patrones

- ❌ `src/content/config.ts` — debe ser `src/content.config.ts`.
- ❌ `type: 'content'` / `type: 'data'` — no existe en Astro 6, usar `loader`.
- ❌ `entry.render()` — usar `render(entry)` importado de `astro:content`.
- ❌ Pasar el entry completo en props de `getStaticPaths()` — pasar solo `id`.
- ❌ `entry.slug` — usar `entry.id`.
- ❌ `image()` helper en schemas de colecciones JSON — solo para frontmatter markdown.
