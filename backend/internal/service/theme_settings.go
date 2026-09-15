package service

import (
	"regexp"
	"strings"
)

const (
	ThemePresetTeal    = "teal"
	ThemePresetBlue    = "blue"
	ThemePresetPurple  = "purple"
	ThemePresetGreen   = "green"
	ThemePresetOrange  = "orange"
	ThemePresetRose    = "rose"
	ThemePresetCustom  = "custom"
	DefaultThemePreset = ThemePresetTeal
	DefaultThemePrimaryColor = "#14b8a6"
)

var themePresetColors = map[string]string{
	ThemePresetTeal:   "#14b8a6",
	ThemePresetBlue:   "#3b82f6",
	ThemePresetPurple: "#a855f7",
	ThemePresetGreen:  "#22c55e",
	ThemePresetOrange: "#f97316",
	ThemePresetRose:   "#f43f5e",
}

var hexColorRe = regexp.MustCompile(`(?i)^#([0-9a-f]{6})$`)

func NormalizeThemePreset(raw string) string {
	v := strings.ToLower(strings.TrimSpace(raw))
	switch v {
	case ThemePresetTeal, ThemePresetBlue, ThemePresetPurple, ThemePresetGreen, ThemePresetOrange, ThemePresetRose, ThemePresetCustom:
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
