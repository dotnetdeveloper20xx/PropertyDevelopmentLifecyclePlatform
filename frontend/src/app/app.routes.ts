import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'opportunities',
        loadComponent: () => import('./features/land-acquisition/opportunities/opportunity-list/opportunity-list.component').then(m => m.OpportunityListComponent)
      },
      {
        path: 'opportunities/new',
        loadComponent: () => import('./features/land-acquisition/opportunities/opportunity-form/opportunity-form.component').then(m => m.OpportunityFormComponent)
      },
      {
        path: 'opportunities/:id',
        loadComponent: () => import('./features/land-acquisition/opportunities/opportunity-detail/opportunity-detail.component').then(m => m.OpportunityDetailComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
