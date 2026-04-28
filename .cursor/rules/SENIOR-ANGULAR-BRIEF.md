# Film Collection — Senior Angular Developer Brief

## Project Summary

Build **Film Collection** — a client-side movie catalog SPA, submitted as a course prerequisite.
A mentor will evaluate your solution. They judge architectural decisions and code quality,
not just whether it works. Every file should reflect senior-level thinking.

---

## Tech Stack

| Concern | Technology |
|---------|-----------|
| Framework | Angular 20+ |
| Components | Standalone only — no NgModules |
| Reactivity | Angular Signals exclusively |
| Styling | Plain SCSS — no UI libraries |
| Language | TypeScript strict mode |
| Routing | Angular Router + `withComponentInputBinding()` |
| Data | Local mock (no HTTP) |
| RxJS | **FORBIDDEN — zero usage** |

---

## Architecture — Clean Layers

```
┌──────────────────────────────────────────┐
│              Presentation                │  ← Components, Pipes, Directives
│   (features/, layout/, shared/)          │      Templates, SCSS
├──────────────────────────────────────────┤
│              Application                 │  ← Services  (core/)
│    FilmService · BreadcrumbService        │      Signal-based state
├──────────────────────────────────────────┤
│               Domain                     │  ← Interfaces (models/)
│      Film · Breadcrumb interfaces         │      Zero Angular imports
├──────────────────────────────────────────┤
│            Infrastructure                │  ← Mock data (data/)
│         FILMS_MOCK: Film[]               │      Swap for HTTP later
└──────────────────────────────────────────┘
```

Rule: **upper layers may depend on lower, never the reverse.**

---

## Folder Structure

```
src/app/
├── core/
│   └── services/
│       ├── film.service.ts           # Film state — signal-based singleton
│       └── breadcrumb.service.ts     # Breadcrumb state — signal-based singleton
│
├── shared/
│   ├── directives/
│   │   └── autofocus.directive.ts   # Standalone attribute directive
│   └── pipes/
│       └── duration.pipe.ts         # Standalone pure pipe
│
├── features/
│   ├── catalog/                     # Route: /
│   │   ├── catalog.component.ts     # Smart container
│   │   ├── catalog.component.html
│   │   ├── catalog.component.scss
│   │   └── components/film-card/    # Dumb presentational
│   │       ├── film-card.component.ts
│   │       ├── film-card.component.html
│   │       └── film-card.component.scss
│   ├── film-detail/                 # Route: /film/:id
│   │   ├── film-detail.component.ts
│   │   ├── film-detail.component.html
│   │   └── film-detail.component.scss
│   └── about/                       # Route: /about  ← required by task
│       ├── about.component.ts
│       ├── about.component.html
│       └── about.component.scss
│
├── layout/                          # Present on every page
│   ├── header/                      # App title + nav (Home, About)
│   ├── footer/                      # Year, author, GitHub link
│   └── breadcrumbs/                 # Signal-driven breadcrumb trail
│
├── data/
│   └── films.mock.ts                # FILMS_MOCK: Film[] — 10+ entries
│
├── models/
│   ├── film.model.ts                # Film interface
│   └── breadcrumb.model.ts          # Breadcrumb interface
│
├── app.routes.ts
├── app.component.ts                 # Root shell — no logic
├── app.component.html               # header / breadcrumbs / outlet / footer
└── app.config.ts                    # provideRouter + withComponentInputBinding
```

---

## Data Models

```typescript
// src/app/models/film.model.ts
export interface Film {
  readonly id: number;
  readonly title: string;
  readonly year: number;
  readonly genre: string;
  readonly rating: number;      // 0–10
  readonly duration: number;    // minutes
  readonly description: string;
  readonly posterUrl: string;
  isFavorite: boolean;          // only mutable field
}

// src/app/models/breadcrumb.model.ts
export interface Breadcrumb {
  readonly label: string;
  readonly url: string;
}
```

