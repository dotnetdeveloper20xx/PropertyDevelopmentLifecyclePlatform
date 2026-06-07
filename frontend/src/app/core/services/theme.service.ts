import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_THEME, ThemeName, THEMES } from '../../design-system/themes/theme.config';

const THEME_STORAGE_KEY = 'buildEstate_theme';

/**
 * Theme management service. Controls the active DaisyUI theme.
 * Persists user preference in localStorage.
 * Applies theme by setting `data-theme` attribute on <html>.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<ThemeName>(this.getStoredTheme());
  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.applyTheme(this.currentThemeSubject.value);
  }

  get currentTheme(): ThemeName {
    return this.currentThemeSubject.value;
  }

  get availableThemes() {
    return THEMES;
  }

  setTheme(theme: ThemeName): void {
    this.applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.currentThemeSubject.next(theme);
  }

  toggleDarkMode(): void {
    const next = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  private applyTheme(theme: ThemeName): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private getStoredTheme(): ThemeName {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    return stored && THEMES.some(t => t.name === stored) ? stored : DEFAULT_THEME;
  }
}
