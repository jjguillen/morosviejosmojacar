# Astro Components

## Estructura base de un componente .astro

```astro
---
// Script del servidor (frontmatter) — se ejecuta SOLO en build/SSR, nunca en el cliente
interface Props {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
}

const { title, description = '', variant = 'primary' } = Astro.props;
---

<!-- Template HTML -->
<article class={`card card--${variant}`}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  <slot /> <!-- Contenido hijo por defecto -->
  <slot name="footer" /> <!-- Slot nombrado -->
</article>

<style>
  /* Estilos con scope automático al componente */
  .card { /* ... */ }
</style>
```

## Reglas de hidratación (Islands Architecture)

Usar el mínimo nivel de hidratación necesario. Orden de preferencia:

| Directiva | Cuándo usarla |
|---|---|
| (sin directiva) | Componente solo HTML, sin interactividad → sin JS |
| `client:load` | Interactividad crítica, visible al cargar (nav, formularios above-the-fold) |
| `client:idle` | Interactividad no urgente, carga cuando el browser está libre |
| `client:visible` | Componente below-the-fold, carga al entrar en viewport |
| `client:only="react"` | Componente 100% cliente, sin SSR (mapas, editores de texto) |

```astro
---
import Counter from './Counter.jsx';
import Map from './Map.jsx';
---

<!-- CORRECTO: visible al cargar → client:load -->
<Counter client:load />

<!-- CORRECTO: below-the-fold → client:visible -->
<Map client:visible />

<!-- INCORRECTO: no hidratar sin razón -->
<StaticCard client:load /> <!-- ❌ si no tiene interactividad -->
```

## Props tipadas con TypeScript

```astro
---
// Siempre definir interface Props explícita
interface Props {
  href: string;
  label: string;
  external?: boolean;
  icon?: string;
}

const { href, label, external = false, icon } = Astro.props;

// Tipos derivados de Astro
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';
const Tag = Astro.props.as ?? 'div' as HeadingLevel;
---
```

## Slots

```astro
---
// Componente padre con slots nombrados
---
<div class="layout">
  <header><slot name="header" /></header>
  <main><slot /> <!-- slot por defecto --></main>
  <aside><slot name="sidebar">Contenido por defecto</slot></aside>
</div>
```

```astro
<!-- Uso del componente con slots -->
<Layout>
  <nav slot="header">...</nav>
  <p>Contenido principal</p>
  <!-- sidebar usa el contenido por defecto -->
</Layout>
```

## Scripts del cliente

```astro
<!-- Script módulo: tiene acceso a APIs del browser, se ejecuta en el cliente -->
<script>
  // Código del cliente — NO tiene acceso a variables del frontmatter directamente
  document.querySelector('.btn')?.addEventListener('click', () => {
    console.log('clicked');
  });
</script>

<!-- Pasar datos del servidor al cliente -->
<script define:vars={{ title, variant }}>
  console.log(title); // Acceso a variables del frontmatter
</script>
```

## Layouts

```astro
---
// src/layouts/BaseLayout.astro
import { SEO } from '../components/SEO.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <SEO title={title} description={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Anti-patrones a evitar

- ❌ No usar `client:load` en componentes sin interactividad
- ❌ No acceder a `window` o `document` en el frontmatter (solo existe en el browser)
- ❌ No importar librerías de solo-cliente en el frontmatter sin guardia: `import { ... } from 'browser-only-lib'`
- ❌ No usar `<style global>` salvo para estilos verdaderamente globales (prefer CSS custom properties)
- ✅ Usar `is:inline` en scripts que necesiten ejecutarse sin procesamiento de Astro