Mock data: https://cdn.jsdelivr.net/gh/rolling-scopes-school/tasks@master/angular/tasks/angular-intro-task/films.json
→ Save as `src/app/data/films.mock.ts`, type as `Film[]`, export as `FILMS_MOCK`.

---

## app.config.ts — `withComponentInputBinding` is mandatory

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    // withComponentInputBinding() binds :id URL segment directly to input()
    // This eliminates ActivatedRoute injection in all components
  ],
};
```

---

## Routes

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
    title: 'Film Collection',
  },
  {
    path: 'film/:id',
    loadComponent: () =>
      import('./features/film-detail/film-detail.component').then(m => m.FilmDetailComponent),
    title: 'Film Details',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then(m => m.AboutComponent),
    title: 'About',
  },
  { path: '**', redirectTo: '' },   // ← wildcard always last
];
```

---

## Services

### FilmService

```typescript
@Injectable({ providedIn: 'root' })
export class FilmService {
  private readonly _films = signal<Film[]>(FILMS_MOCK);

  readonly films    = this._films.asReadonly();
  readonly favorites = computed(() => this._films().filter(f => f.isFavorite));

  getById(id: number): Film | undefined {
    return this._films().find(f => f.id === id);
  }

  toggleFavorite(id: number): void {
    this._films.update(list =>
      list.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)
    );
  }
}
```

**Why these decisions:**
- `asReadonly()` exposes state without allowing external mutation — enforces unidirectional flow
- Spread `{ ...f }` is required: signals use reference equality to detect changes
- `toggleFavorite` returns `void` — it is a command, not a query

### BreadcrumbService — signals-only breadcrumb state

```typescript
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _crumbs = signal<Breadcrumb[]>([]);
  readonly crumbs = this._crumbs.asReadonly();

  set(crumbs: Breadcrumb[]): void {
    this._crumbs.set(crumbs);
  }
}
```

**Why a dedicated service instead of route `data`:**
- Film detail breadcrumb needs the film's title — only available after `getById()` resolves
- Static route `data` cannot hold dynamic values like film titles
- A service signal is the cleanest signals-only solution without any RxJS

---

## Root Component

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, BreadcrumbsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-header />
<app-breadcrumbs />
<main class="content">
  <router-outlet />
</main>
<app-footer />
```

---

## Layout Components

### HeaderComponent — Home + About nav with active state

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
```

```html
<header class="header">
  <a routerLink="/" class="header__logo">🎬 Film Collection</a>
  <nav class="header__nav">
    <a routerLink="/"
       routerLinkActive="header__link--active"
       [routerLinkActiveOptions]="{ exact: true }"
       class="header__link">Home</a>
    <a routerLink="/about"
       routerLinkActive="header__link--active"
       class="header__link">About</a>
  </nav>
</header>
```

### FooterComponent

```typescript
@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <span>© {{ year }} Your Name</span>
      <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </footer>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
```

### BreadcrumbsComponent — reads from BreadcrumbService signal

```typescript
@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);
  protected readonly crumbs = this.breadcrumbService.crumbs;
}
```

```html
<nav class="breadcrumbs" aria-label="breadcrumb">
  @for (crumb of crumbs(); track crumb.url) {
    @if (!$last) {
      <a [routerLink]="crumb.url" class="breadcrumbs__link">{{ crumb.label }}</a>
      <span class="breadcrumbs__sep" aria-hidden="true"> › </span>
    } @else {
      <!-- last crumb = current page — NOT a link, per spec -->
      <span class="breadcrumbs__current" aria-current="page">{{ crumb.label }}</span>
    }
  }
</nav>
```

---

## Feature Components

### CatalogComponent (Smart Container)

