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

function channelSpread(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return Math.max(r, g, b) - Math.min(r, g, b)
}

describe('buildSurfaceTokens', () => {
  it('keeps OmniRoute-like neutral page/card/sidebar for burgundy_cream', () => {
    const s = buildSurfaceTokens('#470125', '#fffbea')
    expect(s.pageLight).toBe('#f9f9fb')
    expect(s.cardLight).toBe('#ffffff')
    expect(s.sidebarLight).toBe('#f5f5fa')
    expect(s.pageDark).toBe('#0b0e14')
    expect(s.cardDark).toBe('#161b22')
    expect(s.sidebarDark).toBe('#10141e')
    expect(relativeLuminance(s.pageLight)).toBeGreaterThan(0.9)
    expect(relativeLuminance(s.pageDark)).toBeLessThan(0.05)
  })

  it('does not paint neon/cream dual tones onto page chrome', () => {
    const barbie = buildSurfaceTokens('#ff0086', '#f0ff0c')
    const wasong = buildSurfaceTokens('#4e8966', '#fffeee')
    // Fixed neutrals — identical page regardless of preset pair
    expect(barbie.pageLight).toBe(wasong.pageLight)
    expect(barbie.pageDark).toBe(wasong.pageDark)
    expect(channelSpread(barbie.pageLight)).toBeLessThan(8)
    expect(channelSpread(barbie.pageDark)).toBeLessThan(16)
    // No cream (#fffbea-ish) or neon yellow page
    expect(relativeLuminance(barbie.pageLight)).toBeLessThan(0.99)
    expect(barbie.pageLight.toLowerCase()).not.toMatch(/^#fff[8-f]/)
  })

  it('only soft-tints muted/border with primary (≤~6% mix)', () => {
    const s = buildSurfaceTokens('#ff0086', '#f0ff0c')
    expect(s.mutedLight).not.toBe('#f4f4f7')
    expect(s.borderLight).not.toBe('#ebebeb')
    // Still near-neutral: channel spread stays modest
    expect(channelSpread(s.mutedLight)).toBeLessThan(40)
    expect(channelSpread(s.borderLight)).toBeLessThan(40)
    expect(channelSpread(s.mutedDark)).toBeLessThan(40)
    expect(channelSpread(s.borderDark)).toBeLessThan(40)
  })

  it('mixHex interpolates toward white', () => {
    expect(mixHex('#000000', '#ffffff', 0)).toBe('#000000')
    expect(mixHex('#000000', '#ffffff', 1)).toBe('#ffffff')
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080')
  })

  it('sets OmniRoute text tokens for light and dark pages', () => {
    const s = buildSurfaceTokens('#ff0086', '#f0ff0c')
    expect(s.textPrimaryLight).toBe('#1a1a2e')
    expect(s.textMutedLight).toBe('#71717a')
    expect(s.textPrimaryDark).toBe('#e6e6ef')
    expect(s.textMutedDark).toBe('#a1a1aa')
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
    expect(pageLight).toBe('249 249 251')
    expect(pageDark).toBe('11 14 20')
    expect(textLight).toBe('#1a1a2e')
    expect(textDark).toBe('#e6e6ef')
    expect(root.style.getPropertyValue('--surface-card-light-rgb').trim()).toBe('255 255 255')
    expect(root.style.getPropertyValue('--surface-sidebar-dark-rgb').trim()).toBe('16 20 30')
    expect(root.style.getPropertyValue('--surface-border-light-rgb').trim()).toMatch(/^\d+ \d+ \d+$/)
    // Primary scale still applied
    expect(root.style.getPropertyValue('--color-primary').trim()).toBe('#470125')
  })

  it('keeps custom page chrome neutral (ignores cream secondary)', () => {
    applyBrandTheme('custom', '#112233', '#ffeedd')
    const pageLight = document.documentElement.style.getPropertyValue('--surface-page-light-rgb').trim()
    expect(pageLight).toBe('249 249 251')
    expect(document.documentElement.style.getPropertyValue('--color-primary').trim()).toBe('#112233')
  })
})
