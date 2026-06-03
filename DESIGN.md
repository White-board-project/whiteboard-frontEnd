---
name: CanvasFlow Studio
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e4'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fe'
  surface-container: '#EFECF8'
  surface-container-high: '#e9e7f2'
  surface-container-highest: '#e4e1ec'
  on-surface: '#1b1b23'
  on-surface-variant: '#464554'
  inverse-surface: '#303038'
  inverse-on-surface: '#f2effb'
  outline: '#767586'
  outline-variant: '#C7C4D7'
  surface-tint: '#484bd6'
  primary: '#2c2abc'
  on-primary: '#ffffff'
  primary-container: '#4648d4'
  on-primary-container: '#d1d1ff'
  inverse-primary: '#c0c1ff'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e4'
  on-secondary-container: '#626566'
  tertiary: '#6d3600'
  on-tertiary: '#ffffff'
  tertiary-container: '#904900'
  on-tertiary-container: '#ffcaa6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#06006c'
  on-primary-fixed-variant: '#2e2ebe'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#444748'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb782'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703800'
  background: '#fcf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ec'
  canvas-bg: '#F8F9FA'
  error-cursor: '#BA1A1A'
  selection-handle-bg: '#FFFFFF'
typography:
  h1:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  tag-xs:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  header-height: 64px
  toolbar-offset: 24px
---

## Brand & Style

CanvasFlow Studio is a collaborative design environment that balances professional utility with creative fluidity. The brand identity is **Corporate / Modern** with a distinct lean toward **Minimalism** to ensure the interface never competes with the user's content. 

The aesthetic is characterized by high-clarity typography, a systematic neutral palette, and subtle functional accents. It evokes a sense of organized precision and real-time agility. The "Canvas Grid" background and "Floating UI" elements establish a spatial metaphor where tools exist on a separate plane from the infinite creative workspace.

## Colors

The palette is rooted in a deep **Indigo Primary (#4648D4)**, used for primary actions and active selection states. 

- **Primary:** Driving the core brand presence and interactive focus.
- **Secondary & Tertiary:** Reserved for collaborative presence indicators (user avatars and cursors) to provide distinct visual separation between participants.
- **Neutrals:** A sophisticated range of cool-toned greys and off-whites. The background uses a very light neutral tint (#F8F9FA) to reduce eye strain during long sessions.
- **Functional Accents:** Crimson is utilized specifically for error states or specific user-presence highlights, while soft lavender-greys handle structural containment and borders.

## Typography

The system utilizes **Inter** exclusively to maintain a clean, utilitarian feel. The type scale is optimized for high-density information environments.

- **Headlines:** Use tighter letter spacing and heavier weights to anchor sections and branding.
- **Body:** Standardized at 14px for optimal readability in sidebars and tooltips.
- **Micro-copy:** 10px bold uppercase tags are used for technical metadata (e.g., "RECTANGLE" labels) to provide high contrast at small scales.
- **Mobile adjustments:** For viewport widths under 768px, `h1` should scale down to 24px and `h2` to 20px to maintain balance.

## Layout & Spacing

The interface employs a **Hybrid Layout Model**:
1. **Fixed Chrome:** The Top Navigation (64px) and floating sidebars are fixed relative to the viewport.
2. **Infinite Canvas:** The primary workspace uses a non-grid, free-form layout where elements are positioned absolutely.
3. **Internal Component Spacing:** A base unit of 8px (sm) is used for most padding, with 16px (md) for container internal margins.

**Adaptive Rules:**
- **Desktop:** Floating panels are anchored to screen edges with 24px margins.
- **Tablet:** Mini-map and secondary controls collapse into overflow menus.
- **Mobile:** The left toolbar moves to a bottom horizontal strip, and side margins reduce to 16px.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering**:

- **Level 0 (Workspace):** The canvas background with a radial dot grid.
- **Level 1 (Cards/Elements):** Flat surfaces with a subtle 1px `outline-variant` border and `shadow-sm`.
- **Level 2 (Floating UI):** Toolbars and menus use a more pronounced shadow (`0 4px 12px rgba(0, 0, 0, 0.05)`) and a solid white background to appear "lifted" above the canvas.
- **Level 3 (Active Selection):** Elements gain a 2px `primary` border and interactive selection handles, creating a clear focus state that sits atop all other content.

## Shapes

The system uses **Soft (1)** roundedness for a modern, approachable feel that remains efficient in space usage.

- **Standard Elements:** 0.25rem (4px) for small buttons and input fields.
- **Containers/Cards:** 0.75rem (12px) for floating panels and canvas cards.
- **Circular Elements:** Full rounding (9999px) is reserved for avatars, cursors, and action-toggle icons.
- **Selection Handles:** Sharp 0px corners are used for technical control points to indicate precision.

## Components

- **Buttons:** Primary buttons use a solid indigo background with white text and 12px horizontal padding. Hover states shift to a lighter indigo tint.
- **Toolbars:** Vertical stacks of icon-only buttons with 10px padding. Active tools are highlighted with a subtle background container.
- **Canvas Cards:** White backgrounds, 12px corner radius, and 16px internal padding. Title typography uses `h3` in primary color.
- **Presence Indicators:** Circular avatars (32px) with 2px white borders. Cursors consist of a filled 'near_me' icon and a 10px bold name tag.
- **Selection Handles:** 8px x 8px white squares with a 1.5px indigo border, positioned at vertices and midpoints of the active bounding box.
- **Mini-Map:** A simplified viewport representation using opacity-scaled versions of the canvas elements.