```typescript
@Component({
  selector: 'app-catalog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilmCardComponent, AutofocusDirective],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit {
  private readonly filmService       = inject(FilmService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected readonly searchQuery = signal('');

  // computed() — re-evaluated only when filmService.films or searchQuery changes
  protected readonly filteredFilms = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return q
      ? this.filmService.films().filter(f => f.title.toLowerCase().includes(q))
      : this.filmService.films();
  });

  ngOnInit(): void {
    this.breadcrumbService.set([{ label: 'Home', url: '/' }]);
  }

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  protected onFavoriteToggled(id: number): void {
    this.filmService.toggleFavorite(id);
  }
}
```

```html
<!-- catalog.component.html -->
<section class="catalog">
  <input
    appAutofocus
    type="text"
    class="catalog__search"
    placeholder="Search films..."
    [value]="searchQuery()"
    (input)="onSearchChange($any($event.target).value)"
    aria-label="Search films"
  />
  <div class="catalog__grid">
    @for (film of filteredFilms(); track film.id) {
      <app-film-card [film]="film" (favoriteToggled)="onFavoriteToggled($event)" />
    } @empty {
      <p class="catalog__empty">Nothing found</p>
    }
  </div>
</section>
```

### FilmDetailComponent (Smart) — route param via `input()`, no ActivatedRoute

```typescript
@Component({
  selector: 'app-film-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DurationPipe],
  templateUrl: './film-detail.component.html',
})
export class FilmDetailComponent implements OnInit {
  // withComponentInputBinding() in app.config.ts makes this work automatically
  readonly id = input.required<string>();   // bound from :id URL segment

  private readonly filmService       = inject(FilmService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected readonly film = signal<Film | undefined>(undefined);

  ngOnInit(): void {
    const film = this.filmService.getById(Number(this.id()));
    this.film.set(film);
    this.breadcrumbService.set([
      { label: 'Home', url: '/' },
      { label: film?.title ?? 'Film', url: `/film/${this.id()}` },
    ]);
  }
}
```

```html
<!-- film-detail.component.html -->
@if (film(); as f) {
  <article class="film-detail">
    <img [src]="f.posterUrl" [alt]="f.title" class="film-detail__poster" />
    <div class="film-detail__info">
      <h1>{{ f.title }}</h1>
      <p>{{ f.year }} · {{ f.genre }} · {{ f.duration | duration }} · ★ {{ f.rating }}</p>
      <p>{{ f.description }}</p>
      <a routerLink="/" class="btn">← Back to catalog</a>
    </div>
  </article>
} @else {
  <p>Film not found. <a routerLink="/">← Go back</a></p>
}
```

### FilmCardComponent (Dumb Presentational)

```typescript
@Component({
  selector: 'app-film-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './film-card.component.html',
})
export class FilmCardComponent {
  readonly film = input.required<Film>();
  readonly favoriteToggled = output<number>();   // emits film id

  protected onToggleFavorite(event: Event): void {
    event.stopPropagation();   // prevents RouterLink from firing
    this.favoriteToggled.emit(this.film().id);
  }
}
```

```html
<article class="film-card" [routerLink]="['/film', film().id]">
  <img [src]="film().posterUrl" [alt]="film().title" class="film-card__poster" loading="lazy" />
  <div class="film-card__body">
    <h3>{{ film().title }}</h3>
    <div class="film-card__meta">
      <span>{{ film().year }}</span>
      <span>{{ film().genre }}</span>
      <span>★ {{ film().rating }}</span>
    </div>
    <button
      type="button"
      class="film-card__fav"
      [class.film-card__fav--active]="film().isFavorite"
      [attr.aria-label]="film().isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      (click)="onToggleFavorite($event)"
    >
      {{ film().isFavorite ? '♥' : '♡' }}
    </button>
  </div>
</article>
```

---

## Custom Directive — Autofocus

```typescript
@Directive({ selector: '[appAutofocus]', standalone: true })
export class AutofocusDirective implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    // setTimeout(0) defers until after all child view inits complete
    setTimeout(() => this.el.nativeElement.focus(), 0);
  }
}
```

