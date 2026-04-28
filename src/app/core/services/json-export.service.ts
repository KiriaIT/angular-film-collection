import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Film } from '../../models/film.model';

@Injectable({ providedIn: 'root' })
export class JsonExportService {
  private readonly document = inject(DOCUMENT);

  downloadFilmsAsJson(films: readonly Film[], filename: string): void {
    const json = JSON.stringify(films, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = this.document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    this.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}
