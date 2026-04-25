---
name: Sacred Editorial
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#424844'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ec'
  outline: '#737874'
  outline-variant: '#c2c8c3'
  surface-tint: '#4f6358'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0d1f17'
  on-primary-container: '#74887d'
  inverse-primary: '#b6cbbf'
  secondary: '#745b00'
  on-secondary: '#ffffff'
  secondary-container: '#fdd668'
  on-secondary-container: '#755c00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002112'
  on-tertiary-container: '#53906e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e8da'
  primary-fixed-dim: '#b6cbbf'
  on-primary-fixed: '#0d1f17'
  on-primary-fixed-variant: '#384b41'
  secondary-fixed: '#ffe08d'
  secondary-fixed-dim: '#e8c357'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#b0f1c9'
  tertiary-fixed-dim: '#94d4ae'
  on-tertiary-fixed: '#002112'
  on-tertiary-fixed-variant: '#0d5134'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-xl:
    fontFamily: notoSerif
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 84px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: notoSerif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  headline-md:
    fontFamily: notoSerif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-caps:
    fontFamily: manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  arabic-display:
    fontFamily: Amiri
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 60px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base_unit: 8px
  section_padding: 120px
  max_width: 1280px
  columns: '12'
  gutter: 32px
  margin: 64px
---

## Brand & Style

This design system embodies a philosophy of "Sacred Minimalism"—a fusion of high-end editorial prestige and the timeless discipline of Islamic geometry. It is designed for scholarly publications, luxury heritage brands, and cultural institutions that demand an atmosphere of quiet reverence and intellectual authority.

The aesthetic draws heavily from the "Monocle" school of layout—prioritizing white space, precise grid alignment, and information density—while softening the modern edge with organic textures and traditional motifs. The emotional response should be one of serenity and "Zuhd" (ascetic elegance), where every element is intentional and nothing is superfluous.

The style is rooted in **Minimalism** with a **Tactile Editorial** finish. It mimics the physical sensation of premium heavy-stock cream paper, using subtle tonal shifts instead of digital artifice like glows or heavy shadows to indicate depth.

## Colors

The palette is anchored by the interplay between **Ivory** and **Deep Forest**. Ivory serves as the canvas, providing a warmer, more scholarly foundation than pure white, while Deep Forest acts as the primary vehicle for text and structural elements.

**Antique Gold** is used exclusively for high-level accents—hairline rules, iconographic details, and small-scale emphasis—never for large blocks of color. **Islamic Green** (Emerald) serves as a tertiary highlight for success states or traditional indicators.

Contrast is maintained through "ink" levels rather than pure blacks. **Ink Primary** is a dense, near-black charcoal used for headings, while **Ink Secondary** (Warm Grey) provides a softer hierarchy for metadata and secondary body copy.

## Typography

The typographic hierarchy is the core of this design system. It uses a dual-language approach that respects the horizontal flow of Latin characters and the calligraphic heritage of Arabic script.

1.  **Headings:** Utilize a tall, classical serif (modeled after Cormorant Garamond, represented here by **notoSerif**). These should be set with generous leading to allow the letterforms to breathe.
2.  **Body:** A clean, geometric sans-serif (**manrope**) provides a contemporary contrast, ensuring legibility in dense scholarly texts.
3.  **Arabic:** The **Amiri** typeface is required for all Arabic text. It must be sized roughly 20% larger than its Latin counterpart to maintain visual optical balance.
4.  **Labels:** All-caps metadata should be used sparingly for section headers, set with wide letter spacing to evoke a sense of premium branding.

## Layout & Spacing

The layout follows a **fixed 12-column grid** within a 1280px container, centered on the viewport. The primary characteristic of this system is the radical use of whitespace.

A **120px vertical section padding** is mandatory between major content blocks to create a rhythmic "breath" as the user scrolls. Elements should be aligned to the 8px base unit. 

Internal margins within cards and containers are generous (minimum 32px), ensuring that text never feels crowded. Layouts should favor asymmetrical balance—for example, a 4-column text block offset against an 8-column image—rather than simple centering.

## Elevation & Depth

This design system rejects the use of drop shadows. Depth is communicated through **Tonal Layering** and **Low-Contrast Outlines**.

*   **Surfaces:** The primary background is Ivory (#F7F5F1). Primary cards and interactive containers use pure White (#FFFFFF).
*   **Borders:** Subtle definition is achieved through 1px solid rules in Sand (#E8DFD0) or Deep Forest (#0D1F17) at low opacity (10-15%).
*   **Golden Rules:** Use a 0.5px or 1px Antique Gold rule to separate high-level editorial sections or to underline featured headlines.
*   **Backdrop:** For modal overlays, use a Deep Forest (#0D1F17) tint at 80% opacity to completely isolate the user from the background, reinforcing focus.

## Shapes

The shape language is predominantly architectural and rectilinear. 

*   **Containers & Cards:** Use a subtle **4px (0.25rem)** corner radius. This is enough to soften the edge and make the UI feel approachable without losing the precision of a grid-based editorial layout.
*   **Accent Bars & Rules:** These must always have **0px** radius. They should appear as sharp, intentional cuts across the layout, echoing the stroke of a traditional reed pen (Qalam).
*   **Interactive Elements:** Buttons and input fields follow the 4px standard to maintain consistency with cards.

## Components

### Buttons
Primary buttons are solid Deep Forest with Ivory text. Secondary buttons are outlined in Deep Forest with 1px weight. The hover state for all buttons involves a subtle transition to a Sand background or a Gold border.

### Editorial Cards
Cards must not have shadows. They are defined by a 1px Sand border or a simple tonal shift. Every card should feature a generous internal gutter (padding) and may optionally include a small 6-fold geometric rosette in the top-right corner as a decorative watermark.

### Input Fields
Inputs are minimal, featuring only a bottom border (1px Sand) that turns Deep Forest upon focus. Labels are always set in the small all-caps Manrope style.

### Decorative Elements
*   **Geometric Rosettes:** Use sparse, vector-based 6-fold Islamic patterns as background motifs or as dividers.
*   **Calligraphy Accents:** Small, high-quality calligraphic marks (e.g., a "Bismillah" or a stylized "Alif") can be used as section breaks or end-of-article flourishes.
*   **Thin Rules:** Hairline gold rules should be used to bracket featured quotes or to separate the navigation from the main body.

### Navigation
The navigation bar should be transparent or Ivory, using a simple horizontal list of Manrope-caps links. A 1px gold rule should sit at the very top of the viewport.