import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { FilmService } from '../../core/services/film.service';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly appName = environment.appName;

  private readonly filmService = inject(FilmService);
  protected readonly favoritesCount = this.filmService.favorites;
}
