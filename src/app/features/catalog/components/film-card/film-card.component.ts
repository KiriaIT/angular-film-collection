import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Film } from '../../../../models/film.model';

@Component({
  selector: 'app-film-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './film-card.component.html',
  styleUrl: './film-card.component.scss',
})
export class FilmCardComponent {
  readonly film = input.required<Film>();
  readonly favoriteToggled = output<number>();

  protected readonly isHighRated = computed(() => this.film().rating >= 8);

  protected onToggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggled.emit(this.film().id);
  }
}
