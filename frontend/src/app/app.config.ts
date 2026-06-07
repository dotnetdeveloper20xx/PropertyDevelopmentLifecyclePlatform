import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { opportunitiesReducer } from './features/land-acquisition/store/opportunities.reducer';
import { OpportunitiesEffects } from './features/land-acquisition/store/opportunities.effects';
import { planningReducer } from './features/planning/store/planning.reducer';
import { PlanningEffects } from './features/planning/store/planning.effects';
import { legalReducer } from './features/legal/store/legal.reducer';
import { LegalEffects } from './features/legal/store/legal.effects';
import { projectsReducer } from './features/projects/store/projects.reducer';
import { ProjectsEffects } from './features/projects/store/projects.effects';

/**
 * Application configuration.
 * Interceptors execute in order: auth (adds token) → error (handles failures).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideStore({ opportunities: opportunitiesReducer, planning: planningReducer, legal: legalReducer, projects: projectsReducer }),
    provideEffects([OpportunitiesEffects, PlanningEffects, LegalEffects, ProjectsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ]
};
