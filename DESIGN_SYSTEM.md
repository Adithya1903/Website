# MOI Website — Design System Reference

> Comprehensive design tokens, typography, color palette, spacing, shadows, animations, and gradients used across the MOI website. Feed this into any design tool or AI assistant for visual consistency.

---

## 1. Color Palette

### Core Brand Colors (CSS Variables)

| Token               | Hex       | RGB                  | Usage                        |
|----------------------|-----------|----------------------|------------------------------|
| `--cream`            | `#F5F3EE` | `245, 243, 238`      | Page base / background       |
| `--ink`              | `#1A1A1A` | `26, 26, 26`         | Primary text                 |
| `--purple`           | `#7B5EA7` | `123, 94, 167`       | Brand purple / accent        |
| `--gradient-peach`   | `#F7D1BA` | `247, 209, 186`      | Gradient accent — warm       |
| `--gradient-blue`    | `#B8D4E3` | `184, 212, 227`      | Gradient accent — cool       |
| `--gradient-amber`   | `#F0D9A0` | `240, 217, 160`      | Gradient accent — golden     |
| `--gradient-lavender`| `#D5C7E8` | `213, 199, 232`      | Gradient accent — soft purple|

### Participant / Semantic Colors

| Name        | Hex       | Usage                                     |
|-------------|-----------|-------------------------------------------|
| Alice       | `#8B6CC1` | Alice nucleus, lighter purple              |
| Alice light | `#A88CD4` | Alice inner glow                           |
| Bob         | `#3A9F7E` | Bob / authority / green semantic           |
| Charlie     | `#D4853A` | Orange — preferences                       |
| Diana       | `#3A7ED4` | Blue — assets                              |
| Eve         | `#C44D5A` | Red — permissions / danger                 |
| Trust       | `#D45A6A` | Trust / red accent                         |
| History     | `#7A8B5A` | Olive — history / logs                     |

### Participant Constants (for canvas)

| Participant | Hex       |
|-------------|-----------|
| Alice       | `#7B5EA7` |
| Bob         | `#3A8F6E` |
| Charlie     | `#C47A2D` |
| Diana       | `#2D7EC4` |
| Eve         | `#C44D5A` |

### Context Ring Colors (6-segment ring around Alice nucleus)

```
#8B6CC1  — authority (Alice purple)
#3A9F7E  — preferences (green)
#D4853A  — assets (orange)
#3A7ED4  — permissions (blue)
#C44D5A  — trust (red)
#7A8B5A  — history (olive)
```

### Token / Crypto Colors

| Token  | Hex       |
|--------|-----------|
| kMOI   | `#7B5EA7` |
| BTC    | `#F7931A` |
| ETH    | `#627EEA` |
| SOL    | `#9945FF` |
| USDC   | `#2775CA` |
| NFT    | `#C44D5A` |

### Neutral / Surface Colors

| Hex       | Usage                             |
|-----------|-----------------------------------|
| `#FDFCFA` | Card surface (canvas panels)      |
| `#FAF8F3` | Lighter cream variant             |
| `#EDE8E0` | Darker cream (pivot sections)     |
| `#E8E0D8` | Darkest cream (who sections)      |
| `#FFFFFF` | Pure white                        |
| `#141414` | Near-black                        |

### Functional Colors

| Hex       | Usage                |
|-----------|----------------------|
| `#27AE60` | Success / verified   |
| `#C0392B` | Error / danger       |

### Opacity Scale (commonly used with `--ink` `#1A1A1A`)

```
/5   /8   /10  /12  /15  /20  /25  /30  /35  /40  /50  /60  /70
```

For example: `text-[#1A1A1A]/40` = `rgba(26, 26, 26, 0.40)`

---

## 2. Typography

### Font Families

| Token          | Stack                                               | Usage             |
|----------------|------------------------------------------------------|-------------------|
| `--font-serif` | `"Instrument Serif", Georgia, "Times New Roman", serif` | Headlines, titles |
| `--font-mono`  | `"DM Mono", ui-monospace, "SFMono-Regular", monospace`  | Body, labels, UI  |

### Google Fonts Import

```
Instrument Serif — display (regular weight only)
DM Mono — 300 (light), 400 (regular), 500 (medium)
```

### Type Scale

