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
├── assets/                # (vacío — imágenes del sitio irán aquí cuando existan)
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── HeroSection.astro
│   ├── NewsCard.astro
│   ├── GalleryGrid.astro
│   ├── PageHeader.astro        # cabecera reutilizable (title + subtitle)
│   └── PhotoFilter.astro       # filtro de galería por año (script cliente, sin client:load)
│   └── tienda/
│       ├── CarritoTienda.astro # catálogo + panel pedido + drawer móvil
│       └── ProductoCard.astro  # tarjeta de producto con imagen
├── content/
│   ├── noticias/           # colección markdown
│   ├── galeria/            # colección data (JSON)
│   └── productos/          # colección data (JSON)
├── layouts/
│   └── BaseLayout.astro    # head, SEO, header, footer, dark mode
├── pages/
│   ├── index.astro
│   ├── historia.astro
│   ├── galeria.astro
│   ├── tienda.astro
│   ├── unete.astro
│   └── noticias/
│       ├── index.astro
│       └── [slug].astro    # ruta dinámica
└── styles/
    ├── tokens.css          # paleta + tipografía + espaciado
    └── base.css            # reset + utilidades globales (.container, .btn, .sr-only)

public/
└── productos/              # imágenes de productos (SVG placeholder; reemplazar con fotos reales)
```

## Design tokens (paleta)

Definidos en `src/styles/tokens.css`. **Nunca usar valores hex directamente.**

| Token                  | Modo claro  | Modo oscuro |
|------------------------|-------------|-------------|
| `--color-surface-1`    | `#fcf9f3`   | `#1a1510`   |
| `--color-surface-2`    | `#f5efe5`   | `#221c15`   |
| `--color-surface-3`    | `#ede4d8`   | `#2e271f`   |
| `--color-text-1`       | `#2c2416`   | `#f0ebe3`   |
| `--color-text-2`       | `#5c4f3f`   | `#b8ad9c`   |
| `--color-text-3`       | `#8a7e6f`   | `#7a7062`   |
| `--color-accent`       | `#32783a`   | `#4aaf5c`   |
| `--color-accent-hover` | `#3d8f47`   | `#5cc470`   |
| `--color-accent-2`     | `#c5a44c`   | `#d4b65c`   |
| `--color-border`       | `#d9cebf`   | `#3a3229`   |

- Display font: **Cinzel** (serif, ornamental) — `var(--font-display)`
- Body font: **Source Sans 3** (sans-serif, legible) — `var(--font-body)`
- Dark mode via `[data-theme="dark"]` + localStorage + prefers-color-scheme

## Astro 6 gotchas

- Content config goes in `src/content.config.ts` (NOT `src/content/config.ts`).
- Each collection must define a `loader`: use `glob()` from `astro/loaders` for markdown/JSON. There is no `type: 'content'` or `type: 'data'` — only `loader`.
- To render markdown body in Astro 6: `import { render } from 'astro:content'; const { Content } = await render(entry);` — NOT `entry.render()`.
- In `getStaticPaths()`, do NOT pass the full entry via props (it loses `render()`). Pass the `id` and reload with `getEntry()`.
- Entries have `.id` (not `.slug`). The `id` is the filename without extension (e.g. `"mi-noticia"`).
- Imports in `src/pages/noticias/*.astro` need `../../` to reach `src/layouts/` or `src/components/`.
- `client:load` on a plain `.astro` component has no effect — `<script>` tags in `.astro` files are always bundled for the client regardless. Only use `client:*` on framework components (React, Vue, etc.).

## Style conventions

- All styles use CSS custom properties from `tokens.css`. No hardcoded colors/fonts/sizes.
- Component styles are scoped (`<style>` in `.astro`). Global styles go in `base.css`.
- **Global `.btn` system lives in `base.css`**: `.btn`, `.btn:hover`, `.btn--primary`, `.btn--primary:hover`, `.btn--full`. Component-specific modifiers (`.btn--outline`, `.btn--sm`, `.btn--add`) stay scoped in their component.
- Dark mode toggled via `#theme-toggle` button in Header. Scripts in `BaseLayout.astro`.
- Spanish content (`lang="es"`), Spanish text throughout.
- No UI framework libraries — all components are native `.astro`.

## Content collections (`src/content.config.ts`)

- `noticias` — markdown, `src/content/noticias/*.md`. Schema: `title`, `pubDate`, `excerpt`, `cover?`, `tags[]`, `draft`.
- `galeria` — JSON, `src/content/galeria/*.json`. Schema: `year`, `photos[]` (`src`, `alt`, `caption?`).
- `productos` — JSON, `src/content/productos/*.json`. Schema: `id`, `nombre`, `descripcion?`, `precio`, `imagen?`, `categoria`, `tallas[]?`, `activo`.

### Product images

`imagen` is a `z.string().optional()` pointing to a `public/` path (e.g. `"/productos/camiseta.svg"`). Serve files from `public/productos/`. To replace a placeholder with a real photo: drop `camiseta.jpg` in `public/productos/` and update the JSON. Do **not** use the `image()` schema helper — that is for markdown frontmatter, not JSON collections.

## SEO

- `BaseLayout.astro` accepts `title`, `description`, `ogImage` props.
- Default OG image expected at `public/og-default.jpg`.
- Open Graph locale: `es_ES`.
