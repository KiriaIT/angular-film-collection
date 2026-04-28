import { ChangeDetectionStrategy, Component, computed, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilmCardComponent } from '../catalog/components/film-card/film-card.component';
import { FilmService } from '../../core/services/film.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { JsonExportService } from '../../core/services/json-export.service';

function formatTotalHoursForStats(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) {
    return '0';
  }
  const rounded = Math.round(hours * 10) / 10;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  return rounded.toFixed(1);
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilmCardComponent, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  private readonly filmService = inject(FilmService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly jsonExportService = inject(JsonExportService);

  protected readonly favorites = this.filmService.favorites;

  protected readonly favoritesStatisticsText = computed(() => {
    const list = this.filmService.favorites();
    const count = list.length;
    const totalMinutes = list.reduce((sum, f) => sum + f.duration, 0);
    const hours = formatTotalHoursForStats(totalMinutes / 60);
    const noun = count === 1 ? 'movie' : 'movies';
    return `You have ${count} favorite ${noun} (${hours} hours total duration)`;
  });

  ngOnInit(): void {
    this.breadcrumbService.set([
      { label: 'Home', url: '/' },
      { label: 'Favorites', url: '/favorites' },
    ]);
  }

  protected onFavoriteToggled(id: number): void {
    this.filmService.toggleFavorite(id);
  }

  protected onExportFavoritesJson(): void {
    const stamp = new Date().toISOString().slice(0, 10);
    const sorted = [...this.filmService.favorites()].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
    );
    this.jsonExportService.downloadFilmsAsJson(
      sorted,
      `film-collection-favorites-${stamp}.json`,
    );
  }
}
