# Film Collection

Small **Angular 20** learning project: a film catalog backed by mock data. It demonstrates standalone components, lazy-loaded routes, a signal-based `FilmService`, a custom autofocus directive, a duration pipe, and breadcrumbs — **without using RxJS in application code** (only Angular Signals for reactivity).

## Features

- Home catalog with search (**title or genre** substring), **genre** dropdown (All + dynamic list), sort by title/year/rating, **Clear all** to reset filters, favorite toggles (favorites **persist** in `localStorage` across refresh), and navigation to film details
- Catalog **skeleton placeholders** on the first paint, then real cards (`afterNextRender` in `CatalogComponent` — no `setTimeout` for reactive loading state, per project rules)
- **Empty state** when search returns no films: inline illustration, hint text, and **Reset filters** when filters are active
- **Export to JSON** on the catalog toolbar — downloads the **current list** (after search, genre, and sort) as pretty-printed JSON; **Favorites** page has **Export favorites JSON** (sorted by title)
- Mock films from **`src/app/data/films.json`** — same **`posterUrl`** strings as the RS School [films.json](https://cdn.jsdelivr.net/gh/rolling-scopes-school/tasks@master/angular/tasks/angular-intro-task/films.json) task file (`placehold.co`). **`posterDisplayUrl()`** only normalizes the URL for the `<img>` (e.g. `300x450` → `300x450.png`); the JSON file is not rewritten. On load error, fallback is still **placehold.co** with the film title
- **Light / dark** theme toggle (persisted in `localStorage`) with smooth color transitions
- Enter animations on cards and hover motion on posters
- Film detail page with URL-bound `id` (`withComponentInputBinding`)
- **Favorites** page (`/favorites`) — same cards as the catalog, list from `FilmService.favorites` `computed()`
- About page
- Header, breadcrumbs, and footer on every view
- **404 page** for unknown URLs: animated illustration, **Take me home** (`routerLink`), breadcrumbs, and document title `Film Collection | Page Not Found` via the route `title` property
- **A11y:** film cards expose **View details for …** on the navigable card; favorite control keeps `aria-label`
- **Unit / component tests:** `DurationPipe`, `posterDisplayUrl`, `FilmService.toggleFavorite()`, `FilmCardComponent`, `CatalogComponent` (genre filter), `FavoritesComponent` (export); **routing smoke** in `app.integration.spec.ts` — run with `npm test` (see below)

The repo’s `films.json` matches the official task file; poster URLs stay **placehold.co**. Normalization happens in `shared/utils/poster-display.ts` at display time only.

## RS School checklist (Angular Intro: Film Collection)

This task is not graded, but it is a **mandatory prerequisite** for applying for a mentor; mentors may use your repo to gauge skill. The list below mirrors the official pre-submission checklist and points to this codebase.

### Components

- [x] Film card accepts data via `input()` — `film-card.component.ts` (`input.required<Film>()`)
- [x] Film card notifies parent via `output()` — `favoriteToggled` → `catalog` / `favorites`
- [x] Film list is rendered using `@for` — `catalog.component.html`, `favorites` template
- [x] Conditional rendering for empty search (**“Nothing found”**) — `@for` … `@empty` in `catalog.component.html` (same UX as a separate `@if`; message in the empty block)
- [x] Details page shows full film information — `film-detail.component.html` (poster, title, year, genre, rating, duration, description)
- [x] Header, breadcrumbs, and footer on every page — `app.component.html` shell

### Routing

- [x] At least 2 routes (list + details) — `app.routes.ts` (`''`, `film/:id`; also `about`, `favorites`, `**`)
- [x] Navigation via `routerLink` — header, cards, breadcrumbs, buttons
- [x] URL parameter on details — `FilmDetailComponent` `input.required<string>()` + `withComponentInputBinding()` in `app.config.ts`
- [x] Wildcard handled — lazy `NotFoundComponent` for `**` (404 page)

### Directive

- [x] Standalone autofocus attribute directive — `shared/directives/autofocus.directive.ts`
- [x] Sets focus when the element appears — `ngAfterViewInit` + deferred `focus()`
- [x] Applied to the catalog search field — `catalog.component.html`

### Pipe

- [x] Standalone duration pipe — `shared/pipes/duration.pipe.ts`
- [x] Human-readable minutes (`60` → `1h`, `45` → `45min`, `90` → `1h 30min`)
- [x] Used in a component template — `film-detail.component.html`

### Service and signals

- [x] Film service registered globally — `FilmService` `providedIn: 'root'`
- [x] Collection in `signal()` — `_films` in `core/services/film.service.ts`
- [x] Favorites via `computed()` — `favorites`; catalog filtering via `computed()` — `filteredFilms` / `displayedFilms` in `catalog.component.ts`
- [x] Search by title (task) — extended to **title or genre** in `filteredFilms`; `searchQuery` signal + `computed()`

### Code quality

- [x] Mock films in a separate file — `src/app/data/films.json` (imported in `film.service.ts`)
- [x] TypeScript strict mode — root `tsconfig.json`
- [x] No linter errors — `ng lint` (or `npx ng lint` / `npm run lint`)
- [x] Logical folders — `core/`, `shared/`, `features/`, `layout/`, `models/`, `data/`
- [x] README with description and how to run — this file

## Prerequisites

- **Node.js** versions supported by Angular 20 for this repo: **20.19+**, **22.12+**, or **24+** (use **even** LTS majors — **avoid Node 21, 23**, etc.; they can break the CLI with `ERR_REQUIRE_ESM`).
- Optional: if you use **nvm**, run `nvm use` in the project root — a **`.nvmrc`** file pins **Node 22** for a known-good setup.

## How to run

Work from the project root (`angular-film-collection/`).

### RS School submission (official wording)

The task says: **make sure the project runs via `ng serve` without errors.**

```bash
npm install
ng serve
```

Open **http://localhost:4200/**. The dev server compiles the app and reloads on file changes.

**If you see `ng: command not found`**, pick one of these (all run the same Angular dev server):

1. **Local CLI (no global install)** — same as `ng serve`, using the dependency from `node_modules`:

   ```bash
   npx ng serve
   ```

2. **npm script** — `npm start` is defined as `ng serve` in `package.json`:

   ```bash
   npm start
   ```

3. **Global CLI** (optional, matches what many mentors expect when they type `ng serve`):

   ```bash
   npm install -g @angular/cli@20
   ng serve
   ```

Optional: `ng serve --open` (or `npx ng serve --open`) opens the browser automatically.

### Production build

Per CLI (same as in the Angular docs):

```bash
ng build
```

If `ng` is not on your PATH:

```bash
npx ng build
```

Faster local compile (development configuration):

```bash
npx ng build --configuration development
```

(`npm run build` runs `ng build` from `package.json`.)

### Lint

```bash
ng lint
```

or `npx ng lint` / `npm run lint`.

### Unit tests (Karma)

```bash
ng test
```

or `npx ng test` / `npm test`.

By default Karma runs in **watch** mode. One-shot run (e.g. CI), with headless Chrome when installed:

```bash
npx ng test --no-watch --browsers=ChromeHeadless
```

---
💡 **Note:** This project was developed as part of the **RS School Angular Course**. It demonstrates advanced usage of Angular Signals and standalone architecture.
---
