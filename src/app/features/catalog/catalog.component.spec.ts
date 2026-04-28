import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal, WritableSignal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { FilmService } from '../../core/services/film.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { JsonExportService } from '../../core/services/json-export.service';
import { Film } from '../../models/film.model';

const STUB_FILMS: Film[] = [
  {
    id: 1,
    title: 'Alpha Story',
    year: 2020,
    genre: 'Drama',
    rating: 8,
    duration: 90,
    description: 'a',
    posterUrl: 'https://placehold.co/300x450.png?text=A',
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Beta Action',
    year: 2021,
    genre: 'Action',
    rating: 7,
    duration: 100,
    description: 'b',
    posterUrl: 'https://placehold.co/300x450.png?text=B',
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Gamma Drama',
    year: 2022,
    genre: 'Drama',
    rating: 9,
    duration: 110,
    description: 'c',
    posterUrl: 'https://placehold.co/300x450.png?text=C',
    isFavorite: false,
  },
];

describe('CatalogComponent', () => {
  let fixture: ComponentFixture<CatalogComponent>;
  let filmsWritable: WritableSignal<Film[]>;

  beforeEach(async () => {
    filmsWritable = signal([...STUB_FILMS]);
    const filmStub = {
      films: filmsWritable.asReadonly(),
      favorites: computed(() => filmsWritable().filter((f) => f.isFavorite)),
      getById: (id: number) => filmsWritable().find((f) => f.id === id),
      toggleFavorite: jasmine.createSpy('toggleFavorite'),
    };

    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: FilmService, useValue: filmStub },
        { provide: BreadcrumbService, useValue: { set: jasmine.createSpy('setCrumbs') } },
        { provide: JsonExportService, useValue: { downloadFilmsAsJson: jasmine.createSpy('export') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    fixture.detectChanges();
  });

  it('search text matches genre substring (e.g. Drama)', () => {
    const inst = fixture.componentInstance as unknown as {
      catalogContentReady: WritableSignal<boolean>;
    };
    inst.catalogContentReady.set(true);
    fixture.detectChanges();

    const input: HTMLInputElement | null = fixture.nativeElement.querySelector('.catalog__search');
    expect(input).toBeTruthy();
    input!.value = 'drama';
    input!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const titles = [...fixture.nativeElement.querySelectorAll('.film-card__title')].map(
      (el) => el.textContent?.trim() ?? '',
    );
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.some((t) => t.includes('Alpha'))).toBe(true);
    expect(titles.some((t) => t.includes('Gamma'))).toBe(true);
    expect(titles.some((t) => t.includes('Beta'))).toBe(false);
  });

  it('shows only films matching selected genre after genre filter changes', () => {
    const inst = fixture.componentInstance as unknown as {
      catalogContentReady: WritableSignal<boolean>;
    };
    inst.catalogContentReady.set(true);
    fixture.detectChanges();

    const genreSelect: HTMLSelectElement | null = fixture.nativeElement.querySelector(
      '[aria-label="Filter by genre"]',
    );
    expect(genreSelect).toBeTruthy();
    genreSelect!.value = 'Action';
    genreSelect!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-film-card');
    expect(cards.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Beta Action');
    expect(fixture.nativeElement.textContent).not.toContain('Alpha Story');
  });
});
