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
import { constructionReducer } from './features/construction/store/construction.reducer';
import { ConstructionEffects } from './features/construction/store/construction.effects';
import { procurementReducer } from './features/procurement/store/procurement.reducer';
import { ProcurementEffects } from './features/procurement/store/procurement.effects';
import { contractorsReducer } from './features/contractors/store/contractors.reducer';
import { ContractorsEffects } from './features/contractors/store/contractors.effects';
import { financeReducer } from './features/finance/store/finance.reducer';
import { FinanceEffects } from './features/finance/store/finance.effects';
import { investorsReducer } from './features/investors/store/investors.reducer';
import { InvestorsEffects } from './features/investors/store/investors.effects';
import { unitsReducer } from './features/units/store/units.reducer';
import { UnitsEffects } from './features/units/store/units.effects';
import { salesReducer } from './features/sales/store/sales.reducer';
import { SalesEffects } from './features/sales/store/sales.effects';
import { rentalsReducer } from './features/rentals/store/rentals.reducer';
import { RentalsEffects } from './features/rentals/store/rentals.effects';
import { documentsReducer } from './features/documents/store/documents.reducer';
import { DocumentsEffects } from './features/documents/store/documents.effects';
import { reportsReducer } from './features/reports/store/reports.reducer';
import { ReportsEffects } from './features/reports/store/reports.effects';

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
    provideStore({ opportunities: opportunitiesReducer, planning: planningReducer, legal: legalReducer, projects: projectsReducer, construction: constructionReducer, procurement: procurementReducer, contractors: contractorsReducer, finance: financeReducer, investors: investorsReducer, units: unitsReducer, sales: salesReducer, rentals: rentalsReducer, documents: documentsReducer, reports: reportsReducer }),
    provideEffects([OpportunitiesEffects, PlanningEffects, LegalEffects, ProjectsEffects, ConstructionEffects, ProcurementEffects, ContractorsEffects, FinanceEffects, InvestorsEffects, UnitsEffects, SalesEffects, RentalsEffects, DocumentsEffects, ReportsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ]
};
