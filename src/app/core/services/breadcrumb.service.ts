import { Injectable, signal } from '@angular/core';
import { Breadcrumb } from '../../models/breadcrumb.model';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _crumbs = signal<Breadcrumb[]>([]);
  readonly crumbs = this._crumbs.asReadonly();

  set(crumbs: Breadcrumb[]): void {
    this._crumbs.set(crumbs);
  }
}
