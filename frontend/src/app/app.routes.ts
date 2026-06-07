import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth Layout (no sidebar/header)
  {
    path: '',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  // Main Layout (sidebar + header)
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
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
      {
        path: 'opportunities/:id/edit',
        loadComponent: () => import('./features/land-acquisition/opportunities/opportunity-edit/opportunity-edit.component').then(m => m.OpportunityEditComponent)
      },
      // Help Centre
      {
        path: 'help',
        loadComponent: () => import('./features/help-centre/help-centre.component').then(m => m.HelpCentreComponent)
      },
      {
        path: 'help/release-notes',
        loadComponent: () => import('./features/help-centre/release-notes.component').then(m => m.ReleaseNotesComponent)
      },
      {
        path: 'help/learning-paths',
        loadComponent: () => import('./features/help-centre/learning-paths.component').then(m => m.LearningPathsComponent)
      },
      {
        path: 'help/user-bible',
        loadComponent: () => import('./features/help-centre/user-bible.component').then(m => m.UserBibleComponent)
      },
      {
        path: 'help/:categoryId',
        loadComponent: () => import('./features/help-centre/help-category.component').then(m => m.HelpCategoryComponent)
      },
      {
        path: 'help/:categoryId/:articleId',
        loadComponent: () => import('./features/help-centre/help-article.component').then(m => m.HelpArticleComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
