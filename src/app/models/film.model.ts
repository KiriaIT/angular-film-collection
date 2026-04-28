export interface Film {
  readonly id: number;
  readonly title: string;
  readonly year: number;
  readonly genre: string;
  readonly rating: number;
  readonly duration: number;
  readonly description: string;
  readonly posterUrl: string;
  isFavorite: boolean;
}
