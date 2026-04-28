import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <span>© {{ year }} Kiria </span>
      <a
        href="https://github.com/your-username/angular-film-collection"
        target="_blank"
        rel="noopener noreferrer"
        class="footer__link"
        >GitHub</a
      >
    </footer>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
