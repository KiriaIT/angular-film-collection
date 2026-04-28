import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilmCardComponent } from '../catalog/components/film-card/film-card.component';
import { FilmService } from '../../core/services/film.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { JsonExportService } from '../../core/services/json-export.service';

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
