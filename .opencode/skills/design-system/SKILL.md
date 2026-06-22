---
name: design-system
description: Use when working on CSS, design tokens, colors, typography, spacing, buttons, or any visual styling in this project. Contains the exact token values from tokens.css and base.css, and the .btn global system.
---

# Design System — morosviejos

## Tokens de diseño (`src/styles/tokens.css`)

Todos los estilos usan CSS custom properties. **Nunca usar valores hex directamente.**

### Colores

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
| `--color-accent-2-hover` | `#d4b85e` | `#e0c470`   |
| `--color-border`       | `#d9cebf`   | `#3a3229`   |

Dark mode se activa con `[data-theme="dark"]` en el elemento raíz.

### Tipografía

```css
--font-display: 'Cinzel', serif;       /* headings, ornamental */
--font-body:    'Source Sans 3', sans-serif;  /* body, nav, botones */
```

Escala tipográfica (valores fijos, no fluidos):

```css
--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.25rem;
--text-2xl:  1.5rem;
--text-3xl:  1.875rem;
--text-4xl:  2.25rem;
--text-5xl:  3rem;
--text-6xl:  3.75rem;
```

### Espaciado

```css
--space-xs:  0.25rem;
--space-sm:  0.5rem;
--space-md:  1rem;
--space-lg:  1.5rem;
--space-xl:  2rem;
--space-2xl: 3rem;
--space-3xl: 4rem;
--space-4xl: 6rem;
```

### Bordes, sombras y layout

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;

--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

--max-width:     72rem;
--header-height: 4rem;
```

## Sistema de botones (`src/styles/base.css`)

La base global `.btn` y sus modificadores principales están en `base.css` (globales).
Los modificadores específicos de componente (`.btn--outline`, `.btn--sm`, `.btn--add`) están **scoped** en su componente.

```css
/* GLOBAL — base.css */
.btn { /* base */ }
.btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.btn--primary { background-color: var(--color-accent); color: #fff; border-color: var(--color-accent); }
.btn--primary:hover { background-color: var(--color-accent-hover); border-color: var(--color-accent-hover); color: #fff; }
.btn--full { width: 100%; }

/* SCOPED — CarritoTienda.astro */
.btn--outline { ... }
.btn--sm { ... }
.btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }

/* SCOPED — ProductoCard.astro */
.btn--add { ... }  /* botón verde sólido pequeño */
```

Uso de clases HTML:
- `<a class="btn">` — enlace estilizado como botón (sin background por defecto)
- `<button class="btn btn--primary">` — acción principal
- `<button class="btn btn--outline btn--sm">` — acción secundaria pequeña
- `<button class="btn btn--primary btn--full">` — acción principal ancho completo

## Reglas de uso

- Nunca usar colores hex directamente — siempre `var(--color-...)`.
- Nunca usar tamaños de fuente con px fijos — siempre `var(--text-...)`.
- Nunca usar márgenes/paddings con valores arbitrarios — siempre `var(--space-...)`.
- `--font-display` (Cinzel) solo en headings y elementos ornamentales.
- `--font-body` (Source Sans 3) en todo lo demás.
- Los estilos de componente van en `<style>` scoped. Solo lo verdaderamente global va en `base.css`.
