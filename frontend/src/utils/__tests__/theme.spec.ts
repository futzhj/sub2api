import { describe, expect, it } from 'vitest'
import {
  applyBrandTheme,
  buildPrimaryScale,
  buildSurfaceTokens,
  mixHex,
  normalizeThemePrimaryColor,
  onColorFor,
  relativeLuminance,
  resolveThemePalette,
  resolveThemePrimaryColor,
  resolveThemeSecondaryColor,
  THEME_PRESET_PALETTES,
} from '@/utils/theme'

describe('buildPrimaryScale', () => {
  it('keeps 500 equal to the normalized input hex', () => {
    const scale = buildPrimaryScale('#14B8A6')
    expect(scale['500']).toBe('#14b8a6')
  })

  it('makes 50 lighter and 900 darker than 500', () => {
    const scale = buildPrimaryScale('#3b82f6')
    expect(relativeLuminance(scale['50'])).toBeGreaterThan(relativeLuminance(scale['500']))
    expect(relativeLuminance(scale['900'])).toBeLessThan(relativeLuminance(scale['500']))
  })

  it('produces a monotonic light→dark ladder for common steps', () => {
    const scale = buildPrimaryScale('#a855f7')
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
    for (let i = 0; i < steps.length - 1; i++) {
      expect(relativeLuminance(scale[steps[i]])).toBeGreaterThan(
        relativeLuminance(scale[steps[i + 1]]),
      )
    }
  })

  it('exposes every Tailwind-style step key', () => {
    const scale = buildPrimaryScale('#22c55e')
    for (const step of ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']) {
      expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
})

describe('dual-tone presets', () => {
  it('maps barbie_neon / wasong pairs correctly', () => {
    expect(resolveThemePrimaryColor('barbie_neon')).toBe('#ff0086')
    expect(resolveThemeSecondaryColor('barbie_neon')).toBe('#f0ff0c')
    expect(resolveThemePalette('wasong')).toEqual({
      primary: '#4e8966',
      secondary: '#fffeee',
    })
  })

  it('keeps custom primary+secondary independent', () => {
    expect(resolveThemePalette('custom', '#AbCdEf', '#112233')).toEqual({
      primary: '#abcdef',
      secondary: '#112233',
    })
  })

  it('includes all dual-tone palettes', () => {
    for (const id of [
      'barbie_neon',
      'wasong',
      'crystal_electric',
      'tech_space',
      'burgundy_cream',
      'ningye_cream',
    ] as const) {
      expect(THEME_PRESET_PALETTES[id].primary).toMatch(/^#[0-9a-f]{6}$/)
      expect(THEME_PRESET_PALETTES[id].secondary).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  it('picks readable on-primary for dark and light fills', () => {
    expect(onColorFor('#470125')).toBe('#ffffff')
    expect(onColorFor('#f0ff0c')).toBe('#0f172a')
    expect(normalizeThemePrimaryColor('#FF0086')).toBe('#ff0086')
  })
})

describe('buildSurfaceTokens', () => {
  it('uses cream secondary as light page for burgundy_cream', () => {
    const s = buildSurfaceTokens('#470125', '#fffbea')
    expect(relativeLuminance(s.pageLight)).toBeGreaterThan(0.85)
    expect(relativeLuminance(s.pageDark)).toBeLessThan(0.15)
    expect(relativeLuminance(s.pageLight)).toBeGreaterThan(relativeLuminance(s.pageDark))
  })

  it('deepens wasong green for dark page (not slate gray)', () => {
    const s = buildSurfaceTokens('#4e8966', '#fffeee')
    // pageDark should retain green hue bias vs pure gray of similar L
    const [r, g, b] = [
      parseInt(s.pageDark.slice(1, 3), 16),
      parseInt(s.pageDark.slice(3, 5), 16),
      parseInt(s.pageDark.slice(5, 7), 16),
    ]
    expect(g).toBeGreaterThan(r)
    expect(g).toBeGreaterThanOrEqual(b)
    expect(relativeLuminance(s.pageLight)).toBeGreaterThan(0.9)
  })

  it('mixHex interpolates toward white', () => {
    expect(mixHex('#000000', '#ffffff', 0)).toBe('#000000')
    expect(mixHex('#000000', '#ffffff', 1)).toBe('#ffffff')
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080')
  })

  it('sets readable on-surface text for light and dark pages', () => {
    const s = buildSurfaceTokens('#ff0086', '#f0ff0c')
    expect(s.textPrimaryLight).toBe('#0f172a')
    expect(s.textPrimaryDark).toBe('#f1f5f9')
  })
})

describe('applyBrandTheme surfaces', () => {
  it('writes light/dark surface CSS variables on documentElement', () => {
    applyBrandTheme('burgundy_cream')
    const root = document.documentElement
    const pageLight = root.style.getPropertyValue('--surface-page-light-rgb').trim()
    const pageDark = root.style.getPropertyValue('--surface-page-dark-rgb').trim()
    const textLight = root.style.getPropertyValue('--text-primary-light').trim()
    const textDark = root.style.getPropertyValue('--text-primary-dark').trim()
    expect(pageLight).toMatch(/^\d+ \d+ \d+$/)
    expect(pageDark).toMatch(/^\d+ \d+ \d+$/)
    expect(pageLight).not.toBe(pageDark)
    expect(textLight).toMatch(/^#/)
    expect(textDark).toMatch(/^#/)
    expect(root.style.getPropertyValue('--surface-card-light-rgb').trim()).toMatch(/^\d+ \d+ \d+$/)
    expect(root.style.getPropertyValue('--surface-sidebar-dark-rgb').trim()).toMatch(/^\d+ \d+ \d+$/)
    expect(root.style.getPropertyValue('--surface-border-light-rgb').trim()).toMatch(/^\d+ \d+ \d+$/)
  })

  it('applies custom primary+secondary surfaces', () => {
    applyBrandTheme('custom', '#112233', '#ffeedd')
    const pageLight = document.documentElement.style.getPropertyValue('--surface-page-light-rgb').trim()
    // cream-ish secondary → bright page channels
    const parts = pageLight.split(' ').map(Number)
    expect(parts[0]).toBeGreaterThan(200)
    expect(parts[1]).toBeGreaterThan(200)
    expect(parts[2]).toBeGreaterThan(180)
  })
})
