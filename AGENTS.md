# AGENTS.md — morosviejos

## Stack

- **Astro 6.x** (ESM, `"type": "module"`)
- **TypeScript strict** (`astro/tsconfigs/strict`)
- **Node >= 22.12.0**
- Windows / PowerShell 7+

## Comandos esenciales
- `npm run dev` — servidor de desarrollo (puerto 4321)
- `npm run build` — build de producción en `dist/`
- `npm run preview` — previsualizar el build
- `npx astro check` — validar tipos TypeScript

## Estructura del proyecto
- `src/pages/` — rutas (file-based routing)
- `src/components/` — componentes Astro y framework UI
- `src/layouts/` — layouts reutilizables
- `src/content/` — colecciones de contenido (si usas Content Collections)
- `public/` — assets estáticos

## Convenciones de código
- Preferir componentes `.astro` sobre JS/TS plano para páginas y layouts
- Estilos con CSS custom properties (tokens de diseño), sin Tailwind a menos que esté instalado
- Importaciones absolutas usando el alias `@/` configurado en tsconfig
- TypeScript estricto activado

## Gotchas y configuración especial
- El modo de renderizado por defecto es estático (SSG); indicar explícitamente si se necesita SSR
- Los scripts del cliente van en `<script>` dentro del componente, no en archivos externos salvo que sean módulos
- Las imágenes de `src/` se optimizan con `<Image>` de `astro:assets`
