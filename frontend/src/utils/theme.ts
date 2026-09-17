/** Brand theme presets + CSS-variable applicator for Tailwind `primary-*` / `secondary-*`. */

export const THEME_PRESETS = [
  'teal',
  'blue',
  'purple',
  'green',
  'orange',
  'rose',
  'barbie_neon',
  'wasong',
  'crystal_electric',
  'tech_space',
  'burgundy_cream',
  'ningye_cream',
  'custom',
] as const

export type ThemePreset = (typeof THEME_PRESETS)[number]

export type ThemePalette = {
  primary: string
  secondary: string
}

export const DEFAULT_THEME_PRESET: ThemePreset = 'teal'
export const DEFAULT_THEME_PRIMARY_COLOR = '#14b8a6'
export const DEFAULT_THEME_SECONDARY_COLOR = '#0d9488'

/** Named preset → primary + secondary hex pairs. */
export const THEME_PRESET_PALETTES: Record<Exclude<ThemePreset, 'custom'>, ThemePalette> = {
  teal: { primary: '#14b8a6', secondary: '#0d9488' },
  blue: { primary: '#3b82f6', secondary: '#2563eb' },
  purple: { primary: '#a855f7', secondary: '#9333ea' },
  green: { primary: '#22c55e', secondary: '#16a34a' },
  orange: { primary: '#f97316', secondary: '#ea580c' },
  rose: { primary: '#f43f5e', secondary: '#e11d48' },
  // Dual-tone brand palettes (primary = brand fill, secondary = accent)
  barbie_neon: { primary: '#ff0086', secondary: '#f0ff0c' },
  wasong: { primary: '#4e8966', secondary: '#fffeee' },
  crystal_electric: { primary: '#690dad', secondary: '#00f0fd' },
  tech_space: { primary: '#ff043a', secondary: '#002169' },
  burgundy_cream: { primary: '#470125', secondary: '#fffbea' },
  ningye_cream: { primary: '#47176d', secondary: '#fffbea' },
}

/** Primary-only map (compat helpers / swatches). */
export const THEME_PRESET_COLORS: Record<Exclude<ThemePreset, 'custom'>, string> = Object.fromEntries(
  Object.entries(THEME_PRESET_PALETTES).map(([id, p]) => [id, p.primary]),
) as Record<Exclude<ThemePreset, 'custom'>, string>

const HEX_RE = /^#([0-9a-fA-F]{6})$/

export function normalizeThemePreset(raw?: string | null): ThemePreset {
  const v = (raw || '').trim().toLowerCase()
  return (THEME_PRESETS as readonly string[]).includes(v)
    ? (v as ThemePreset)
    : DEFAULT_THEME_PRESET
}

export function normalizeThemePrimaryColor(raw?: string | null): string {
  const v = (raw || '').trim()
  if (HEX_RE.test(v)) return `#${v.slice(1).toLowerCase()}`
  return DEFAULT_THEME_PRIMARY_COLOR
}

export function normalizeThemeSecondaryColor(raw?: string | null): string {
  const v = (raw || '').trim()
  if (HEX_RE.test(v)) return `#${v.slice(1).toLowerCase()}`
  return DEFAULT_THEME_SECONDARY_COLOR
}

export function resolveThemePrimaryColor(
  preset?: string | null,
  customHex?: string | null,
): string {
  const p = normalizeThemePreset(preset)
  if (p === 'custom') return normalizeThemePrimaryColor(customHex)
  return THEME_PRESET_PALETTES[p]?.primary ?? DEFAULT_THEME_PRIMARY_COLOR
}

export function resolveThemeSecondaryColor(
  preset?: string | null,
  customHex?: string | null,
): string {
  const p = normalizeThemePreset(preset)
  if (p === 'custom') return normalizeThemeSecondaryColor(customHex)
  return THEME_PRESET_PALETTES[p]?.secondary ?? DEFAULT_THEME_SECONDARY_COLOR
}

export function resolveThemePalette(
  preset?: string | null,
  customPrimary?: string | null,
  customSecondary?: string | null,
): ThemePalette {
  return {
    primary: resolveThemePrimaryColor(preset, customPrimary),
    secondary: resolveThemeSecondaryColor(preset, customSecondary),
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeThemePrimaryColor(hex).slice(1)
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
  )
}

/** RGB (0–255) → HSL with H in [0,360), S/L in [0,1]. */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case rn:
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
      break
    case gn:
      h = ((bn - rn) / d + 2) / 6
      break
    default:
      h = ((rn - gn) / d + 4) / 6
      break
  }
  return [h * 360, s, l]
}

function hue2rgb(p: number, q: number, t: number): number {
  let tt = t
  if (tt < 0) tt += 1
  if (tt > 1) tt -= 1
  if (tt < 1 / 6) return p + (q - p) * 6 * tt
  if (tt < 1 / 2) return q
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
  return p
}

