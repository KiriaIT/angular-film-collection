export interface AppEnvironment {
  readonly production: boolean;
  /** Browser tab title & shell branding */
  readonly appName: string;
  /** Mock API origin for illustration (no HTTP client in this project) */
  readonly apiBaseUrl: string;
}
