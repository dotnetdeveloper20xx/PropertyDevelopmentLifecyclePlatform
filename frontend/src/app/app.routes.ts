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
      // Planning & Approvals
      {
        path: 'planning',
        loadComponent: () => import('./features/planning/planning-list/planning-list.component').then(m => m.PlanningListComponent)
      },
      {
        path: 'planning/new',
        loadComponent: () => import('./features/planning/planning-form/planning-form.component').then(m => m.PlanningFormComponent)
      },
      {
        path: 'planning/:id',
        loadComponent: () => import('./features/planning/planning-detail/planning-detail.component').then(m => m.PlanningDetailComponent)
      },
      {
        path: 'planning/:id/edit',
        loadComponent: () => import('./features/planning/planning-edit/planning-edit.component').then(m => m.PlanningEditComponent)
      },
      // Legal & Compliance
      {
        path: 'legal/contracts',
        loadComponent: () => import('./features/legal/contracts/contract-list/contract-list.component').then(m => m.ContractListComponent)
      },
      {
        path: 'legal/contracts/new',
        loadComponent: () => import('./features/legal/contracts/contract-form/contract-form.component').then(m => m.ContractFormComponent)
      },
      {
        path: 'legal/contracts/:id',
        loadComponent: () => import('./features/legal/contracts/contract-detail/contract-detail.component').then(m => m.ContractDetailComponent)
      },
      {
        path: 'legal/tasks',
        loadComponent: () => import('./features/legal/tasks/legal-tasks.component').then(m => m.LegalTasksComponent)
      },
      {
        path: 'legal/compliance',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'legal-compliance' }
      },
      // Land Acquisition (expanded)
      {
        path: 'due-diligence',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'due-diligence' }
      },
      {
        path: 'acquisition/dashboard',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'land-acquisition-dashboard' }
      },
      // Design & Construction
      {
        path: 'construction',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'construction-dashboard' }
      },
      {
        path: 'construction/projects',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'construction-projects' }
      },
      {
        path: 'construction/inspections',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'construction-inspections' }
      },
      // Procurement & Materials
      {
        path: 'procurement',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'procurement-dashboard' }
      },
      // Contractors & Suppliers
      {
        path: 'contractors',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'contractors-dashboard' }
      },
      // Finance & Budget Control
      {
        path: 'finance',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'finance-dashboard' }
      },
      // Investors & Funding
      {
        path: 'investors',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'investors-dashboard' }
      },
      // Property Units
      {
        path: 'units',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'units-dashboard' }
      },
      // Sales & Marketing
      {
        path: 'sales',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'sales-dashboard' }
      },
      // Rental Management
      {
        path: 'rentals',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'rental-dashboard' }
      },
      // Documents & Knowledge
      {
        path: 'documents',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'documents-dashboard' }
      },
      // Reports & Dashboards
      {
        path: 'reports',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'reports-dashboard' }
      },
      // Administration
      {
        path: 'admin/users',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'admin-users' }
      },
      {
        path: 'admin/audit',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'admin-audit' }
      },
      {
        path: 'admin/settings',
        loadComponent: () => import('./features/future/future-page.component').then(m => m.FuturePageComponent),
        data: { pageKey: 'admin-settings' }
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
