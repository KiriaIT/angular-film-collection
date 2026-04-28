import { Injectable, effect, signal } from '@angular/core';

export type AppTheme = 'dark' | 'light';

const STORAGE_KEY = 'film-collection-theme';

function readStoredTheme(): AppTheme {
  if (typeof localStorage === 'undefined') {
    return 'dark';
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === 'light' ? 'light' : 'dark';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<AppTheme>(readStoredTheme());
  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, this._theme());
      }
    });
  }

  toggle(): void {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }
}
