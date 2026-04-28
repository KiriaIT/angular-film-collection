import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';

/**
 * Lightweight routing integration check: router config resolves without RxJS-based setup.
 */
describe('App routing (integration)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('navigates to home URL', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    expect(router.url).toBe('/');
  });

  it('wildcard path is defined last so lazy 404 can load', () => {
    const wild = routes[routes.length - 1];
    expect(wild.path).toBe('**');
  });
});
