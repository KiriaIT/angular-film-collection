import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

/** Threshold in px — FAB appears after scrolling past this amount. */
const VISIBILITY_SCROLL_Y = 280;

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'scroll-top-host',
    '(window:scroll)': 'syncScrollY()',
    '(window:resize)': 'syncScrollY()',
  },
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss',
})
export class ScrollToTopComponent {
  private readonly platformId = inject(PLATFORM_ID);

  /** Vertical scroll offset of the window. */
  protected readonly scrollY = signal(0);

  protected readonly visible = computed(() => this.scrollY() > VISIBILITY_SCROLL_Y);

  protected syncScrollY(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.scrollY.set(globalThis.scrollY);
  }

  protected onScrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
