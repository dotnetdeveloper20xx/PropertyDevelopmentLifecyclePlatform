import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

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
        loadComponent: () => import('./features/land-acquisition/opportunities/opportunity-form/opportunity-form.component').then(m => m.OpportunityFormComponent),
        canDeactivate: [unsavedChangesGuard]
      },
      {
        path: 'opportunities/:id',
        loadComponent: () => import('./features/land-acquisition/opportunities/opportunity-detail/opportunity-detail.component').then(m => m.OpportunityDetailComponent)
      },
      {
        path: 'opportunities/:id/edit',
        loadComponent: () => import('./features/land-acquisition/opportunities/opportunity-edit/opportunity-edit.component').then(m => m.OpportunityEditComponent),
        canDeactivate: [unsavedChangesGuard]
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
        path: 'legal/contracts/:id/edit',
        loadComponent: () => import('./features/legal/contracts/contract-edit/contract-edit.component').then(m => m.ContractEditComponent),
        canDeactivate: [unsavedChangesGuard]
      },
      {
        path: 'legal/tasks',
        loadComponent: () => import('./features/legal/tasks/legal-tasks.component').then(m => m.LegalTasksComponent)
      },
      {
        path: 'legal/compliance',
        loadComponent: () => import('./features/legal/compliance-list/compliance-list.component').then(m => m.ComplianceListComponent)
      },
      {
        path: 'legal/compliance/new',
        loadComponent: () => import('./features/legal/compliance-form/compliance-form.component').then(m => m.ComplianceFormComponent)
      },
      {
        path: 'legal/compliance/:id',
        loadComponent: () => import('./features/legal/compliance-detail/compliance-detail.component').then(m => m.ComplianceDetailComponent)
      },
      {
        path: 'legal/compliance/:id/edit',
        loadComponent: () => import('./features/legal/compliance-edit/compliance-edit.component').then(m => m.ComplianceEditComponent)
      },
      // Land Acquisition (expanded)
      {
        path: 'due-diligence',
        loadComponent: () => import('./features/land-acquisition/due-diligence-list/due-diligence-list.component').then(m => m.DueDiligenceListComponent)
      },
      {
        path: 'due-diligence/new',
        loadComponent: () => import('./features/land-acquisition/due-diligence-form/due-diligence-form.component').then(m => m.DueDiligenceFormComponent)
      },
      {
        path: 'due-diligence/:id',
        loadComponent: () => import('./features/land-acquisition/due-diligence-detail/due-diligence-detail.component').then(m => m.DueDiligenceDetailComponent)
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
        loadComponent: () => import('./features/projects/project-form/project-form.component').then(m => m.ProjectFormComponent),
        canDeactivate: [unsavedChangesGuard]
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () => import('./features/projects/project-edit/project-edit.component').then(m => m.ProjectEditComponent),
        canDeactivate: [unsavedChangesGuard]
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
      {
        path: 'construction/:id',
        loadComponent: () => import('./features/construction/construction-detail/construction-detail.component').then(m => m.ConstructionDetailComponent)
      },
      {
        path: 'construction/:id/edit',
        loadComponent: () => import('./features/construction/construction-edit/construction-edit.component').then(m => m.ConstructionEditComponent)
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
      {
        path: 'procurement/:id',
        loadComponent: () => import('./features/procurement/procurement-detail/procurement-detail.component').then(m => m.ProcurementDetailComponent)
      },
      {
        path: 'procurement/:id/edit',
        loadComponent: () => import('./features/procurement/procurement-edit/procurement-edit.component').then(m => m.ProcurementEditComponent)
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
      {
        path: 'contractors/:id',
        loadComponent: () => import('./features/contractors/contractor-detail/contractor-detail.component').then(m => m.ContractorDetailComponent)
      },
      {
        path: 'contractors/:id/edit',
        loadComponent: () => import('./features/contractors/contractor-edit/contractor-edit.component').then(m => m.ContractorEditComponent)
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
      {
        path: 'finance/:id',
        loadComponent: () => import('./features/finance/finance-detail/finance-detail.component').then(m => m.FinanceDetailComponent)
      },
      {
        path: 'finance/:id/edit',
        loadComponent: () => import('./features/finance/finance-edit/finance-edit.component').then(m => m.FinanceEditComponent)
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
      {
        path: 'investors/:id',
        loadComponent: () => import('./features/investors/investor-detail/investor-detail.component').then(m => m.InvestorDetailComponent)
      },
      {
        path: 'investors/:id/edit',
        loadComponent: () => import('./features/investors/investor-edit/investor-edit.component').then(m => m.InvestorEditComponent)
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
      {
        path: 'units/:id',
        loadComponent: () => import('./features/units/unit-detail/unit-detail.component').then(m => m.UnitDetailComponent)
      },
      {
        path: 'units/:id/edit',
        loadComponent: () => import('./features/units/unit-edit/unit-edit.component').then(m => m.UnitEditComponent)
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
      {
        path: 'sales/:id',
        loadComponent: () => import('./features/sales/sales-detail/sales-detail.component').then(m => m.SalesDetailComponent)
      },
      {
        path: 'sales/:id/edit',
        loadComponent: () => import('./features/sales/sales-edit/sales-edit.component').then(m => m.SalesEditComponent)
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
      {
        path: 'rentals/:id',
        loadComponent: () => import('./features/rentals/tenancy-detail/tenancy-detail.component').then(m => m.TenancyDetailComponent)
      },
      {
        path: 'rentals/:id/edit',
        loadComponent: () => import('./features/rentals/tenancy-edit/tenancy-edit.component').then(m => m.TenancyEditComponent)
      },
      // Documents & Knowledge
      {
        path: 'documents',
        loadComponent: () => import('./features/documents/document-list/document-list.component').then(m => m.DocumentListComponent)
      },
      {
        path: 'documents/new',
        loadComponent: () => import('./features/documents/document-form/document-form.component').then(m => m.DocumentFormComponent)
      },
      {
        path: 'documents/:id',
        loadComponent: () => import('./features/documents/document-detail/document-detail.component').then(m => m.DocumentDetailComponent)
      },
      // Reports & Dashboards
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/report-list/report-list.component').then(m => m.ReportListComponent)
      },
      {
        path: 'reports/new',
        loadComponent: () => import('./features/reports/report-form/report-form.component').then(m => m.ReportFormComponent)
      },
      {
        path: 'reports/:id',
        loadComponent: () => import('./features/reports/report-detail/report-detail.component').then(m => m.ReportDetailComponent)
      },
      // Portfolio Strategy
      {
        path: 'portfolio',
        loadComponent: () => import('./features/portfolio/portfolio-list/portfolio-list.component').then(m => m.PortfolioListComponent)
      },
      // Feasibility & Viability
      {
        path: 'feasibility',
        loadComponent: () => import('./features/feasibility/feasibility-list/feasibility-list.component').then(m => m.FeasibilityListComponent)
      },
      {
        path: 'feasibility/new',
        loadComponent: () => import('./features/feasibility/feasibility-form/feasibility-form.component').then(m => m.FeasibilityFormComponent)
      },
      {
        path: 'feasibility/:id',
        loadComponent: () => import('./features/feasibility/feasibility-detail/feasibility-detail.component').then(m => m.FeasibilityDetailComponent)
      },
      {
        path: 'feasibility/:id/edit',
        loadComponent: () => import('./features/feasibility/feasibility-edit/feasibility-edit.component').then(m => m.FeasibilityEditComponent)
      },
      // Design & Professional Services
      {
        path: 'design',
        loadComponent: () => import('./features/design/design-list/design-list.component').then(m => m.DesignListComponent)
      },
      {
        path: 'design/new',
        loadComponent: () => import('./features/design/design-form/design-form.component').then(m => m.DesignFormComponent)
      },
      {
        path: 'design/:id',
        loadComponent: () => import('./features/design/design-detail/design-detail.component').then(m => m.DesignDetailComponent)
      },
      {
        path: 'design/:id/edit',
        loadComponent: () => import('./features/design/design-edit/design-edit.component').then(m => m.DesignEditComponent)
      },
      // Defects & Warranty
      {
        path: 'defects',
        loadComponent: () => import('./features/defects/defect-list/defect-list.component').then(m => m.DefectListComponent)
      },
      {
        path: 'defects/new',
        loadComponent: () => import('./features/defects/defect-form/defect-form.component').then(m => m.DefectFormComponent)
      },
      {
        path: 'defects/:id',
        loadComponent: () => import('./features/defects/defect-detail/defect-detail.component').then(m => m.DefectDetailComponent)
      },
      {
        path: 'defects/:id/edit',
        loadComponent: () => import('./features/defects/defect-edit/defect-edit.component').then(m => m.DefectEditComponent)
      },
      // Administration
      {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'admin/permissions',
        loadComponent: () => import('./features/admin/permission-matrix/permission-matrix.component').then(m => m.PermissionMatrixComponent)
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
