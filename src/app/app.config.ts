import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withRouterConfig,
  withInMemoryScrolling
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload' // <-- Fait reloader la page même si seul le param change
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled' // <-- Remet en haut
      })
    ),
    provideHttpClient(withFetch()),
  ]
};
