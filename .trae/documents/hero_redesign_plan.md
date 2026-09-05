# Kalakriti+ Hero Section Redesign Implementation Plan

## Repository Research

### Current Hero Architecture (HomePage.tsx lines 14-124)
- Hero lives inside `<section className="relative min-h-[90vh] flex items-center overflow-hidden">` inside `HomePage`
- 2-column `grid-cols-1 lg:grid-cols-2` layout:
  - **Left (36-71)**: Staggered framer-motion text block with h1, subtitle, 2 CTAs (Explore → /catalog, Sell → /auth/artisan)
  - **Right (73-121)**: `hidden lg:block` relative container with 3 rectangular images stacked via absolute positioning (Pexels URLs)
- Existing background layers: `.weave-texture opacity-30`, `.warm-vignette`, 2 animated motion blur orbs (terracotta + olive) with scale/opacity loops

### Existing Animation System
- **Library**: `framer-motion` (v13.2.0, already installed)
- **animations.ts exports**: `fadeUp`, `scaleIn`, `slideReveal`, `softFloat`, `cardTilt`, `pageTransition`, `processingPulse`, `successBurst`, `staggerContainer`, `staggerItem`
- **Tailwind keyframes**: `fadeIn`, `slideUp`, `float` (6s ease-in-out -10px), `pulseSoft`, `shimmer`
- **prefers-reduced-motion**: Already handled globally in index.css

### Existing Asset Status (CRITICAL)
`src/assets/` contains ONLY `kalakriti-logo.png`.

The following assets required by the hero redesign are **MISSING** (must be added by user before implementation, as temporary/external URLs are explicitly forbidden):
1. `src/assets/hero-pot.png` – Terracotta Indian pot (transparent background preferred)
2. `src/assets/hero-basket.png` – Woven bamboo basket (transparent background preferred)
3. `src/assets/hero-shawl.png` – Richly patterned Indian shawl/textile (transparent background preferred)
4. (Optional) `src/assets/hero-wooden-1.png`, `hero-wooden-2.png` – Small wooden artisan objects with decorative patterns (transparent backgrounds)

