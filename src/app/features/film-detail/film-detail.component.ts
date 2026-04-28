import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { FilmService } from '../../core/services/film.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { Film } from '../../models/film.model';
import { FilmCardComponent } from '../catalog/components/film-card/film-card.component';
import { posterDisplayUrl } from '../../shared/utils/poster-display';
import { posterFallbackUrl } from '../../shared/utils/poster-fallback';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DurationPipe, FilmCardComponent],
  templateUrl: './film-detail.component.html',
  styleUrl: './film-detail.component.scss',
})
export class FilmDetailComponent {
  readonly id = input.required<string>();

  private readonly filmService = inject(FilmService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected readonly film = computed(() => this.filmService.getById(Number(this.id())));

  /** Same genre as the current film, excluding itself; higher rating first. */
  protected readonly similarFilms = computed((): Film[] => {
    const f = this.film();
    if (!f) {
      return [];
    }
    return [...this.filmService.films()]
      .filter((item) => item.id !== f.id && item.genre === f.genre)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  });

  protected readonly posterSrc = computed(() => {
    const f = this.film();
    return f ? posterDisplayUrl(f.posterUrl) : '';
  });

  private readonly _syncBreadcrumbs = effect(() => {
    const f = this.film();
    const routeId = this.id();
    this.breadcrumbService.set([
      { label: 'Home', url: '/' },
      { label: f?.title ?? 'Film', url: `/film/${routeId}` },
    ]);
  });

  protected onPosterError(event: Event, title: string): void {
    const el = event.target;
    if (!(el instanceof HTMLImageElement)) {
      return;
    }
    el.src = posterFallbackUrl(title);
    el.onerror = null;
  }

  protected onFavoriteToggled(filmId: number): void {
    this.filmService.toggleFavorite(filmId);
  }
}
