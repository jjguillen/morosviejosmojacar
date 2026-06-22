---
name: astro-component
description: Use when creating or editing .astro components, layouts, slots, client scripts, or deciding whether to use client:load and other hydration directives.
---

# Astro Components — morosviejos

## Estructura base de un componente `.astro`

```astro
---
// Frontmatter: se ejecuta SOLO en build/SSR, nunca en el cliente
export interface Props {
  title: string;
  subtitle?: string;
}

const { title, subtitle } = Astro.props;
---

<header class="page-header">
  <div class="container">
    <h1 class="page-title">{title}</h1>
    {subtitle && <p class="page-subtitle">{subtitle}</p>}
  </div>
</header>

<style>
  /* Estilos con scope automático — no afectan al resto de la página */
  .page-header { padding: var(--space-4xl) 0 var(--space-3xl); }
</style>
```

## Scripts del cliente en componentes `.astro`

Los `<script>` dentro de un `.astro` se incluyen automáticamente en el bundle del cliente. **No necesitan `client:load`**.

```astro
<button id="mi-btn">Click</button>

<script>
  // Este script siempre se bundlea para el cliente
  document.getElementById('mi-btn')?.addEventListener('click', () => {
    console.log('clicked');
  });
</script>
```

Para pasar datos del servidor al cliente:

```astro
---
const config = { theme: 'dark', lang: 'es' };
---
<script define:vars={{ config }}>
  console.log(config.theme); // acceso a variable del frontmatter
</script>
```

## `client:*` — solo para componentes de framework

`client:load`, `client:idle`, `client:visible` **solo tienen efecto en componentes de framework** (React, Vue, Svelte, etc.). En componentes `.astro` puros no hacen nada.

| Directiva | Cuándo usar |
|---|---|
| (sin directiva) | Componente `.astro` con `<script>` — el script se bundlea solo |
| `client:load` | Framework component visible al cargar (React, Vue, etc.) |
| `client:idle` | Framework component no urgente |
| `client:visible` | Framework component below-the-fold |

```astro
<!-- ✅ .astro con script interactivo — sin client:* -->
<PhotoFilter years={years} selectedYear={selectedYear} />

<!-- ✅ Framework component que necesita hidratación -->
<ReactCounter client:load />

<!-- ❌ client:load en .astro es un no-op — no añade nada -->
<PhotoFilter years={years} client:load />
```

## Props tipadas

```astro
---
export interface Props {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
}

const { href, label, variant = 'primary' } = Astro.props;
---
```

## Slots

```astro
---
// BaseLayout.astro
---
<!doctype html>
<html lang="es">
  <head><slot name="head" /></head>
  <body>
    <slot /> <!-- slot por defecto -->
  </body>
</html>
```

```astro
<!-- Uso -->
<BaseLayout>
  <meta slot="head" name="robots" content="noindex" />
  <main>Contenido</main>
</BaseLayout>
```

## Anti-patrones

- ❌ `client:load` en un componente `.astro` puro — no tiene efecto.
- ❌ Acceder a `window` o `document` en el frontmatter (solo existe en el browser).
- ❌ `<style global>` — usar `base.css` para estilos verdaderamente globales.
- ❌ Colores o tamaños hardcoded — siempre `var(--color-...)`, `var(--text-...)`, `var(--space-...)`.
- ✅ Componentes reutilizables como `PageHeader.astro` para patrones repetidos.
- ✅ El sistema de botones global (`.btn`, `.btn--primary`, etc.) está en `base.css` — no redefinir en componentes.
