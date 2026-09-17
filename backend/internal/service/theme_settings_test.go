package service

import "testing"

func TestNormalizeThemePreset(t *testing.T) {
	if got := NormalizeThemePreset(""); got != ThemePresetTeal {
		t.Fatalf("empty -> %q", got)
	}
	if got := NormalizeThemePreset("BLUE"); got != ThemePresetBlue {
		t.Fatalf("BLUE -> %q", got)
	}
	if got := NormalizeThemePreset("barbie_neon"); got != ThemePresetBarbieNeon {
		t.Fatalf("barbie_neon -> %q", got)
	}
	if got := NormalizeThemePreset("CRYSTAL_ELECTRIC"); got != ThemePresetCrystalElectric {
		t.Fatalf("CRYSTAL_ELECTRIC -> %q", got)
	}
	if got := NormalizeThemePreset("nope"); got != ThemePresetTeal {
		t.Fatalf("invalid -> %q", got)
	}
}

func TestResolveThemePrimaryColor(t *testing.T) {
	if got := ResolveThemePrimaryColor("teal", ""); got != DefaultThemePrimaryColor {
		t.Fatalf("teal -> %q", got)
	}
	if got := ResolveThemePrimaryColor("custom", "#AbCdEf"); got != "#abcdef" {
		t.Fatalf("custom -> %q", got)
	}
	if got := ResolveThemePrimaryColor("custom", "bad"); got != DefaultThemePrimaryColor {
		t.Fatalf("bad custom -> %q", got)
	}
	if got := ResolveThemePrimaryColor("rose", "#000000"); got != themePresetColors[ThemePresetRose] {
		t.Fatalf("rose ignores custom -> %q", got)
	}
	if got := ResolveThemePrimaryColor("barbie_neon", ""); got != "#ff0086" {
		t.Fatalf("barbie_neon primary -> %q", got)
	}
}

func TestResolveThemeSecondaryColor(t *testing.T) {
	if got := ResolveThemeSecondaryColor("teal", ""); got != DefaultThemeSecondaryColor {
		t.Fatalf("teal secondary -> %q", got)
	}
	if got := ResolveThemeSecondaryColor("barbie_neon", ""); got != "#f0ff0c" {
		t.Fatalf("barbie_neon secondary -> %q", got)
	}
	if got := ResolveThemeSecondaryColor("wasong", "#000000"); got != "#fffeee" {
		t.Fatalf("wasong ignores custom secondary -> %q", got)
	}
	if got := ResolveThemeSecondaryColor("custom", "#FfFfEe"); got != "#ffffee" {
		t.Fatalf("custom secondary -> %q", got)
	}
	if got := ResolveThemeSecondaryColor("custom", "bad"); got != DefaultThemeSecondaryColor {
		t.Fatalf("bad custom secondary -> %q", got)
	}
	if got := ResolveThemeSecondaryColor("ningye_cream", ""); got != "#fffbea" {
		t.Fatalf("ningye_cream secondary -> %q", got)
	}
}
