import type { AppEnvironment } from './environment.model';

/** Development / default build configuration. Replaced in production builds (see angular.json). */
export type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  appName: 'Film Collection',
  apiBaseUrl: 'https://api.film-collection.local/mock/v1',
};