| Element               | Font          | Size                                    | Weight | Line-height    | Tracking          |
|------------------------|---------------|------------------------------------------|--------|----------------|-------------------|
| Hero title             | Serif         | `clamp(3.5rem, 10vw, 9rem)`            | 400    | `0.82`         | `-0.03em`         |
| Section title          | Serif         | `clamp(2rem, 4.5vw, 3.5rem)`           | 400    | `1.1`          | default           |
| CTA headline           | Serif         | `clamp(2rem, 5vw, 4rem)`               | 400    | `1.1`          | default           |
| Card title             | Serif         | `text-xl` (1.25rem)                     | 400    | default        | default           |
| "WHO" decorative       | Serif         | `clamp(2.5rem, 6vw, 5rem)`             | 400    | `0.9`          | default           |
| Section label          | Mono          | `10px`                                  | 500    | default        | `0.2em`           |
| Nav link               | Mono          | `11px`                                  | 400    | default        | `0.12em`          |
| Button text            | Mono          | `10px`                                  | 400    | default        | `0.15em–0.2em`    |
| Card body              | Mono          | `12px`                                  | 400    | `relaxed`      | default           |
| Subhead / powered by   | Mono          | `13px`                                  | 400/500| default        | `0.06em`          |
| Canvas panel header    | Mono          | `13px` bold                             | 700    | default        | default           |
| Canvas body text       | Mono          | `9–11px`                                | 400    | default        | default           |
| Canvas stat number     | Mono          | `36px` bold                             | 700    | default        | default           |
| Tiny labels (SVG/canvas)| Mono         | `7–8px`                                 | 300-400| default        | default           |
| Logo wordmark          | Mono          | `xs` (0.75rem)                          | 500    | default        | `0.3em`           |

### Conventions

- Section labels: **uppercase**, `tracking-[0.2em]`, `10px`, `font-medium`, brand purple
- Buttons: **uppercase**, `tracking-[0.15em]`, `10px`
- Body text: lowercase, often at 40% or 35% opacity on ink
- All text is `font-mono` (DM Mono) except headlines which are `font-serif` (Instrument Serif)

---

## 3. Spacing & Layout

### Page Layout

| Token              | Value            |
|---------------------|------------------|
| Max content width   | `1200px`         |
| Narrow content      | `700px`          |
| Narrow CTA          | `460px`          |
| Nav height          | `56px` (pill), `88px` (total with padding) |
| Section padding     | `py-28 md:py-36` (7rem / 9rem)  |
| Section side padding| `px-6 md:px-8`   |
| Footer section      | `py-28 md:py-40` |

### Button Sizes

| Variant           | Padding              |
|--------------------|----------------------|
| Primary CTA        | `px-8 py-3`          |
| Secondary CTA      | `px-8 py-3`          |
| Nav CTA            | `px-5 py-2`          |
| Nav link pill       | `px-[14px] py-[6px]` |
| Inline CTA         | `px-6 py-2.5`        |

### Card Spacing

| Element             | Value     |
|----------------------|-----------|
| Feature card padding | `p-8`     |
| Grid gap             | `gap-6`   |
| Feature grid         | 3-column on md+ |
| Icon bottom margin   | `mb-4`    |
| Title bottom margin  | `mb-3`    |

### Canvas Constants

| Token        | Value  |
|--------------|--------|
| `SPACING`    | `85px` |
| `BLOB_R`     | `54`   |
| `CARD_W`     | `210`  |
| `CARD_H`     | `252`  |
| `CARD_R`     | `14`   |

---

## 4. Border Radius

| Value                | Usage                                  |
|-----------------------|----------------------------------------|
| `rounded-full` / `100px` | Buttons, nav bar, badge pills       |
| `20px`                | `.card-surface` (frosted cards)        |
| `16px` / `rounded-2xl`| Mobile menu, chat panel               |
| `14px`                | Canvas panel cards, message bubbles    |
| `10px`                | Token cards                            |
| `8px`                 | Small UI elements, mini cards          |
| `4px`                 | Inline code                            |
| `3px`                 | Canvas label backgrounds               |
| `50%`                 | Dots, circles, avatar shapes           |

---

## 5. Shadows

| Name               | Value                                                       | Usage            |
|---------------------|-------------------------------------------------------------|------------------|
| Card surface        | `0 4px 24px rgba(0, 0, 0, 0.04)`                           | `.card-surface`  |
| Primary CTA         | `0 2px 8px rgba(0, 0, 0, 0.12)`                            | Dark buttons     |
| Glass CTA           | `0 1px 4px rgba(0, 0, 0, 0.06)`                            | Light buttons    |
| Navbar              | `0 2px 12px rgba(0, 0, 0, 0.04)`                           | Frosted nav      |
| Mobile dropdown     | `0 4px 24px rgba(0, 0, 0, 0.06)`                           | Mobile menu      |
| Canvas panels       | `shadowColor: rgba(20, 20, 20, 0.06)`, `shadowBlur: 16`    | Panel cards      |
| Canvas tokens       | `shadowColor: rgba(20, 20, 20, 0.04)`, `shadowBlur: 8`     | Token mini-cards |

