import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { Film } from '../../../../models/film.model';
import { posterDisplayUrl } from '../../../../shared/utils/poster-display';
import { posterFallbackUrl } from '../../../../shared/utils/poster-fallback';

@Component({
  selector: 'app-film-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './film-card.component.html',
  styleUrl: './film-card.component.scss',
  animations: [
    trigger('cardEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px)' }),
        animate(
          '320ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
  ],
})
export class FilmCardComponent {
  readonly film = input.required<Film>();
  readonly favoriteToggled = output<number>();

  protected readonly isHighRated = computed(() => this.film().rating >= 8);

  protected readonly posterSrc = computed(() => posterDisplayUrl(this.film().posterUrl));

  protected onPosterError(event: Event): void {
    const el = event.target;
    if (!(el instanceof HTMLImageElement)) {
      return;
    }
    el.src = posterFallbackUrl(this.film().title);
    el.onerror = null;
  }

  protected onToggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggled.emit(this.film().id);
  }
}
