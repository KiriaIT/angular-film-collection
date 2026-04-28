import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { FilmService } from '../../core/services/film.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { posterDisplayUrl } from '../../shared/utils/poster-display';
import { posterFallbackUrl } from '../../shared/utils/poster-fallback';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DurationPipe],
  templateUrl: './film-detail.component.html',
  styleUrl: './film-detail.component.scss',
})
export class FilmDetailComponent {
  readonly id = input.required<string>();

  private readonly filmService = inject(FilmService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected readonly film = computed(() => this.filmService.getById(Number(this.id())));

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
}
