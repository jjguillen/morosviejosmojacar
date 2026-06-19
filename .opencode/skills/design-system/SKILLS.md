# Design System del Proyecto

## Tokens de diseño (CSS Custom Properties)

Definidos en `src/styles/tokens.css` e importados globales en el layout base.

### Escala tipográfica fluida

```css
:root {
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem);
  --text-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem);
  --text-2xl:  clamp(2rem,     1.2rem  + 2.5vw,  3.5rem);
  --text-hero: clamp(2.5rem,   1rem    + 4vw,    5rem);
}
```

**Regla**: nunca usar `font-size` con valores fijos — siempre referenciar un token.

### Sistema de espaciado (base 4px)

```css
:root {
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
}
```

### Paleta de colores (light + dark mode)

```css
:root, [data-theme="light"] {
  /* Superficies */
  --color-bg:             #f7f6f2;
  --color-surface:        #f9f8f5;
  --color-surface-2:      #fbfbf9;
  --color-surface-offset: #f3f0ec;
  --color-divider:        #dcd9d5;
  --color-border:         #d4d1ca;

  /* Texto */
  --color-text:           #28251d;
  --color-text-muted:     #7a7974;
  --color-text-faint:     #bab9b4;

  /* Acento principal */
  --color-primary:        #01696f;
  --color-primary-hover:  #0c4e54;
  --color-primary-highlight: #cedcd8;

  /* Estados */
  --color-success:        #437a22;
  --color-error:          #a12c7b;
  --color-warning:        #964219;

  /* Sombras */
  --shadow-sm: 0 1px 2px oklch(0.2 0.01 80 / 0.06);
  --shadow-md: 0 4px 12px oklch(0.2 0.01 80 / 0.08);
  --shadow-lg: 0 12px 32px oklch(0.2 0.01 80 / 0.12);

  /* Radio de bordes */
  --radius-sm:   0.375rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-full: 9999px;

  /* Tipografía */
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body:    'Work Sans', 'Helvetica Neue', sans-serif;

  /* Transiciones */
  --transition-ui: 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-theme="dark"] {
  --color-bg:             #171614;
  --color-surface:        #1c1b19;
  --color-surface-2:      #201f1d;
  --color-surface-offset: #1d1c1a;
  --color-divider:        #262523;
  --color-border:         #393836;
  --color-text:           #cdccca;
  --color-text-muted:     #797876;
  --color-text-faint:     #5a5957;
  --color-primary:        #4f98a3;
  --color-primary-hover:  #227f8b;
  --color-primary-highlight: #313b3b;
  --color-success:        #6daa45;
  --color-error:          #d163a7;
  --color-warning:        #bb653b;
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.2);
  --shadow-md: 0 4px 12px oklch(0 0 0 / 0.3);
  --shadow-lg: 0 12px 32px oklch(0 0 0 / 0.4);
}
```

## Tipografía — reglas de uso

```
Fuente display (--font-display) → SOLO en --text-xl y superiores (headings h1, h2)
Fuente body (--font-body)       → Todo lo demás: body, nav, botones, labels
```

| Elemento | Token | Fuente |
|---|---|---|
| Hero h1 | `--text-hero` / `--text-2xl` | display |
| Sección h2 | `--text-xl` | display |
| Subsección h3 | `--text-lg` | body bold |
| Cuerpo de texto | `--text-base` (16px) | body |
| Botones, nav | `--text-sm` (14px) | body |
| Labels, metadatos | `--text-xs` (12px mín.) | body |

## Modo oscuro — toggle

```astro
<!-- En el layout base, añadir antes de </body> -->
<script>
  (function(){
    const r = document.documentElement;
    const d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
    r.setAttribute('data-theme', d);
    const t = document.querySelector('[data-theme-toggle]');
    t?.addEventListener('click', () => {
      const next = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', next);
    });
  })();
</script>
```

## Componentes base

### Botones

```astro
<!-- Primario: para la acción principal de la página -->
<button class="btn btn-primary">Acción principal</button>

<!-- Secundario: para acciones alternativas -->
<button class="btn btn-secondary">Alternativa</button>

<!-- Ghost: para acciones de baja prioridad -->
<button class="btn btn-ghost">Cancelar</button>
```

```css
.btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm); font-weight: 500;
  border-radius: var(--radius-md);
  transition: background var(--transition-ui), color var(--transition-ui);
  min-height: 44px; /* Touch target mínimo */
}
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-secondary { background: var(--color-surface-offset); color: var(--color-text); border: 1px solid var(--color-border); }
.btn-ghost { background: transparent; color: var(--color-text-muted); }
.btn-ghost:hover { background: var(--color-surface-offset); color: var(--color-text); }
```

### Cards

```css
.card {
  background: var(--color-surface);
  border: 1px solid oklch(from var(--color-text) l c h / 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-ui);
}
.card:hover { box-shadow: var(--shadow-md); }
```

## Anti-patrones prohibidos

- ❌ No usar colores hexadecimales directos — siempre `var(--color-...)`
- ❌ No usar `font-size` con px fijos — siempre `var(--text-...)`
- ❌ No usar `margin`/`padding` con valores arbitrarios — siempre `var(--space-...)`
- ❌ No añadir `border-left: 3px solid var(--color-primary)` a cards (AI slop)
- ❌ No usar gradientes en botones — color sólido siempre
- ❌ No centrar todo con `text-align: center` — alinear a la izquierda por defecto
- ✅ Bordes con alpha: `1px solid oklch(from var(--color-text) l c h / 0.10)`
- ✅ Contraste WCAG AA: texto body 4.5:1, texto grande 3:1