---

## Custom Pipe — Duration

```typescript
@Pipe({ name: 'duration', standalone: true, pure: true })
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    if (!minutes || minutes <= 0) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  }
}
```

Tests: `60 → "1h"` · `45 → "45min"` · `90 → "1h 30min"` · `0 → "—"`

---

## Lifecycle Hooks Reference

| Hook | Used in | Reason |
|------|---------|--------|
| `ngOnInit` | `CatalogComponent` | Set breadcrumbs |
| `ngOnInit` | `FilmDetailComponent` | Set breadcrumbs + load film by `this.id()` |
| `ngOnInit` | `AboutComponent` | Set breadcrumbs |
| `ngAfterViewInit` | `AutofocusDirective` | DOM is ready — call `.focus()` |
| `ngOnDestroy` | Not needed | Signals self-clean; no subscriptions |
| `ngDoCheck` | **Never** | Fires every cycle — destroys performance |
| `ngAfterContentChecked` | **Never** | Same — extreme performance cost |

---

## tsconfig Requirements

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## SOLID Applied

| Principle | Applied as |
|-----------|-----------|
| **S** Single Responsibility | `FilmService` = film state. `BreadcrumbService` = breadcrumb state. `DurationPipe` = formatting. `AutofocusDirective` = focus. Each does one thing. |
| **O** Open/Closed | Add sorting or genre filter via new `computed()` — existing code untouched. |
| **L** Liskov Substitution | Any valid `Film` object works in every component accepting `Film`. |
| **I** Interface Segregation | `FilmCardComponent` receives `Film` via `input()`, not `FilmService`. |
| **D** Dependency Inversion | Components depend on `Film` interface, not service implementation. |

---

## DRY / KISS / YAGNI Applied

- **DRY**: `Film` interface defined once. Duration logic in one pipe. Breadcrumb logic in one service.
- **KISS**: `getById()` is `.find()`. Breadcrumbs set imperatively in `ngOnInit`. No resolver.
- **YAGNI**: No NgRx. No HTTP layer. No caching. No guards. No resolvers.

---

## README Template

```markdown
# Film Collection

An Angular 20+ movie catalog SPA — standalone components and Angular Signals only.

## Features
- Browse 10+ films (poster, title, year, genre, rating)
- Live search / filter by title
- Add / remove favorites
- Film details page with full information and duration pipe
- About page
- Breadcrumbs on every page
- Responsive layout

## Tech Stack
- Angular 20+ · Standalone components · No NgModules
- Angular Signals · No RxJS
- TypeScript strict mode
- Plain SCSS

## Getting Started
npm install
ng serve
# → http://localhost:4200
```

---

## Pre-Submission Checklist

- [ ] `ng build` — zero errors, zero warnings
- [ ] `ng lint` — zero issues
- [ ] `grep -r "from 'rxjs'" src/` → empty
- [ ] Every component: `standalone: true` + `ChangeDetectionStrategy.OnPush`
- [ ] `withComponentInputBinding()` in `app.config.ts`
- [ ] `FilmService` and `BreadcrumbService`: `providedIn: 'root'`
- [ ] No `ActivatedRoute` in any component (use `input()`)
- [ ] `@for` tracks by `film.id`; `@empty` block for "Nothing found"
- [ ] `appAutofocus` on search input — focus on page open
- [ ] `duration` pipe used on film-detail page
- [ ] Header: Home + About links with `routerLinkActive`
- [ ] Footer: year + author name + GitHub link
- [ ] Breadcrumbs: "Home" · "Home › Film Title" · "Home › About"
- [ ] Last breadcrumb (current page) is NOT a link
- [ ] Favorite toggle persists within the session
- [ ] Wildcard route redirects to home
- [ ] `README.md` complete with `ng serve` instructions
- [ ] GitHub repository is public
