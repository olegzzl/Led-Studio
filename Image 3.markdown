---
name: Pro-Studio Interface
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c6c6'
  on-secondary: '#303030'
  secondary-container: '#494949'
  on-secondary-container: '#b9b8b8'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  section-header:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  value-mono:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
spacing:
  unit: 4px
  gutter: 1px
  panel-padding: 12px
  control-gap: 8px
  sidebar-width: 300px
---

## Brand & Style

The design system is engineered for deep focus and technical precision, mirroring the environment of a professional darkroom. It targets power users in creative, scientific, and data-heavy industries where the content—not the interface—must remain the primary focus. 

The visual style is a refined hybrid of **Minimalism** and **Utilitarianism**. By utilizing a monochromatic, low-distraction color palette, the UI recedes into the background, allowing high-contrast active elements to guide the eye. Every pixel is intentional, favoring dense information displays and precise control mechanisms over decorative flourishes. The emotional response is one of serious capability, reliability, and professional-grade control.

## Colors

This design system utilizes a strictly dark-mode palette to minimize eye strain during long working sessions and to prevent interface colors from bleeding into the user's perception of visual content.

- **Background Base (#1A1A1A):** Used for the primary workspace and canvas surround.
- **Surface Container (#232323):** Used for sidebars, toolbars, and panel backgrounds.
- **Active Accents:** High-contrast white (#FFFFFF) is reserved for active states, selected text, and primary icons. 
- **Muted Elements:** Mid-tone grays are used for labels and inactive controls to maintain a clear hierarchy of importance.
- **Borders:** Thin, low-contrast lines (#333333) are the primary method of sectioning the UI without adding visual bulk.

## Typography

Typography in this design system is functional and compact. **Inter** is used across all levels for its exceptional legibility at small sizes and its neutral, systematic character.

Key typographic rules:
- **Sidebar Labels:** Must be small, uppercase, and bold to act as clear structural anchors.
- **Numerical Values:** Use tabular figures to ensure alignment when values change rapidly (e.g., in sliders or histograms).
- **Hierarchy:** Contrast is achieved through weight and case rather than large jumps in point size, maintaining a dense, information-rich environment.

## Layout & Spacing

The layout follows a **Fixed-Panel Grid** model. The interface is divided into functional zones—header, sidebars, and a central viewport—separated by 1px borders rather than wide gutters.

- **Sidebars:** Fixed-width (typically 300px) to ensure control consistency.
- **Main Viewport:** Fluid, expanding to fill all remaining space.
- **Density:** High. Vertical spacing between controls is kept to a minimum (8px) to maximize the number of visible tools without scrolling.
- **Margins:** A standard 12px internal padding is applied to all panels to keep content from touching the structural borders.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **1px Outlines** rather than shadows. This maintains a flat, technical aesthetic that feels integrated into the screen.

- **Tier 1 (Lowest):** Main workspace background (#1A1A1A).
- **Tier 2 (Surface):** Sidebars and tool palettes (#232323).
- **Separation:** Divisions between panels are created by 1px solid lines (#333333). 
- **Active Depth:** Interactive elements like pressed buttons or active input fields may use a slightly lighter background (#2A2A2A) to indicate "closeness" to the user, but should never use ambient shadows.

## Shapes

The design system employs a **Sharp (0px)** corner radius for almost all structural elements, including panels, buttons, and input fields. This reinforces the "pro-tool" aesthetic and allows for seamless tiling of UI components.

- **Rectangular Handles:** Slider thumbs and scrollbar tracks are strictly rectangular.
- **Exceptions:** Very small icons or radio indicators may use a 1px radius to prevent "aliasing" visual artifacts, but the general rule is 90-degree corners.

## Components

### Sliders
The signature component of the design system. Sliders consist of a thin 1px horizontal track in a muted gray, with a small (approx. 8x12px) rectangular handle. The handle should be light gray (#A5A5A5), turning white (#FFFFFF) on hover or interaction.

### Buttons
Buttons are subtle and low-profile. They feature a #333333 border and no background fill in their default state. On hover, they take a subtle #2A2A2A fill. Text inside buttons should be center-aligned and follow the `label-sm` typographic style.

### Input Fields
Inputs are integrated into the panel background. They are identified by a 1px bottom border or a subtle recessed box. When active, the border color changes to a high-contrast gray or white.

### Disclosure Triangles
Used for collapsible sidebar sections (e.g., "Presets", "Histogram"). These are small, equilateral triangles that rotate 90 degrees when expanded.

### Chips & Tags
Compact, rectangular boxes with `label-sm` text. Used for metadata or filter states. They should have a solid #333333 background and no border.

### Progress & Histograms
Data visualizations should use high-contrast fills (white or light gray) against the #1A1A1A background, ensuring the data is the most vibrant element in the panel.