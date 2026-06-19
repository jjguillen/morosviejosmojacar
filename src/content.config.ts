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

export const collections = { noticias, galeria };
