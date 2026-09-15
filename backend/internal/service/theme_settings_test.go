package service

import "testing"

func TestNormalizeThemePreset(t *testing.T) {
	if got := NormalizeThemePreset(""); got != ThemePresetTeal {
		t.Fatalf("empty -> %q", got)
	}
	if got := NormalizeThemePreset("BLUE"); got != ThemePresetBlue {
		t.Fatalf("BLUE -> %q", got)
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
}
