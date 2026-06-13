---
name: Power-Up Play
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#5d3f3b'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#926f6a'
  outline-variant: '#e7bdb7'
  surface-tint: '#c0000c'
  primary: '#be000c'
  on-primary: '#ffffff'
  primary-container: '#e52521'
  on-primary-container: '#ffffff'
  inverse-primary: '#ffb4aa'
  secondary: '#00658e'
  on-secondary: '#ffffff'
  secondary-container: '#4dc1ff'
  on-secondary-container: '#004c6c'
  tertiary: '#715c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba800'
  on-tertiary-container: '#4d3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930007'
  secondary-fixed: '#c7e7ff'
  secondary-fixed-dim: '#83cfff'
  on-secondary-fixed: '#001e2e'
  on-secondary-fixed-variant: '#004c6c'
  tertiary-fixed: '#ffe179'
  tertiary-fixed-dim: '#ebc300'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system is built on a foundation of joy, nostalgia, and gamified interaction. It bridges the gap between modern, clean interface design and the vibrant, high-energy world of classic platformer gaming. The target audience seeks an experience that feels like a reward rather than a task—interactive, tactile, and visually stimulating.

The visual style is a hybrid of **Modern Playful** and **Tactile Minimalism**. It utilizes exaggerated roundedness, high-saturation color pops, and soft depth to create elements that feel "clickable" and physical. The atmosphere is optimistic and high-tempo, prioritizing clarity through bold typography and generous whitespace while maintaining a sense of whimsy through iconic color associations.

## Colors

The palette is driven by iconic primary hues that evoke an immediate sense of adventure. 
- **Primary (Red):** Used for critical actions, branding, and high-impact focal points. 
- **Secondary (Blue):** The primary interaction color, used for buttons, links, and progress indicators.
- **Tertiary (Yellow):** Reserved for highlights, rewards, and secondary "Power-Up" states.
- **Neutral (Warm White):** The background is a soft, off-white to reduce eye strain while maintaining a clean, paper-like feel.
- **Success (Green):** Integrated for "Go" states and completions, rounding out the classic quartet.

Backgrounds remain light and airy to let the high-chroma components stand out without creating visual clutter.

## Typography

The typography utilizes **Plus Jakarta Sans** for its friendly, geometric, and modern construction. To echo the game-like aesthetic, font weights are pushed to the extremes—using "Extra Bold" for headings to create a sense of impact and "Medium" for body text to maintain readability.

Headlines should be tightly tracked to feel like solid blocks of information. Labels use uppercase styling with slight letter spacing to act as secondary anchors in the layout. Hierarchy is established through scale and weight rather than color shifts, ensuring the interface remains accessible and bold.

## Layout & Spacing

The layout philosophy follows a **Fluid-to-Fixed Grid** model. On desktop, content is centered within a 1200px container. On mobile, the layout shifts to a single-column fluid model with a minimum margin of 20px.

Spacing is based on an 8px rhythm, but it is applied generously. To maintain a "toy-like" feel, internal component padding is higher than standard corporate designs, creating larger target areas for interaction. Elements should be grouped into distinct logical "islands" with significant white space between them to prevent the vibrant colors from becoming overwhelming.

## Elevation & Depth

Hierarchy is achieved through **Tonal Stacking** and **Soft Shadows**. Surfaces do not use harsh black shadows; instead, they use very soft, diffused shadows tinted with the primary blue or neutral colors to maintain a "glowing" and friendly appearance.

1.  **Level 0 (Background):** Flat, neutral surface.
2.  **Level 1 (Cards/Containers):** White surfaces with subtle, low-blur shadows (4px - 8px) to provide a "lift" from the background.
3.  **Level 2 (Interactive Elements):** Buttons and active chips feature a distinct "pressed" state where the shadow is removed and the element translates downward by 2px, mimicking a physical mechanical button.
4.  **Level 3 (Modals/Pop-ups):** Heavily blurred background overlays (backdrop-filter: blur(10px)) with high-depth shadows (24px blur) to focus the user's attention.

## Shapes

The shape language is strictly **Pill-shaped and Ultra-rounded**. Sharp corners are entirely avoided to maintain the friendly, safe, and approachable nature of the brand.

- **Primary Buttons:** Use a full pill shape (radius: 999px).
- **Cards & Containers:** Use a 2rem (32px) radius to create a soft, welcoming frame for content.
- **Input Fields:** Follow the pill-shaped convention for a consistent "squishy" tactile feel.
- **Icons:** Should feature rounded terminals and thick strokes to match the weight of the typography.

## Components

### Buttons
Buttons are the primary interaction point. They feature a thick, saturated background color. On hover, they should scale up slightly (1.05x). On click, they should scale down (0.95x) and change shadow depth to simulate a physical press.

### Cards
Cards are clean white containers with high corner radii. They should never have borders; instead, they use a soft, colored ambient shadow to indicate their category (e.g., a subtle red glow for a primary content card).

### Spin the Wheel
The central UI element. It uses a high-contrast palette of the primary, secondary, and tertiary colors. Each segment is separated by a 2px white "gutter" to ensure color vibrancy doesn't cause visual bleeding. The center "hub" should be a white circle with a soft inner shadow to create a concave effect.

### Input Fields
Inputs are pill-shaped with a thick (2px) border in a light neutral shade. When focused, the border transforms into the primary blue with a soft outer glow.

### Chips & Tags
Small, rounded indicators that use the secondary or tertiary colors at 15% opacity with a high-saturation text color to signify status without competing with primary buttons.