/** HSL (H [0,360), S/L [0,1]) → RGB hex. */
function hslToHex(h: number, s: number, l: number): string {
  const sat = Math.max(0, Math.min(1, s))
  const lit = Math.max(0, Math.min(1, l))
  if (sat === 0) {
    const v = lit * 255
    return rgbToHex(v, v, v)
  }
  const q = lit < 0.5 ? lit * (1 + sat) : lit + sat - lit * sat
  const p = 2 * lit - q
  const hk = (((h % 360) + 360) % 360) / 360
  const r = hue2rgb(p, q, hk + 1 / 3) * 255
  const g = hue2rgb(p, q, hk) * 255
  const b = hue2rgb(p, q, hk - 1 / 3) * 255
  return rgbToHex(r, g, b)
}

/**
 * Reference lightness curve inspired by Tailwind teal-50…950.
 * Remapped so step 500 keeps the input color's lightness exactly.
 */
const REF_LIGHTNESS: Record<number, number> = {
  50: 0.969,
  100: 0.943,
  200: 0.882,
  300: 0.804,
  400: 0.706,
  500: 0.4,
  600: 0.322,
  700: 0.261,
  800: 0.218,
  900: 0.19,
  950: 0.1,
}

const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/** Build a 50–950 scale from a *-500 hex (light→dark) via HSL lightness. */
export function buildPrimaryScale(primaryHex: string): Record<string, string> {
  const normalized = normalizeThemePrimaryColor(primaryHex)
  const [hr, hg, hb] = hexToRgb(normalized)
  const [h, s, l] = rgbToHsl(hr, hg, hb)
  const ref500 = REF_LIGHTNESS[500]

  const scale: Record<string, string> = {
    500: normalized,
  }

  for (const step of SCALE_STEPS) {
    if (step === 500) continue
    const refL = REF_LIGHTNESS[step]
    let newL: number
    if (step < 500) {
      const t = (refL - ref500) / (1 - ref500)
      newL = l + t * (0.985 - l)
    } else {
      const t = refL / ref500
      newL = 0.06 + t * (l - 0.06)
    }

    let newS = s
    if (step < 500) {
      const wash = (500 - step) / 450
      newS = s * (1 - wash * 0.22)
      if (newL > 0.9) newS = Math.max(newS, s * 0.45)
    } else {
      const deep = (step - 500) / 450
      newS = Math.min(1, s * (1 + Math.min(deep, 0.55) * 0.1))
      if (deep > 0.7) newS *= 1 - (deep - 0.7) * 0.35
    }

    scale[String(step)] = hslToHex(h, newS, newL)
  }

  return scale
}

/** Alias — same algorithm for secondary accent scales. */
export const buildSecondaryScale = buildPrimaryScale

function hexToRgbChannels(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  return `${r} ${g} ${b}`
}

