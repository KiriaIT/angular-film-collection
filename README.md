# Film Collection

Small **Angular 20** learning project: a film catalog backed by mock data. It demonstrates standalone components, lazy-loaded routes, a signal-based `FilmService`, a custom autofocus directive, a duration pipe, and breadcrumbs — **without using RxJS in application code** (only Angular Signals for reactivity).

## Features

- Home catalog with title search, favorite toggles, and navigation to film details
- Film detail page with URL-bound `id` (`withComponentInputBinding`)
- About page
- Header, breadcrumbs, and footer on every view
- Wildcard route redirects unknown URLs to home

## Prerequisites

- Node.js **20.19+**, **22.12+**, or **24+** (LTS recommended; odd major versions are not supported by Angular)

## How to run

Install dependencies (if needed):

```bash
npm install
```

Development server:

```bash
npm start
```

or:

```bash
ng serve
```

Open `http://localhost:4200/`.

Production build:

```bash
ng build
```

Lint:

```bash
ng lint
```

## Customize

- Replace **Your Name** and the GitHub URL in `src/app/layout/footer/footer.component.ts` before publishing your repository.

## Data

Films are defined in `src/app/data/films.mock.ts` (sourced from the Rolling Scopes School task JSON).