---

## 6. Glassmorphism / Frosted Surfaces

### Card Surface (`.card-surface`)

```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(12px);
border-radius: 20px;
border: 1px solid rgba(26, 26, 26, 0.06);
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
```

### Navbar

```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(20px);
border: 1px solid rgba(26, 26, 26, 0.06);
box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
border-radius: 9999px; /* full pill */
```

### Glass Button

```css
background: rgba(255, 255, 255, 0.7);  /* bg-white/70 */
backdrop-filter: blur(4px);             /* backdrop-blur-sm */
border: 1px solid rgba(26, 26, 26, 0.15);
```

---

## 7. Gradients

### Hero Gradient (`.bg-hero-gradient`)

```css
background:
  radial-gradient(ellipse at 25% 15%, rgba(184, 212, 227, 0.35), transparent 55%),  /* blue */
  radial-gradient(ellipse at 75% 70%, rgba(247, 209, 186, 0.4), transparent 55%),   /* peach */
  radial-gradient(ellipse at 50% 40%, rgba(213, 199, 232, 0.2), transparent 60%),   /* lavender */
  #F5F3EE;
```

### Section Gradient (`.bg-section-gradient`)

```css
background:
  radial-gradient(ellipse at 30% 50%, rgba(184, 212, 227, 0.15), transparent 50%),
  radial-gradient(ellipse at 70% 50%, rgba(247, 209, 186, 0.18), transparent 50%),
  #F5F3EE;
```

### Per-Section Gradients

All use layered radial gradients on a cream base:

| Section      | Primary Tint                | Base      |
|--------------|------------------------------|-----------|
| intro        | Blue 0.35 + Lavender 0.15   | `#F5F3EE` |
| evaporation  | Peach 0.4 + Blue 0.15       | `#F5F3EE` |
| contract     | Amber 0.45 + Peach 0.2      | `#F5F3EE` |
| pivot        | Lavender 0.35 + Ink 0.04    | `#EDE8E0` |
| who          | Purple 0.18 + Ink 0.06      | `#E8E0D8` |
| solution     | Lavender 0.3 + Blue 0.15    | `#F5F3EE` |
| preferences  | Lavender 0.25               | `#F5F3EE` |
| assets       | Lavender 0.2 + Peach 0.2    | `#F5F3EE` |
| permissions  | Lavender 0.2                | `#F5F3EE` |
| scale        | Blue 0.3 + Lavender 0.15    | `#F5F3EE` |

### Stat Block Gradient

```css
linear-gradient(135deg, rgba(123, 94, 167, 0.08) 0%, rgba(184, 212, 227, 0.15) 100%)
```

### Alice Nucleus Glow (SVG radial)

```
stop 0%:   #8B6CC1 at opacity 0.4
stop 70%:  #8B6CC1 at opacity 0.1
stop 100%: #8B6CC1 at opacity 0.0
```

---

## 8. Animations & Transitions

### CSS Keyframes

| Name              | Duration | Easing          | Behavior                                    |
|--------------------|----------|-----------------|---------------------------------------------|
| `nucleus-breathe`  | `3s`     | `ease-in-out`   | Scale 1 → 1.08, opacity 0.85 → 1, infinite |
| `cursor-blink`     | `1s`     | `ease-in-out`   | Opacity toggle (caret), infinite            |
| `dot-pulse`        | varies   | default         | Opacity 1 → 0.5, scale 1 → 0.75            |
| `scroll-x`         | varies   | linear          | translateX(0) → translateX(-50%)            |

### Scroll Reveal (`.fade-slide-up`)

```css
opacity: 0 → 1;
transform: translateY(24px) → translateY(0);
transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1);
```

### GSAP Initial State (`.gsap-hidden`)

```css
opacity: 0;
transform: translateY(24px);
```

### Common Transition Values

| Pattern            | Duration  | Easing                           |
|---------------------|-----------|----------------------------------|
| Button hover        | `300ms`   | `ease` (default)                 |
| Content reveal      | `800ms`   | `ease-out`                       |
| Color transitions   | `300ms`   | `ease` (default)                 |
| Nav mobile toggle   | `300ms`   | `ease` (default)                 |
| Canvas ripple       | per-frame | Opacity -= 0.02, radius += 8/frame |

### GSAP Patterns (How It Works page)

- Eases: `power2.out`, `power3.out`
- Durations: `0.35s – 0.9s`
- Properties: `opacity`, `y`, `x`, `scale`
- Stagger: used on sequential reveals

