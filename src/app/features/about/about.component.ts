import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private readonly breadcrumbService = inject(BreadcrumbService);
  protected readonly appName = environment.appName;
  protected readonly apiBaseUrl = environment.apiBaseUrl;

  ngOnInit(): void {
    this.breadcrumbService.set([
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
    ]);
  }
}
