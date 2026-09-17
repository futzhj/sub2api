package service

import (
	"regexp"
	"strings"
)

const (
	ThemePresetTeal            = "teal"
	ThemePresetBlue            = "blue"
	ThemePresetPurple          = "purple"
	ThemePresetGreen           = "green"
	ThemePresetOrange          = "orange"
	ThemePresetRose            = "rose"
	ThemePresetBarbieNeon      = "barbie_neon"
	ThemePresetWasong          = "wasong"
	ThemePresetCrystalElectric = "crystal_electric"
	ThemePresetTechSpace       = "tech_space"
	ThemePresetBurgundyCream   = "burgundy_cream"
	ThemePresetNingyeCream     = "ningye_cream"
	ThemePresetCustom          = "custom"
	DefaultThemePreset         = ThemePresetTeal
	DefaultThemePrimaryColor   = "#14b8a6"
	DefaultThemeSecondaryColor = "#0d9488"
)

type ThemePalette struct {
	Primary   string
	Secondary string
}

var themePresetPalettes = map[string]ThemePalette{
	ThemePresetTeal:            {Primary: "#14b8a6", Secondary: "#0d9488"},
	ThemePresetBlue:            {Primary: "#3b82f6", Secondary: "#2563eb"},
	ThemePresetPurple:          {Primary: "#a855f7", Secondary: "#9333ea"},
	ThemePresetGreen:           {Primary: "#22c55e", Secondary: "#16a34a"},
	ThemePresetOrange:          {Primary: "#f97316", Secondary: "#ea580c"},
	ThemePresetRose:            {Primary: "#f43f5e", Secondary: "#e11d48"},
	ThemePresetBarbieNeon:      {Primary: "#ff0086", Secondary: "#f0ff0c"},
	ThemePresetWasong:          {Primary: "#4e8966", Secondary: "#fffeee"},
	ThemePresetCrystalElectric: {Primary: "#690dad", Secondary: "#00f0fd"},
	ThemePresetTechSpace:       {Primary: "#ff043a", Secondary: "#002169"},
	ThemePresetBurgundyCream:   {Primary: "#470125", Secondary: "#fffbea"},
	ThemePresetNingyeCream:     {Primary: "#47176d", Secondary: "#fffbea"},
}

// themePresetColors keeps primary-only lookups for older call sites/tests.
var themePresetColors = map[string]string{
	ThemePresetTeal:            "#14b8a6",
	ThemePresetBlue:            "#3b82f6",
	ThemePresetPurple:          "#a855f7",
	ThemePresetGreen:           "#22c55e",
	ThemePresetOrange:          "#f97316",
	ThemePresetRose:            "#f43f5e",
	ThemePresetBarbieNeon:      "#ff0086",
	ThemePresetWasong:          "#4e8966",
	ThemePresetCrystalElectric: "#690dad",
	ThemePresetTechSpace:       "#ff043a",
	ThemePresetBurgundyCream:   "#470125",
	ThemePresetNingyeCream:     "#47176d",
}

var hexColorRe = regexp.MustCompile(`(?i)^#([0-9a-f]{6})$`)

func NormalizeThemePreset(raw string) string {
	v := strings.ToLower(strings.TrimSpace(raw))
	switch v {
	case ThemePresetTeal, ThemePresetBlue, ThemePresetPurple, ThemePresetGreen, ThemePresetOrange, ThemePresetRose,
		ThemePresetBarbieNeon, ThemePresetWasong, ThemePresetCrystalElectric, ThemePresetTechSpace,
		ThemePresetBurgundyCream, ThemePresetNingyeCream, ThemePresetCustom:
		return v
	default:
		return DefaultThemePreset
	}
}

func NormalizeThemePrimaryColor(raw string) string {
	v := strings.TrimSpace(raw)
	if hexColorRe.MatchString(v) {
		return "#" + strings.ToLower(v[1:])
	}
	return DefaultThemePrimaryColor
}

func NormalizeThemeSecondaryColor(raw string) string {
	v := strings.TrimSpace(raw)
	if hexColorRe.MatchString(v) {
		return "#" + strings.ToLower(v[1:])
	}
	return DefaultThemeSecondaryColor
}

// ResolveThemePrimaryColor returns the effective brand primary hex for a preset/custom pair.
func ResolveThemePrimaryColor(preset, customHex string) string {
	p := NormalizeThemePreset(preset)
	if p == ThemePresetCustom {
		return NormalizeThemePrimaryColor(customHex)
	}
	if c, ok := themePresetColors[p]; ok {
		return c
	}
	return DefaultThemePrimaryColor
}

// ResolveThemeSecondaryColor returns the effective brand secondary/accent hex.
func ResolveThemeSecondaryColor(preset, customHex string) string {
	p := NormalizeThemePreset(preset)
	if p == ThemePresetCustom {
		return NormalizeThemeSecondaryColor(customHex)
	}
	if pal, ok := themePresetPalettes[p]; ok {
		return pal.Secondary
	}
	return DefaultThemeSecondaryColor
}