---

## 9. Buttons

### Primary (Dark)

```css
background: #1A1A1A;
color: #F5F3EE;
border: 1px solid #1A1A1A;
border-radius: 9999px;
padding: 12px 32px;
font: uppercase 10px DM Mono, tracking 0.15-0.2em;
shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
hover → background: #7B5EA7;
```

### Secondary (Glass)

```css
background: rgba(255, 255, 255, 0.7);
color: rgba(26, 26, 26, 0.7);
border: 1px solid rgba(26, 26, 26, 0.15);
border-radius: 9999px;
padding: 12px 32px;
backdrop-filter: blur(4px);
shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
hover → background: white, border-color: rgba(26, 26, 26, 0.3), color: #1A1A1A;
```

### Ghost (Outline)

```css
background: transparent;
color: rgba(26, 26, 26, 0.6);
border: 1px solid rgba(26, 26, 26, 0.15);
border-radius: 9999px;
padding: 8px 20px;
hover → color: #1A1A1A, border-color: rgba(26, 26, 26, 0.3);
```

---

## 10. Badge Pill Component

```css
display: inline-flex;
padding: 6px 16px;
border-radius: 9999px;
border: 1px solid rgba(123, 94, 167, 0.15);
background: rgba(123, 94, 167, 0.08);
font: uppercase 10px DM Mono, tracking 0.2em, weight 500;
color: #7B5EA7;
```

---

## 11. Canvas Visual Style (Hero Grid)

- **Stick figures**: `lineWidth: 1.2`, `lineCap: round`, `lineJoin: round`
- **Default state**: alpha `0.10`, scale `0.85`, color `#1A1A1A`
- **Active/highlighted**: alpha `0.7`, scale `1.0`, color `#7B5EA7` (purple)
- **Ripple ring**: purple at `opacity * 0.15`, `lineWidth: 1`
- **Labels**: `300 9px DM Mono`, purple fill, white bg pill at `88%` opacity
- **Ambient highlight**: every `2500ms`, glow lasts `2000ms`
- **Grid spacing**: `85px` between nodes, staggered rows with jitter

---

## 12. Alice Nucleus (SVG Component)

- **Outer glow**: Radial gradient from `#8B6CC1` at 40% opacity → 0%
- **Core circle**: `#8B6CC1` at 85% opacity, `r = size * 0.52`
- **Inner light**: `#A88CD4` at 50% opacity, `r = size * 0.3`
- **Ring**: 6 segmented arcs in the context ring colors (see Section 1)
  - `strokeWidth: 3`, gap between segments, `opacity: 0.7`
- **Animation**: `nucleus-breathe` — scale 1↔1.08, opacity 0.85↔1, `3s ease-in-out infinite`
- **Label**: "alice" in `7px DM Mono`, `#1A1A1A` at 40% opacity

---

## 13. Key Visual Principles

1. **Cream, not white** — base is always `#F5F3EE`, never pure white
2. **Soft layered radials** — gradients are stacked radial-gradient ellipses at low opacity (15-40%)
3. **Frosted glass** — cards and nav use `backdrop-filter: blur()` with semi-transparent white
4. **Ultra-thin borders** — `1px solid rgba(26, 26, 26, 0.06)` everywhere
5. **Purple as accent** — `#7B5EA7` is the only strong color in UI; used sparingly
6. **Monospace for everything except headlines** — DM Mono is the workhorse
7. **Instrument Serif for impact** — headlines only, with tight leading (0.82–1.1)
8. **Uppercase micro-labels** — 10px, wide tracking, font-medium, brand purple
9. **Low-contrast body text** — body text at 35-40% opacity, never full black
10. **Minimal shadows** — barely visible, `0.04–0.06` opacity only
11. **Six semantic colors** — authority, preferences, assets, permissions, trust, history — used consistently in canvas and ring visualizations

---

## 14. Assets

| Asset          | Path                 |
|----------------|----------------------|
| Logo mark      | `/logo-moi-mark.png` |
| Whitepaper PDF  | `/MOILitePaper.pdf`  |

---

## 15. Tailwind v4 Notes

- Uses `@import "tailwindcss"` with `@theme` block for font tokens
- No `tailwind.config.js` — configuration is in `src/index.css`
- Arbitrary values used extensively: `text-[#1A1A1A]`, `bg-[#7B5EA7]/8`, `text-[10px]`, etc.
- Custom utility classes defined in CSS: `.card-surface`, `.bg-hero-gradient`, `.fade-slide-up`, `.snap-container`, `.snap-section`, `.gsap-hidden`, `.alice-nucleus`, `.cursor-caret`
