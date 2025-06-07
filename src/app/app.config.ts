import { ApplicationConfig, APP_INITIALIZER, inject } from '@angular/core';
import {
  provideRouter,
  withRouterConfig,
  withInMemoryScrolling,
  Router,
  NavigationEnd,
  Event as RouterEvent
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { filter } from 'rxjs/operators';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
    ),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const router = inject(Router);
        return () => {
          router.events.pipe(
            filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd),
            filter((e: NavigationEnd) => e.urlAfterRedirects.startsWith('/equipe'))
          ).subscribe(() => {
            if (typeof window !== 'undefined') {
              window.scrollTo(0, 0);
            }
          });
        };
      },
      multi: true,
      deps: [Router]
    }
  ]
};
