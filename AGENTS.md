# AGENTS.md — morosviejos

## Tech stack

- **Astro 6.x** (ESM, `"type": "module"`)
- **TypeScript strict** (`astro/tsconfigs/strict`)
- **Node >= 22.12.0**
- Windows / PowerShell 7+

## Commands

```
npm run dev        # astro dev      → localhost:4321
npm run build      # astro build    → dist/
npm run preview    # astro preview
npm run astro      # astro CLI
```

## Project structure

```
src/
├── assets/                # imágenes optimizadas
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── HeroSection.astro
│   ├── NewsCard.astro
│   ├── GalleryGrid.astro
│   └── PhotoFilter.astro   # island (client:load)
├── content/
│   ├── noticias/           # colección markdown
│   └── galeria/            # colección data (JSON)
├── layouts/
│   └── BaseLayout.astro    # head, SEO, header, footer, dark mode
├── pages/
│   ├── index.astro
│   ├── historia.astro
│   ├── galeria.astro
│   ├── unete.astro
│   └── noticias/
│       ├── index.astro
│       └── [slug].astro    # ruta dinámica
└── styles/
    ├── tokens.css          # paleta + tipografía + espaciado
    └── base.css            # reset + estilos globales
```

## Design tokens (paleta)

| Token               | Modo claro  | Modo oscuro |
|---------------------|-------------|-------------|
| `--color-surface-1` | `#fcf9f3`   | `#1a1510`   |
| `--color-surface-2` | `#f5efe5`   | `#221c15`   |
| `--color-accent`    | `#8b1b2f`   | `#c42e49`   |
| `--color-accent-2`  | `#c5a44c`   | `#d4b65c`   |
| `--color-text-1`    | `#2c2416`   | `#f0ebe3`   |

- Display font: **Cinzel** (serif, ornamental)
- Body font: **Source Sans 3** (sans-serif, legible)
- Dark mode via `[data-theme="dark"]` + localStorage + prefers-color-scheme

## Astro 6 gotchas

- Content config goes in `src/content.config.ts` (NOT `src/content/config.ts`).
- Each collection must define a `loader`: use `glob()` from `astro/loaders` for markdown/JSON.
- To render markdown body in Astro 6: `import { render } from 'astro:content'; const { Content } = await render(entry);` — NOT `entry.render()`.
- In `getStaticPaths()`, do NOT pass the full entry via props (it loses `render()`). Pass the `id` and reload with `getEntry()`.
- Imports in `src/pages/noticias/*.astro` need `../../` to reach `src/layouts/` or `src/components/`.

## Style conventions

- All styles use CSS custom properties from `tokens.css`. No hardcoded colors/fonts.
- Component styles are scoped (`<style>` in `.astro`). Global styles in `BaseLayout.astro` via `is:global`.
- Dark mode toggled via `#theme-toggle` button in Header. Scripts in `BaseLayout.astro`.
- Spanish content (`lang="es"`), Spanish text throughout.
- No UI framework libraries — all components are native `.astro`.

## Content collections

- `noticias` — markdown, `src/content/noticias/*.md`. Schema: title, pubDate, excerpt, cover?, tags[], draft.
- `galeria` — JSON data, `src/content/galeria/*.json`. Schema: year, photos[].

## SEO

- `BaseLayout.astro` accepts `title`, `description`, `ogImage` props.
- Default OG image expected at `public/og-default.jpg`.
- Open Graph locale: `es_ES`.
