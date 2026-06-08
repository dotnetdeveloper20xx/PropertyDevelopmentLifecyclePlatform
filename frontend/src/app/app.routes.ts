import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Root redirect
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
        loadComponent: () => import('./features/legal/compliance-list/compliance-list.component').then(m => m.ComplianceListComponent)
      },
      // Land Acquisition (expanded)
      {
        path: 'due-diligence',
        loadComponent: () => import('./features/land-acquisition/due-diligence-list/due-diligence-list.component').then(m => m.DueDiligenceListComponent)
      },
      {
        path: 'acquisition/dashboard',
        loadComponent: () => import('./features/land-acquisition/acquisition-dashboard/acquisition-dashboard.component').then(m => m.AcquisitionDashboardComponent)
      },
      // Project Management
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent)
      },
      {
        path: 'projects/new',
        loadComponent: () => import('./features/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
      },
      // Design & Construction
      {
        path: 'construction',
        loadComponent: () => import('./features/construction/construction-stages/construction-stages.component').then(m => m.ConstructionStagesComponent)
      },
      {
        path: 'construction/new',
        loadComponent: () => import('./features/construction/create-stage-form/create-stage-form.component').then(m => m.CreateStageFormComponent)
      },
      {
        path: 'construction/projects',
        loadComponent: () => import('./features/construction/construction-projects/construction-projects.component').then(m => m.ConstructionProjectsComponent)
      },
      {
        path: 'construction/inspections',
        loadComponent: () => import('./features/construction/construction-inspections/construction-inspections.component').then(m => m.ConstructionInspectionsComponent)
      },
      // Procurement & Materials
      {
        path: 'procurement',
        loadComponent: () => import('./features/procurement/procurement-list/procurement-list.component').then(m => m.ProcurementListComponent)
      },
      {
        path: 'procurement/new',
        loadComponent: () => import('./features/procurement/create-order-form/create-order-form.component').then(m => m.CreateOrderFormComponent)
      },
      // Contractors & Suppliers
      {
        path: 'contractors',
        loadComponent: () => import('./features/contractors/contractor-list/contractor-list.component').then(m => m.ContractorListComponent)
      },
      {
        path: 'contractors/new',
        loadComponent: () => import('./features/contractors/create-contractor-form/create-contractor-form.component').then(m => m.CreateContractorFormComponent)
      },
      // Finance & Budget Control
      {
        path: 'finance',
        loadComponent: () => import('./features/finance/finance-list/finance-list.component').then(m => m.FinanceListComponent)
      },
      {
        path: 'finance/new',
        loadComponent: () => import('./features/finance/create-transaction-form/create-transaction-form.component').then(m => m.CreateTransactionFormComponent)
      },
      // Investors & Funding
      {
        path: 'investors',
        loadComponent: () => import('./features/investors/investor-list/investor-list.component').then(m => m.InvestorListComponent)
      },
      {
        path: 'investors/new',
        loadComponent: () => import('./features/investors/create-investor-form/create-investor-form.component').then(m => m.CreateInvestorFormComponent)
      },
      // Property Units
      {
        path: 'units',
        loadComponent: () => import('./features/units/unit-list/unit-list.component').then(m => m.UnitListComponent)
      },
      {
        path: 'units/new',
        loadComponent: () => import('./features/units/create-unit-form/create-unit-form.component').then(m => m.CreateUnitFormComponent)
      },
      // Sales & Marketing
      {
        path: 'sales',
        loadComponent: () => import('./features/sales/sales-list/sales-list.component').then(m => m.SalesListComponent)
      },
      {
        path: 'sales/new',
        loadComponent: () => import('./features/sales/create-lead-form/create-lead-form.component').then(m => m.CreateLeadFormComponent)
      },
      // Rental Management
      {
        path: 'rentals',
        loadComponent: () => import('./features/rentals/tenancy-list/tenancy-list.component').then(m => m.TenancyListComponent)
      },
      {
        path: 'rentals/new',
        loadComponent: () => import('./features/rentals/create-tenancy-form/create-tenancy-form.component').then(m => m.CreateTenancyFormComponent)
      },
      // Documents & Knowledge
      {
        path: 'documents',
        loadComponent: () => import('./features/documents/document-list/document-list.component').then(m => m.DocumentListComponent)
      },
      // Reports & Dashboards
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/report-list/report-list.component').then(m => m.ReportListComponent)
      },
      // Administration
      {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'admin/audit',
        loadComponent: () => import('./features/admin/audit-log/audit-log.component').then(m => m.AuditLogComponent)
      },
      {
        path: 'admin/settings',
        loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent)
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
