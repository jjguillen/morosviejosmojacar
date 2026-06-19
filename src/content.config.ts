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

const galeria = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/galeria' }),
  schema: z.object({
    year: z.number(),
    photos: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    ),
  }),
});

const productos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/productos' }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    descripcion: z.string().optional(),
    precio: z.number(),
    imagen: z.string().optional(),
    categoria: z.enum(['ropa', 'complementos', 'indumentaria']),
    tallas: z.array(z.string()).optional(),
    activo: z.boolean().default(true),
  }),
});

export const collections = { noticias, galeria, productos };
