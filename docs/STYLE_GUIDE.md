# SomeTools UI Style Guide

This guide captures the canonical visual language for the SomeTools project. Follow these conventions whenever building or updating pages so that each tool feels cohesive.

## Foundations

### Color Palette
- **Page background**: `#f9fafb`
- **Surface background** (cards, panels): `#ffffff`
- **Primary text**: `#1f2937`
- **Muted text**: `#4b5563`
- **Borders**: `#d0d7de`
- **Primary accent**: `#2563eb`
- **Primary accent (hover)**: `#1d4ed8`
- **Status colors**: success `#059669`, error `#dc2626`

Keep backgrounds light and neutral. Use the primary accent sparingly for links, focus/hover states, and key call-to-action buttons.

### Typography
- **Typeface**: `'Fira Code', monospace` (include via `/fonts/FiraCode-Regular.ttf`).
- **Body copy**: 1rem (16px) with `line-height: 1.7`.
- **Headings**: Page titles at `1.75rem`, section headings at `1.35rem`. Maintain consistent margins (`0 0 0.75rem`).
- Use `.tool-copy` for introductory text blocks; it adds vertical rhythm between stacked paragraphs.

### Spacing & Layout
- Page content sits within `.tool-main`, constrained to `max-width: 760px`, centered with generous `2rem` padding.
- `.tool-page` provides the light gray background and ensures a minimum viewport height.
- `.tool-header` uses a bottom border (`#e5e7eb`), `1.5rem` top padding, and a `gap: 1rem` layout for the title and actions.
- `.surface-card` is the reusable elevated container: white background, `16px` radius, `1px` border, and `0 20px 30px -25px rgba(15, 23, 42, 0.12)` shadow.

## Components

### Links
- Use `.tool-back-link` for navigation anchors. Primary accent color, medium weight, underline on hover/focus.

### Buttons
- Default buttons use a light background, `1px` border, and rounded 8px corners (see `html/Subtitle Converter/index.html`).
- Primary buttons (`.button--primary`, `.convert-button`) adopt the accent color with white text; hover state swaps to `#1d4ed8`.
- Disabled buttons reduce opacity to 0.6 and set `cursor: not-allowed`.

### Form Controls
- Inputs and selects: `border-radius: 8px–10px`, `border: 1px solid #d0d7de`, padding around `0.6–0.75rem`. Focus state uses the accent border plus `rgba(37, 99, 235, 0.15)` glow.

### Cards & Panels
- Wrap interactive sections in `.surface-card` (e.g., file selectors, conversion results, release notes). Keep textual introductions outside cards to reduce clutter.
- When listing items, remove default list styles and rely on consistent spacing (`0.35–0.75rem`).

## Accessibility
- Ensure sufficient contrast: accent color on white passes WCAG AA for text/interactive elements.
- Use `aria-live="polite"` for status messages (see `html/Temperature Converter/index.html` and `html/Release Notes/index.html`).
- Maintain focus visibility on buttons and links via border/color changes.

## File Overview
- Global rules live in `styles.css`.
- Tool-specific refinements reside in each tool's `/html/<Tool Name>/styles.css` to adjust component spacing or behaviors without redefining the base system.
- Keep colors and spacing references aligned with this guide; if a new pattern emerges, update both the shared stylesheet and this document.
