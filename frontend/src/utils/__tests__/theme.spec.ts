import { describe, expect, it } from 'vitest'
import {
  buildPrimaryScale,
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