### Existing Color Palette (tailwind.config.js)
- `hero` (#1F1712), `walnut` (#3D2B1F), `terracotta` (#C1502E), `olive` (#5C6E4A), `ivory` (#F0EAE0), `taupe` (#C4B7A6)
- Existing texture classes: `.grain-overlay`, `.weave-texture`, `.warm-vignette`, `.clay-surface` will be reused.

### Files and Modules to Change

| File | Change |
|---|---|
| `src/pages/HomePage.tsx` | Replace only the hero `<section>` (lines 16-124). Keep Workflow Strip + all sections below untouched. Keep all existing imports + CTAs + text. Add imports for 4 hero assets. Add layered floating objects composition. Add particle/dust effects. |
| `src/lib/animations.ts` | Add 4 new `Variants` exports: `potFloat`, `basketFloat`, `shawlWave`, `particleDrift`. Add 1 helper keyframe CSS for shawl fabric warble (optional, or use framer-motion rotate/scale arrays). |
| `src/index.css` (optional) | Add 2-3 utility layers: hero-deep-bg (darker rich gradient with depth), hero-glow-radial (warm spot lights), dust-particle (tiny dot styling). |
| `src/assets/` | USER MUST PROVIDE: `hero-pot.png`, `hero-basket.png`, `hero-shawl.png`. Optional: `hero-wood-1.png`, `hero-wood-2.png`. All files must be imported via standard Vite ESM import and referenced as `src={importedVar}` (never strings). |

## Implementation Steps (Dependency-Ordered)

### Step 0 — User asset check (BLOCKING)
- User places at minimum 3 asset PNGs into `src/assets/` with exact names: `hero-pot.png`, `hero-basket.png`, `hero-shawl.png`. Transparent backgrounds are **strongly recommended** so the objects can float without rectangular edges.
- Optional: `hero-wood-1.png` + `hero-wood-2.png` for extra wooden blocks.
- Without these, objects cannot appear (per user rule: no temporary URLs, no inaccessible URLs).

### Step 1 — Extend animation primitives (animations.ts)
- Add `potFloat: Variants` — y: [0,-6,0], rotate: [-1,0.6,-1] — duration 7s, easeInOut, repeat Infinity
- Add `basketFloat: Variants` — y: [0,8,0], rotate: [0.8,-0.4,0.8] — duration 9s, easeInOut, repeat Infinity (phase offset from pot)
- Add `shawlWave: Variants` — y: [0,-4,0], rotate: [-2,1.5,-2], scaleY: [1, 1.015, 1] — duration 11s, easeInOut, repeat Infinity
- Add `particleDrift: Variants` — opacity [0, 0.7, 0], y: [0, -60], x small drift, stagger

### Step 2 — (Optional) Index.css hero background utilities
- `.hero-deep-bg` — layered dark radial gradients on top of `bg-hero` for extra depth (center lighter, edges darker)
- `.hero-warm-glow` — radial gradient warm spot in upper right for premium lighting
- `.dust-dot` — base class for 1x1 / 2x2 tiny rounded dots with taupe/terracotta

### Step 3 — Rewrite HomePage.tsx hero section ONLY
Keep everything above line 16 and from line 125 onward **100% identical**. Only replace the `<section>` block (lines 16-124) with:

**Background stack (z-0):**
1. Base: darker deep-bg gradient (new or reused warm-vignette)
2. Existing `.weave-texture opacity-20`
3. Warm radial glow (upper right near objects) + secondary dim olive glow (lower left)
4. 30-40 tiny dust particles absolute positioned, random initial locations, staggered `particleDrift` variants

**Foreground z-index stack on RIGHT (desktop lg+):**
- Relative composition area `hidden lg:block` (similar to current)
- Layer order (back → front):
  1. Shawl (largest): absolute, `rotate-6`, scaled ~1.1, z-10, clipped softly, `shawlWave`
  2. Basket: absolute offset right-middle, z-20, `basketFloat`, subtle drop-shadow-2xl terracotta glow
  3. Pot: absolute upper-right, z-30, `potFloat`, drop shadow
  4. Wooden objects (if provided): z-15/z-25 in gaps between main 3, slower float variants
- Each object: `object-contain`, no `rounded-*` (no rect containers — float freely)
- Overflow `overflow-visible` on the hero section so objects bleed slightly toward edges

**Left column (unchanged content + layout):**
- Keep exact `<motion.h1>` text structure, terracotta "speak" accent via `t('hero.titleHighlight')`, subtitle text via `t('hero.subtitle')`, both CTAs (Explore + Sell).
- Keep the existing fadeUp + staggerContainer entry animations.
- Adjust left column max-width from `lg:max-w-[45%]` → `lg:max-w-[48%]` so it stays readable without clipping floating objects

**Responsive rules:**
- `<lg (mobile/tablet)`: Hide the 3 floating objects entirely (using `hidden md:hidden lg:block` — OR place a **single** centered reduced object row **below** the text block on tablet). Per user instruction: "reorganize the objects rather than allowing them to overflow."
- Mobile strategy: headline + CTAs first, then a condensed scene with 2 smaller centered objects, reduced animation intensity (slower, smaller translate distance via responsive motion props or Tailwind `motion-*`)
- All motion transitions respect global `prefers-reduced-motion` (framer-motion does this automatically + index.css also enforces)

### Step 4 — Import pattern
At the top of HomePage.tsx, add:
```ts
import heroPot from '@/assets/hero-pot.png';
import heroBasket from '@/assets/hero-basket.png';
import heroShawl from '@/assets/hero-shawl.png';
// Optional:
import heroWood1 from '@/assets/hero-wood-1.png';
import heroWood2 from '@/assets/hero-wood-2.png';
```
All `<img>` tags in the new hero use `src={heroPot}` etc. with descriptive `alt=""` attributes.

## Dependencies and Considerations
- **No new npm packages**: Reuse `framer-motion` + Tailwind only.
- **Asset file extension**: `.png` (as user provided kalakriti-logo.png). If user provides `.webp` or `.jpg`, update import paths accordingly.
- **Transparency requirement**: If user provides non-transparent (solid background) photos, we'll still use them but they'll appear as rectangles floating — less ideal but functional, we document that trade-off.
- **Performance**: Keep animated DOM nodes ≤ ~50 (3 main objects + 2 wood + 30 particles is ~35 nodes). Use `will-change: transform` on the floating layers via Tailwind `will-change-transform` (or custom style). Framer-motion uses GPU transforms only (no layout thrash).
- **Accessibility**: All images have `alt` describing craft type; decorative dust particles use `aria-hidden="true"` and empty alt.
- **Scope guard**: Sections below the hero line (WorkflowStrip section at line 127+) are copy-paste preserved — no changes, no reordering, no import additions for non-hero code.

## Validation
1. `npm run typecheck` — TypeScript passes (exit 0)
2. `npm run build` — Vite build emits all hero assets into `dist/assets/` with content hashes (exit 0)
3. VS Code diagnostics on modified files: zero errors
4. Runtime (manual):
   - Dev server: hero renders with no broken image icons, no 404s in Network tab
   - Animations play smoothly, each of pot/basket/shawl has distinct rhythm/duration
   - Particles drift subtly without distracting
   - Resize window: `<lg` reorganizes (compact), `≥lg` shows full layered composition
   - Buttons: both CTAs still navigate (Explore → /catalog, Sell → /auth/artisan)
   - `prefers-reduced-motion` ON: animations disabled (tested in DevTools)

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Missing hero PNG assets → broken placeholders | **High** if user skips Step 0 | Plan explicitly BLOCKS Step 3-4 until assets present under exact `src/assets/` names; user is notified in approval step |
| Non-transparent (JPEG-style) assets → rectangular look instead of floating | Medium | Use CSS `mask-image` radial gradient if available; or note in PR. Code accepts both transparently via `object-contain`. |
| Shawl large size breaks mobile layout | Medium | `<lg`: shawl + wood hidden entirely; only pot + basket shown reduced below text; `max-w` guards. |
| Framer-motion 13 infinite repeats memory leak | Low | Reuse existing `softFloat` pattern (already in project, tested). Ensure variants use fixed arrays, not `transition: { repeat: Infinity }` on spring animations. |
| Particles cause jank on low-end devices | Low | Cap at 30, use `will-change`, only `opacity + translate`, no blur/filter animation. Toggle off under `@media (prefers-reduced-motion)` |
