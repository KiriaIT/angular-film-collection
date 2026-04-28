import { Injectable, computed, signal } from '@angular/core';
import { Film } from '../../models/film.model';
import { FILMS_MOCK } from '../../data/films.mock';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private readonly _films = signal<Film[]>(FILMS_MOCK);

  readonly films = this._films.asReadonly();
  readonly favorites = computed(() => this._films().filter((f) => f.isFavorite));

  getById(id: number): Film | undefined {
    return this._films().find((f) => f.id === id);
  }

  toggleFavorite(id: number): void {
    this._films.update((list) =>
      list.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)),
    );
  }
}