/** Relative luminance (sRGB) for contrast decisions. */
export function relativeLuminance(hex: string): number {
  const channels = hexToRgb(hex).map((c) => {
    const n = c / 255
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

/** Text/icon color that stays readable on a filled primary surface. */
export function onColorFor(hex: string): string {
  return relativeLuminance(hex) > 0.55 ? '#0f172a' : '#ffffff'
}

/** Linear mix of two hex colors; t=0 → a, t=1 → b. */
export function mixHex(a: string, b: string, t: number): string {
  const tt = Math.max(0, Math.min(1, t))
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  return rgbToHex(ar + (br - ar) * tt, ag + (bg - ag) * tt, ab + (bb - ab) * tt)
}

export type SurfaceTokens = {
  pageLight: string
  cardLight: string
  sidebarLight: string
  mutedLight: string
  elevatedLight: string
  borderLight: string
  textPrimaryLight: string
  textMutedLight: string
  pageDark: string
  cardDark: string
  sidebarDark: string
  mutedDark: string
  elevatedDark: string
  borderDark: string
  textPrimaryDark: string
  textMutedDark: string
}

/**
 * Fixed OmniRoute-like neutral chrome for light/dark modes.
 * Brand primary may tint muted/border at ≤~5% — never recolors page/card/sidebar.
 * `secondaryHex` is accepted for API compatibility but does not paint surfaces.
 */
const NEUTRAL_SURFACES = {
  pageLight: '#f9f9fb',
  cardLight: '#ffffff',
  sidebarLight: '#f5f5fa',
  mutedLight: '#f4f4f7',
  elevatedLight: '#ffffff',
  borderLight: '#ebebeb',
  textPrimaryLight: '#1a1a2e',
  textMutedLight: '#71717a',
  pageDark: '#0b0e14',
  cardDark: '#161b22',
  sidebarDark: '#10141e',
  mutedDark: '#12161e',
  elevatedDark: '#1c222c',
  borderDark: '#1f2127',
  textPrimaryDark: '#e6e6ef',
  textMutedDark: '#a1a1aa',
} as const

/** Max mix of primary into muted/border only (OmniRoute-style soft accent). */
const SURFACE_PRIMARY_TINT = 0.05

export function buildSurfaceTokens(primaryHex: string, _secondaryHex?: string): SurfaceTokens {
  const primary = normalizeThemePrimaryColor(primaryHex)
  const tint = SURFACE_PRIMARY_TINT

  return {
    pageLight: NEUTRAL_SURFACES.pageLight,
    cardLight: NEUTRAL_SURFACES.cardLight,
    sidebarLight: NEUTRAL_SURFACES.sidebarLight,
    mutedLight: mixHex(NEUTRAL_SURFACES.mutedLight, primary, tint),
    elevatedLight: NEUTRAL_SURFACES.elevatedLight,
    borderLight: mixHex(NEUTRAL_SURFACES.borderLight, primary, tint),
    textPrimaryLight: NEUTRAL_SURFACES.textPrimaryLight,
    textMutedLight: NEUTRAL_SURFACES.textMutedLight,
    pageDark: NEUTRAL_SURFACES.pageDark,
    cardDark: NEUTRAL_SURFACES.cardDark,
    sidebarDark: NEUTRAL_SURFACES.sidebarDark,
    mutedDark: mixHex(NEUTRAL_SURFACES.mutedDark, primary, tint),
    elevatedDark: NEUTRAL_SURFACES.elevatedDark,
    borderDark: mixHex(NEUTRAL_SURFACES.borderDark, primary, tint),
    textPrimaryDark: NEUTRAL_SURFACES.textPrimaryDark,
    textMutedDark: NEUTRAL_SURFACES.textMutedDark,
  }
}

function applyScaleVars(
  root: HTMLElement,
  prefix: 'primary' | 'secondary',
  baseHex: string,
  scale: Record<string, string>,
): void {
  for (const [step, hex] of Object.entries(scale)) {
    root.style.setProperty(`--color-${prefix}-${step}`, hex)
    root.style.setProperty(`--${prefix}-${step}-rgb`, hexToRgbChannels(hex))
  }
  root.style.setProperty(`--color-${prefix}`, baseHex)
  root.style.setProperty(`--${prefix}-rgb`, hexToRgbChannels(baseHex))
}

function applySurfaceVars(root: HTMLElement, surfaces: SurfaceTokens): void {
  const pairs: Array<[string, string]> = [
    ['--surface-page-light-rgb', surfaces.pageLight],
    ['--surface-card-light-rgb', surfaces.cardLight],
    ['--surface-sidebar-light-rgb', surfaces.sidebarLight],
    ['--surface-muted-light-rgb', surfaces.mutedLight],
    ['--surface-elevated-light-rgb', surfaces.elevatedLight],
    ['--surface-border-light-rgb', surfaces.borderLight],
    ['--surface-page-dark-rgb', surfaces.pageDark],
    ['--surface-card-dark-rgb', surfaces.cardDark],
    ['--surface-sidebar-dark-rgb', surfaces.sidebarDark],
    ['--surface-muted-dark-rgb', surfaces.mutedDark],
    ['--surface-elevated-dark-rgb', surfaces.elevatedDark],
    ['--surface-border-dark-rgb', surfaces.borderDark],
  ]
  for (const [name, hex] of pairs) {
    root.style.setProperty(name, hexToRgbChannels(hex))
  }
  root.style.setProperty('--text-primary-light', surfaces.textPrimaryLight)
  root.style.setProperty('--text-muted-light', surfaces.textMutedLight)
  root.style.setProperty('--text-primary-dark', surfaces.textPrimaryDark)
  root.style.setProperty('--text-muted-dark', surfaces.textMutedDark)
  root.style.setProperty('--on-surface-light', surfaces.textPrimaryLight)
  root.style.setProperty('--on-surface-dark', surfaces.textPrimaryDark)
}

/** Apply brand primary + secondary palettes onto documentElement CSS variables. */
export function applyBrandTheme(
  preset?: string | null,
  customPrimary?: string | null,
  customSecondary?: string | null,
): void {
  if (typeof document === 'undefined') return
  const { primary, secondary } = resolveThemePalette(preset, customPrimary, customSecondary)
  const primaryScale = buildPrimaryScale(primary)
  const secondaryScale = buildSecondaryScale(secondary)
  const surfaces = buildSurfaceTokens(primary, secondary)
  const root = document.documentElement

  applyScaleVars(root, 'primary', primary, primaryScale)
  applyScaleVars(root, 'secondary', secondary, secondaryScale)
  applySurfaceVars(root, surfaces)

  const [r, g, b] = hexToRgb(primary)
  const [sr, sg, sb] = hexToRgb(secondary)
  root.style.setProperty('--primary-glow', `rgba(${r}, ${g}, ${b}, 0.25)`)
  root.style.setProperty('--primary-glow-lg', `rgba(${r}, ${g}, ${b}, 0.35)`)
  root.style.setProperty('--secondary-glow', `rgba(${sr}, ${sg}, ${sb}, 0.25)`)
  root.style.setProperty('--on-primary', onColorFor(primary))
  root.style.setProperty('--on-secondary', onColorFor(secondary))
  root.style.setProperty(
    '--gradient-primary',
    `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
  )
}
