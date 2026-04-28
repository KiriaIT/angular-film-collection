import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FilmCardComponent } from './components/film-card/film-card.component';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { FilmService } from '../../core/services/film.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { JsonExportService } from '../../core/services/json-export.service';

export type CatalogSortKey = 'title' | 'year' | 'rating';
export type CatalogSortDir = 'asc' | 'desc';

@Component({
  selector: 'app-catalog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilmCardComponent, AutofocusDirective],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  private readonly filmService = inject(FilmService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly jsonExportService = inject(JsonExportService);

  /** First paint shows skeletons; no setTimeout — uses browser render hook only. */
  protected readonly catalogContentReady = signal(false);

  protected readonly skeletonSlots: readonly number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  ];

  protected readonly searchQuery = signal('');
  /** Empty string = all genres. */
  protected readonly genreFilter = signal('');
  protected readonly sortKey = signal<CatalogSortKey>('title');
  protected readonly sortDir = signal<CatalogSortDir>('asc');

  protected readonly genreOptions = computed(() => {
    const genres = new Set<string>();
    for (const f of this.filmService.films()) {
      genres.add(f.genre);
    }
    return [...genres].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  });

  protected readonly hasActiveFilters = computed(() => {
    const q = this.searchQuery().trim();
    return (
      q !== '' ||
      this.genreFilter() !== '' ||
      this.sortKey() !== 'title' ||
      this.sortDir() !== 'asc'
    );
  });

  protected readonly filteredFilms = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const genre = this.genreFilter();
    let list = this.filmService.films();
    if (q) {
      list = list.filter(
        (f) =>
          f.title.toLowerCase().includes(q) || f.genre.toLowerCase().includes(q),
      );
    }
    if (genre) {
      list = list.filter((f) => f.genre === genre);
    }
    return list;
  });

  protected readonly displayedFilms = computed(() => {
    const films = [...this.filteredFilms()];
    const key = this.sortKey();
    const dir = this.sortDir();
    films.sort((a, b) => {
      let cmp = 0;
      if (key === 'title') {
        cmp = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      } else if (key === 'year') {
        cmp = a.year - b.year;
      } else {
        cmp = a.rating - b.rating;
      }
      return dir === 'asc' ? cmp : -cmp;
    });
    return films;
  });

  constructor() {
    afterNextRender(() => {
      this.catalogContentReady.set(true);
    });
  }

  ngOnInit(): void {
    this.breadcrumbService.set([{ label: 'Home', url: '/' }]);
  }

  protected onSearchChange(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.searchQuery.set(target.value);
    }
  }

  protected onSortKeyChange(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      const v = target.value;
      if (v === 'title' || v === 'year' || v === 'rating') {
        this.sortKey.set(v);
      }
    }
  }

  protected onSortDirChange(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      const v = target.value;
      if (v === 'asc' || v === 'desc') {
        this.sortDir.set(v);
      }
    }
  }

  protected onClearFilters(): void {
    this.searchQuery.set('');
    this.genreFilter.set('');
    this.sortKey.set('title');
    this.sortDir.set('asc');
  }

  protected onGenreChange(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      this.genreFilter.set(target.value);
    }
  }

  protected onExportCatalogJson(): void {
    const stamp = new Date().toISOString().slice(0, 10);
    this.jsonExportService.downloadFilmsAsJson(
      this.displayedFilms(),
      `film-collection-catalog-${stamp}.json`,
    );
  }

  protected onFavoriteToggled(id: number): void {
    this.filmService.toggleFavorite(id);
  }
}
