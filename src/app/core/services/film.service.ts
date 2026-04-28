import { Injectable, computed, effect, signal } from '@angular/core';
import { Film } from '../../models/film.model';
import filmsJson from '../../data/films.json';

const FAVORITE_IDS_KEY = 'film-collection-favorite-ids';

function readFavoriteIds(): ReadonlySet<number> {
  if (typeof localStorage === 'undefined') {
    return new Set();
  }
  try {
    const raw = localStorage.getItem(FAVORITE_IDS_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(
      parsed.filter((x): x is number => typeof x === 'number' && Number.isInteger(x)),
    );
  } catch {
    return new Set();
  }
}

function initialFilmsFromJson(): Film[] {
  const favoriteIds = readFavoriteIds();
  return (filmsJson as Film[]).map((f) => ({ ...f, isFavorite: favoriteIds.has(f.id) }));
}

@Injectable({ providedIn: 'root' })
export class FilmService {
  private readonly _films = signal<Film[]>(initialFilmsFromJson());

  readonly films = this._films.asReadonly();
  readonly favorites = computed(() => this._films().filter((f) => f.isFavorite));

  constructor() {
    effect(() => {
      const ids = this._films()
        .filter((f) => f.isFavorite)
        .map((f) => f.id);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(FAVORITE_IDS_KEY, JSON.stringify(ids));
      }
    });
  }

  getById(id: number): Film | undefined {
    return this._films().find((f) => f.id === id);
  }

  toggleFavorite(id: number): void {
    this._films.update((list) =>
      list.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)),
    );
  }
}
