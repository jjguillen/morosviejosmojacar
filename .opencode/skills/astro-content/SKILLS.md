# Astro Content Collections

## Configuración (src/content/config.ts)

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content', // 'content' para MD/MDX, 'data' para JSON/YAML
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(), // coerce convierte strings ISO a Date automáticamente
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'data', // JSON o YAML, sin cuerpo markdown
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    tech: z.array(z.string()),
  }),
});

export const collections = { blog, projects };
```

## Consultar colecciones

```typescript
import { getCollection, getEntry } from 'astro:content';

// Obtener todas las entradas (filtrar drafts en producción)
const posts = await getCollection('blog', ({ data }) => {
  return import.meta.env.PROD ? !data.draft : true;
});

// Ordenar por fecha descendente
const sortedPosts = posts.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

// Obtener una entrada específica por slug
const post = await getEntry('blog', 'mi-primer-post');

// Acceder a los datos tipados
const { title, pubDate, tags } = post.data;
```

## Rutas dinámicas con getStaticPaths()

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## Renderizar contenido markdown

```astro
---
// SIEMPRE usar post.render() para obtener el componente Content
const { Content, headings, remarkPluginFrontmatter } = await post.render();
---

<!-- headings: array de { depth, slug, text } para tabla de contenidos -->
<Content />
```

## Imágenes en Content Collections

```typescript
// En el schema, usar image() helper para validación y optimización automática
import { defineCollection, z, image } from 'astro:content';

const blog = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image(), // Valida la ruta y habilita optimización con <Image>
  }),
});
```

```astro
---
import { Image } from 'astro:assets';
---
<Image src={post.data.cover} alt={post.data.title} width={800} height={450} />
```

## Anti-patrones

- ❌ No usar `Astro.glob()` para gestionar contenido tipado — usar `getCollection()` siempre
- ❌ No omitir `z.coerce.date()` en campos de fecha — los frontmatter YAML devuelven strings
- ❌ No olvidar exportar el schema en `src/content/config.ts` — sin esto no hay tipado
- ❌ No hacer `await post.render()` fuera de un componente `.astro` o endpoint
- ✅ Usar `type: 'data'` para colecciones sin cuerpo (JSON/YAML de configuración, listas)
- ✅ Filtrar `draft: true` en producción con el segundo argumento de `getCollection()`