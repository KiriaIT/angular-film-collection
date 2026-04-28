import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);
  protected readonly crumbs = this.breadcrumbService.crumbs;
}
