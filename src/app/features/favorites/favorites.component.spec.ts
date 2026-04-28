import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal, WritableSignal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import { FilmService } from '../../core/services/film.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { JsonExportService } from '../../core/services/json-export.service';
import { Film } from '../../models/film.model';

const FAV: Film = {
  id: 9,
  title: 'Zeta Last',
  year: 2023,
  genre: 'Drama',
  rating: 8,
  duration: 92,
  description: 'z',
  posterUrl: 'https://placehold.co/300x450.png?text=Z',
  isFavorite: true,
};

describe('FavoritesComponent', () => {
  let fixture: ComponentFixture<FavoritesComponent>;
  let exportSpy: jasmine.Spy;

  beforeEach(async () => {
    const filmsWritable: WritableSignal<Film[]> = signal([FAV]);
    exportSpy = jasmine.createSpy('downloadFilmsAsJson');
    const filmStub = {
      films: filmsWritable.asReadonly(),
      favorites: computed(() => filmsWritable().filter((f) => f.isFavorite)),
      getById: (id: number) => filmsWritable().find((f) => f.id === id),
      toggleFavorite: jasmine.createSpy('toggleFavorite'),
    };

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: FilmService, useValue: filmStub },
        { provide: BreadcrumbService, useValue: { set: jasmine.createSpy('setCrumbs') } },
        { provide: JsonExportService, useValue: { downloadFilmsAsJson: exportSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    fixture.detectChanges();
  });

  it('calls JsonExportService with favorites when export button is clicked', () => {
    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector('.favorites__export');
    expect(btn).toBeTruthy();
    btn?.click();
    expect(exportSpy).toHaveBeenCalledTimes(1);
    const [films, filename] = exportSpy.calls.mostRecent().args as [Film[], string];
    expect(films.length).toBe(1);
    expect(films[0].id).toBe(9);
    expect(filename).toMatch(/^film-collection-favorites-\d{4}-\d{2}-\d{2}\.json$/);
  });
});
