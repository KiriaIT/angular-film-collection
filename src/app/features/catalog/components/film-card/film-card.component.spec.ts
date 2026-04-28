import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { FilmCardComponent } from './film-card.component';
import { Film } from '../../../../models/film.model';

const MOCK_FILM: Film = {
  id: 42,
  title: 'Spec Film',
  year: 2020,
  genre: 'Drama',
  rating: 8,
  duration: 95,
  description: 'Test description',
  posterUrl: 'https://placehold.co/300x450.png?text=Spec',
  isFavorite: false,
};

describe('FilmCardComponent', () => {
  let fixture: ComponentFixture<FilmCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmCardComponent],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilmCardComponent);
    fixture.componentRef.setInput('film', MOCK_FILM);
    fixture.detectChanges();
  });

  it('renders film title', () => {
    const title = fixture.nativeElement.querySelector('.film-card__title');
    expect(title?.textContent?.trim()).toBe('Spec Film');
  });

  it('emits favoriteToggled with film id when favorite button is clicked', () => {
    let emitted = -1;
    fixture.componentInstance.favoriteToggled.subscribe((id: number) => {
      emitted = id;
    });
    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector('.film-card__fav');
    expect(btn).toBeTruthy();
    btn?.click();
    fixture.detectChanges();
    expect(emitted).toBe(42);
  });
});
