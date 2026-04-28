# Film Collection

Small **Angular 20** learning project: a film catalog backed by mock data. It demonstrates standalone components, lazy-loaded routes, a signal-based `FilmService`, a custom autofocus directive, a duration pipe, and breadcrumbs — **without using RxJS in application code** (only Angular Signals for reactivity).

## Features

- Home catalog with title search, sort by title/year/rating, **Clear all** to reset filters, favorite toggles (favorites **persist** in `localStorage` across refresh), and navigation to film details
- Default posters from **TMDB** / **Picsum** with automatic fallback if a URL fails
- **Light / dark** theme toggle (persisted in `localStorage`) with smooth color transitions
- Enter animations on cards and hover motion on posters
- Film detail page with URL-bound `id` (`withComponentInputBinding`)
- About page
- Header, breadcrumbs, and footer on every view
- Wildcard route redirects unknown URLs to home

Posters use [TMDB](https://www.themoviedb.org/) image URLs where paths stay valid; a few titles use [Lorem Picsum](https://picsum.photos/) seeds so grids always load. Broken URLs fall back to [placehold.co](https://placehold.co) with the film title.

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

---
💡 **Note:** This project was developed as part of the **RS School Angular Course**.|
 Made by me It demonstrates advanced usage of Angular Signals and Standalone architecture.
---
