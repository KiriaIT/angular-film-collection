import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private readonly breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumbService.set([
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
    ]);
  }
}
