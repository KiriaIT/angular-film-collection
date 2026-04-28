import { TestBed } from '@angular/core/testing';
import { FilmService } from './film.service';

describe('FilmService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('toggleFavorite flips isFavorite and updates the favorites computed list', () => {
    const service = TestBed.inject(FilmService);

    expect(service.getById(1)?.isFavorite).toBe(false);
    expect(service.favorites().some((f) => f.id === 1)).toBe(false);

    service.toggleFavorite(1);

    expect(service.getById(1)?.isFavorite).toBe(true);
    expect(service.favorites().some((f) => f.id === 1)).toBe(true);

    service.toggleFavorite(1);

    expect(service.getById(1)?.isFavorite).toBe(false);
    expect(service.favorites().some((f) => f.id === 1)).toBe(false);
  });
});
