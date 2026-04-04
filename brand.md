\# brand.md

> AI agents read this before making any design decisions. Every UI element must follow these rules.



\---



\## App Identity



\*\*Name:\*\* HomeBase

\*\*Tagline:\*\* Your home's command center

\*\*Personality:\*\* Clean, warm, practical. Feels like a well-organized notebook — not a corporate dashboard, not a toy. Trustworthy without being boring. The kind of app where a homeowner thinks "this just makes sense."



\## Colors



| Role | Name | Hex | Where to use |

|------|------|-----|-------------|

| Primary | Charcoal | `#1A1A1A` | Buttons, headers, nav, primary text |

| Background | Warm White | `#F7F6F3` | Page backgrounds |

| Surface | White | `#FFFFFF` | Cards, modals, input fields |

| Border | Stone | `#E8E6E1` | Card borders, dividers, input borders |

| Muted text | Warm Gray | `#8C8C8C` | Labels, secondary text, timestamps |

| Accent | Teal | `#0D9488` | Success states, active tab indicators, links, key actions |

| Danger | Red | `#DC2626` | Overdue badges, delete actions, error states |

| Warning | Amber | `#D97706` | Due-soon badges, caution states |

| Success | Green | `#16A34A` | Completed badges, confirmation messages |



\### Category Badge Colors



Each service category gets a consistent color pair (background + text). Use these everywhere categories appear:



| Category | Background | Text |

|----------|-----------|------|

| HVAC | `#FFF3E0` | `#E65100` |

| Plumbing | `#E3F2FD` | `#0D47A1` |

| Electrical | `#FFF9C4` | `#F57F17` |

| Roofing | `#F3E5F5` | `#6A1B9A` |

| Appliance | `#E8F5E9` | `#1B5E20` |

| Exterior | `#EFEBE9` | `#4E342E` |

| Safety | `#FCE4EC` | `#880E4F` |

| Landscaping | `#E0F2F1` | `#004D40` |

| Pest Control | `#FBE9E7` | `#BF360C` |

| General | `#F5F5F5` | `#424242` |



\## Typography



| Role | Font | Weight | Size | Usage |

|------|------|--------|------|-------|

| Display | Fraunces | 700 | 28px | Stat numbers, page titles |

| Heading | DM Sans | 600 | 18px | Section headers, modal titles |

| Body | DM Sans | 400 | 14px | All body text, descriptions |

| Small | DM Sans | 500 | 12px | Labels, badges, timestamps, helper text |

| Tiny | DM Sans | 600 | 11px | Category badges, uppercase labels |



Google Fonts import:

```

https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700\&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700\&display=swap

```



\### Typography Rules

\- Uppercase labels: use `text-xs font-semibold uppercase tracking-wider` (Tailwind)

\- Letter spacing on display text: `-0.02em`

\- Line height for body text: `1.5`

\- Never use font sizes below 11px



\## Spacing



| Token | Value | Use for |

|-------|-------|---------|

| `xs` | 4px | Gaps between badge dot and text |

| `sm` | 8px | Inner padding on badges, gaps between inline items |

| `md` | 16px | Card inner padding (mobile), gaps between form fields |

| `lg` | 24px | Card inner padding (desktop), section spacing |

| `xl` | 32px | Page top/bottom padding, space between major sections |



\## Border Radius



| Element | Radius |

|---------|--------|

| Cards | 16px (`rounded-2xl`) |

| Buttons | 10px (`rounded-\[10px]`) |

| Inputs | 10px (`rounded-\[10px]`) |

| Badges | 100px (`rounded-full`) |

| Modals | 20px (`rounded-\[20px]`) |

| Tab bar | 100px (`rounded-full`) |



\## Buttons



| Type | Background | Text | Border | Use for |

|------|-----------|------|--------|---------|

| Primary | `#1A1A1A` | `#FFFFFF` | none | Main actions (Save, Log Service) |

| Ghost | transparent | `#8C8C8C` | none | Cancel, secondary actions |

| Danger | `#FEE2E2` | `#991B1B` | none | Delete, destructive actions |



All buttons: `padding: 12px 28px`, `font-weight: 600`, `font-size: 14px`. Hover on primary: `#333333`.



\## Components (shadcn/ui + Tailwind)



\- Use shadcn/ui components as the base, then override with the colors and radius values above.

\- Cards: white background, 1px stone border, 16px radius, subtle hover shadow (`shadow-sm` on hover).

\- Inputs: 1.5px stone border, 10px radius, charcoal border on focus. No colored focus rings.

\- Modals: 20px radius, backdrop blur (`backdrop-blur-sm`), `rgba(0,0,0,0.4)` overlay.

\- Tab bars: pill-style inside a stone-colored container. Active tab = charcoal bg + white text. Inactive = transparent + warm gray text.



\## Dark Mode



Not yet. Build light mode only. Do not add dark mode toggles, CSS variables for dark themes, or `dark:` Tailwind prefixes.



\## NEVER



\### Colors

\- Never use pure black (`#000000`) for text or backgrounds. Use Charcoal (`#1A1A1A`).

\- Never use pure white (`#FFFFFF`) for page backgrounds. Use Warm White (`#F7F6F3`).

\- Never use blue as a primary or accent color. The accent is Teal (`#0D9488`).

\- Never use purple gradients, neon colors, or any gradient as a background.

\- Never change the category badge colors. They are fixed across all views.

\- Never use color as the only indicator of status. Always pair with text labels.



\### Components

\- Never use colored focus rings on inputs. Use a charcoal border change only.

\- Never use sharp corners (0px radius) on any interactive element.

\- Never use outlined/bordered buttons for primary actions. Primary buttons are always filled.

\- Never add a sidebar navigation. HomeBase uses top-level tabs.

\- Never use a hamburger menu on mobile. Tabs should be visible at all times.



\### Typography

\- Never use Inter, Roboto, Arial, or system-ui as a font. Only DM Sans and Fraunces.

\- Never use font sizes below 11px for any text.

\- Never use more than two font weights on a single card or component.

\- Never center-align body text. Left-align everything except stat numbers.

