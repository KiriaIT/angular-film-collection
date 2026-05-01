import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stars',
  standalone: true,
  pure: true,
})
export class StarsPipe implements PipeTransform {
  transform(rating: number): string {
    if (!Number.isFinite(rating) || rating < 0) return '☆☆☆☆☆';
    const filled = Math.round((Math.min(rating, 10) / 10) * 5);
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  }
}
