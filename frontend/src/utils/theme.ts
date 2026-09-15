/** Brand theme presets + CSS-variable applicator for Tailwind `primary-*`. */

export const THEME_PRESETS = [
  'teal',
  'blue',
  'purple',
  'green',
  'orange',
  'rose',
  'custom',
] as const

export type ThemePreset = (typeof THEME_PRESETS)[number]

export const DEFAULT_THEME_PRESET: ThemePreset = 'teal'
export const DEFAULT_THEME_PRIMARY_COLOR = '#14b8a6'

/** Named preset → primary-500 hex (Tailwind-ish). */
export const THEME_PRESET_COLORS: Record<Exclude<ThemePreset, 'custom'>, string> = {
  teal: '#14b8a6',
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#22c55e',
  orange: '#f97316',
  rose: '#f43f5e',
}

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

export function resolveThemePrimaryColor(
  preset?: string | null,
  customHex?: string | null,
): string {
  const p = normalizeThemePreset(preset)
  if (p === 'custom') return normalizeThemePrimaryColor(customHex)
  return THEME_PRESET_COLORS[p] ?? DEFAULT_THEME_PRIMARY_COLOR
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

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

/** Build a 50–950 scale from a primary-500 hex (light→dark). */
export function buildPrimaryScale(primaryHex: string): Record<string, string> {
  const base = hexToRgb(primaryHex)
  const white: [number, number, number] = [255, 255, 255]
  const black: [number, number, number] = [0, 0, 0]
  // Approximate Tailwind teal distances relative to 500.
  const lightMix = [0.95, 0.9, 0.75, 0.55, 0.3] // 50..400 toward white
  const darkMix = [0.15, 0.35, 0.5, 0.65, 0.85] // 600..950 toward black
  const scale: Record<string, string> = {
    500: rgbToHex(...base),
  }
  ;[50, 100, 200, 300, 400].forEach((step, i) => {
    scale[String(step)] = rgbToHex(...mix(base, white, lightMix[i]))
  })
  ;[600, 700, 800, 900, 950].forEach((step, i) => {
    scale[String(step)] = rgbToHex(...mix(base, black, darkMix[i]))
  })
  return scale
}

function hexToRgbChannels(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  return `${r} ${g} ${b}`
}

/** Apply brand primary palette onto documentElement as CSS variables used by Tailwind. */
export function applyBrandTheme(preset?: string | null, customHex?: string | null): void {
  if (typeof document === 'undefined') return
  const primary = resolveThemePrimaryColor(preset, customHex)
  const scale = buildPrimaryScale(primary)
  const root = document.documentElement
  for (const [step, hex] of Object.entries(scale)) {
    root.style.setProperty(`--color-primary-${step}`, hex)
    root.style.setProperty(`--primary-${step}-rgb`, hexToRgbChannels(hex))
  }
  root.style.setProperty('--color-primary', primary)
  root.style.setProperty('--primary-rgb', hexToRgbChannels(primary))
  // Soft glow / gradient accents that previously hard-coded teal.
  const [r, g, b] = hexToRgb(primary)
  root.style.setProperty('--primary-glow', `rgba(${r}, ${g}, ${b}, 0.25)`)
  root.style.setProperty('--primary-glow-lg', `rgba(${r}, ${g}, ${b}, 0.35)`)
  const darker = scale['600'] || primary
  root.style.setProperty(
    '--gradient-primary',
    `linear-gradient(135deg, ${primary} 0%, ${darker} 100%)`,
  )
}
