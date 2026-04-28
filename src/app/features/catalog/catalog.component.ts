import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FilmCardComponent } from './components/film-card/film-card.component';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { FilmService } from '../../core/services/film.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';

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

  protected readonly searchQuery = signal('');

  protected readonly filteredFilms = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return q
      ? this.filmService.films().filter((f) => f.title.toLowerCase().includes(q))
      : this.filmService.films();
  });

  ngOnInit(): void {
    this.breadcrumbService.set([{ label: 'Home', url: '/' }]);
  }

  protected onSearchChange(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.searchQuery.set(target.value);
    }
  }

  protected onFavoriteToggled(id: number): void {
    this.filmService.toggleFavorite(id);
  }
}
