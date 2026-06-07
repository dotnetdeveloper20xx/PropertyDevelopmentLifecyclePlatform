import { ModuleStatus, PlaceholderFeature, PlaceholderKpi, RelatedPage } from '../../shared/components/placeholder-page/placeholder-page.component';

export interface FuturePageConfig {
  pageTitle: string;
  subtitle: string;
  moduleName: string;
  status: ModuleStatus;
  description: string;
  features: PlaceholderFeature[];
  kpis: PlaceholderKpi[];
  relatedPages: RelatedPage[];
  showTablePreview: boolean;
  tableColumns: string[];
  breadcrumbs: Array<{label: string; url?: string}>;
}

export const FUTURE_PAGES: Record<string, FuturePageConfig> = {
  default: {
    pageTitle: 'Page Planned',
    subtitle: 'This feature is on the roadmap',
    moduleName: 'BuildEstate Pro',
    status: 'Planned',
    description: 'This page is part of a future module that has not yet been implemented.',
    features: [],
    kpis: [],
    relatedPages: [{ label: 'Dashboard', route: '/dashboard' }],
    showTablePreview: false,
    tableColumns: [],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Planned' }]
  },

  // ─── LAND ACQUISITION (expanded) ───
  'due-diligence': {
    pageTitle: 'Due Diligence',
    subtitle: 'Manage legal, environmental, and planning checks for land opportunities',
    moduleName: 'Land Acquisition',
    status: 'Partial',
    description: 'The Due Diligence page provides a dedicated view for managing all due diligence checks across opportunities. Currently, due diligence is managed within the Opportunity Detail page. This standalone view will add filtering, bulk actions, and cross-opportunity visibility.',
    features: [
      { icon: '🔍', title: 'Cross-Opportunity View', description: 'See all due diligence checks across all opportunities in one place' },
      { icon: '📊', title: 'Status Dashboard', description: 'KPIs showing pending, in-progress, passed, and failed checks' },
      { icon: '⚠️', title: 'Risk Matrix', description: 'Visual risk assessment matrix across all checks' },
      { icon: '📋', title: 'Bulk Assignment', description: 'Assign multiple checks to team members at once' }
    ],
    kpis: [{ label: 'Total Checks', value: '—' }, { label: 'Pending', value: '—' }, { label: 'Passed', value: '—' }, { label: 'Failed', value: '—' }],
    relatedPages: [{ label: 'Opportunities', route: '/opportunities' }, { label: 'Compliance Checks', route: '/legal/compliance' }],
    showTablePreview: true,
    tableColumns: ['Opportunity', 'Check Type', 'Status', 'Risk Level', 'Assigned To', 'Due Date'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Land Acquisition' }, { label: 'Due Diligence' }]
  },
  'land-acquisition-dashboard': {
    pageTitle: 'Acquisition Dashboard',
    subtitle: 'Pipeline analytics and acquisition performance metrics',
    moduleName: 'Land Acquisition',
    status: 'Partial',
    description: 'A dedicated acquisition dashboard extending the current main dashboard with deeper pipeline analytics, conversion funnels, geographical mapping, and acquisition cycle time tracking.',
    features: [
      { icon: '📈', title: 'Conversion Funnel', description: 'Visual funnel from Identified to Acquired' },
      { icon: '🗺️', title: 'Map View', description: 'Geographical view of opportunities on an interactive map' },
      { icon: '⏱️', title: 'Cycle Time Analytics', description: 'Average time per stage, bottleneck identification' },
      { icon: '💰', title: 'Financial Projections', description: 'ROI forecasts and pipeline value predictions' }
    ],
    kpis: [{ label: 'Avg Cycle Time', value: '— days' }, { label: 'Conversion Rate', value: '—%' }, { label: 'Pipeline Value', value: '£—' }, { label: 'Active Sites', value: '—' }],
    relatedPages: [{ label: 'Opportunities', route: '/opportunities' }, { label: 'Dashboard', route: '/dashboard' }],
    showTablePreview: false,
    tableColumns: [],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Land Acquisition' }, { label: 'Dashboard' }]
  },

  // ─── DESIGN & CONSTRUCTION ───
  'construction-dashboard': {
    pageTitle: 'Construction Dashboard',
    subtitle: 'Project progress, milestones, and site activity overview',
    moduleName: 'Design & Construction',
    status: 'Planned',
    description: 'The Construction Dashboard provides real-time visibility into all active construction projects, their progress against plan, milestone tracking, and site-level KPIs.',
    features: [
      { icon: '🏗️', title: 'Project Progress', description: 'Gantt-style progress tracking per project' },
      { icon: '📍', title: 'Site Activity', description: 'Daily site logs, inspections, and safety records' },
      { icon: '✅', title: 'Milestone Tracking', description: 'Track key milestones and completion dates' },
      { icon: '🔧', title: 'Snagging Management', description: 'Identify, assign, and resolve defects' },
      { icon: '📸', title: 'Photo Evidence', description: 'Site photography and progress documentation' },
      { icon: '⚡', title: 'Safety & Quality', description: 'H&S incidents, quality inspections, compliance' }
    ],
    kpis: [{ label: 'Active Projects', value: '—' }, { label: 'On Schedule', value: '—%' }, { label: 'Open Snags', value: '—' }, { label: 'Safety Score', value: '—/10' }],
    relatedPages: [{ label: 'Projects', route: '/construction/projects' }, { label: 'Inspections', route: '/construction/inspections' }],
    showTablePreview: false,
    tableColumns: [],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Design & Construction' }, { label: 'Dashboard' }]
  },
  'construction-projects': {
    pageTitle: 'Projects',
    subtitle: 'Manage construction projects, stages, and work packages',
    moduleName: 'Design & Construction',
    status: 'Planned',
    description: 'Track every construction project from design through to practical completion. Manage stages, work packages, dependencies, and resource allocation.',
    features: [
      { icon: '📋', title: 'Project Planning', description: 'Create and manage project plans with stages and tasks' },
      { icon: '📅', title: 'Timeline Management', description: 'Gantt charts and critical path analysis' },
      { icon: '👷', title: 'Resource Allocation', description: 'Assign teams and track utilisation' }
    ],
    kpis: [{ label: 'Total Projects', value: '—' }, { label: 'In Progress', value: '—' }, { label: 'Completed', value: '—' }, { label: 'At Risk', value: '—' }],
    relatedPages: [{ label: 'Construction Dashboard', route: '/construction' }, { label: 'Inspections', route: '/construction/inspections' }],
    showTablePreview: true,
    tableColumns: ['Project Name', 'Site', 'Stage', 'Progress', 'Target Date', 'Status'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Design & Construction' }, { label: 'Projects' }]
  },
  'construction-inspections': {
    pageTitle: 'Inspections',
    subtitle: 'Quality inspections, snagging, and sign-offs',
    moduleName: 'Design & Construction',
    status: 'Planned',
    description: 'Manage on-site inspections, quality checks, and snagging lists. Track defects from identification through resolution.',
    features: [
      { icon: '🔍', title: 'Inspection Checklists', description: 'Configurable checklists per stage' },
      { icon: '📸', title: 'Photo Evidence', description: 'Attach photos to defects and inspections' },
      { icon: '✅', title: 'Sign-off Workflow', description: 'Multi-level approval for inspections' }
    ],
    kpis: [{ label: 'Total Inspections', value: '—' }, { label: 'Pending Review', value: '—' }, { label: 'Open Snags', value: '—' }, { label: 'Resolved', value: '—' }],
    relatedPages: [{ label: 'Projects', route: '/construction/projects' }],
    showTablePreview: true,
    tableColumns: ['Project', 'Type', 'Inspector', 'Date', 'Defects', 'Status'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Design & Construction' }, { label: 'Inspections' }]
  },

  // ─── PROCUREMENT & MATERIALS ───
  'procurement-dashboard': {
    pageTitle: 'Procurement Dashboard',
    subtitle: 'Purchase orders, suppliers, and materials tracking',
    moduleName: 'Procurement & Materials',
    status: 'Planned',
    description: 'Manage procurement activities including purchase orders, material deliveries, stock levels, and supplier performance across all projects.',
    features: [
      { icon: '📦', title: 'Purchase Orders', description: 'Create, approve, and track purchase orders' },
      { icon: '🚚', title: 'Delivery Tracking', description: 'Track material deliveries to site' },
      { icon: '📊', title: 'Stock Management', description: 'Monitor material quantities and reorder points' },
      { icon: '💰', title: 'Cost Tracking', description: 'Track spend against budget per project' }
    ],
    kpis: [{ label: 'Open POs', value: '—' }, { label: 'Pending Delivery', value: '—' }, { label: 'This Month Spend', value: '£—' }, { label: 'Budget Variance', value: '—%' }],
    relatedPages: [{ label: 'Suppliers', route: '/contractors' }],
    showTablePreview: true,
    tableColumns: ['PO Number', 'Supplier', 'Project', 'Value', 'Delivery Date', 'Status'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Procurement & Materials' }, { label: 'Dashboard' }]
  },

  // ─── CONTRACTORS & SUPPLIERS ───
  'contractors-dashboard': {
    pageTitle: 'Contractors & Suppliers',
    subtitle: 'Manage contractor database, performance, and payments',
    moduleName: 'Contractors & Suppliers',
    status: 'Planned',
    description: 'A comprehensive contractor and supplier management system. Track performance, manage payments, monitor compliance, and maintain a rated database of approved partners.',
    features: [
      { icon: '👷', title: 'Contractor Database', description: 'Searchable database with ratings and certifications' },
      { icon: '⭐', title: 'Performance Scoring', description: 'Track quality, timeliness, and cost performance' },
      { icon: '💳', title: 'Payment Management', description: 'Track invoices, retentions, and payment schedules' },
      { icon: '📋', title: 'Compliance Tracking', description: 'Insurance, certifications, and safety records' }
    ],
    kpis: [{ label: 'Active Contractors', value: '—' }, { label: 'Pending Payments', value: '£—' }, { label: 'Avg Rating', value: '—/5' }, { label: 'Compliance Issues', value: '—' }],
    relatedPages: [{ label: 'Procurement', route: '/procurement' }],
    showTablePreview: true,
    tableColumns: ['Company', 'Trade', 'Rating', 'Active Projects', 'Compliance', 'Status'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Contractors & Suppliers' }]
  },

  // ─── FINANCE ───
  'finance-dashboard': {
    pageTitle: 'Finance Dashboard',
    subtitle: 'Budget planning, cost tracking, and cash flow management',
    moduleName: 'Finance & Budget Control',
    status: 'Planned',
    description: 'Comprehensive financial management including project budgets, cost tracking, cash flow forecasting, and profitability analysis across the entire portfolio.',
    features: [
      { icon: '💰', title: 'Budget Management', description: 'Create and monitor budgets per project and phase' },
      { icon: '📊', title: 'Cost Tracking', description: 'Actual vs budget with variance analysis' },
      { icon: '📈', title: 'Cash Flow Forecasting', description: 'Project cash flow and portfolio-level forecasts' },
      { icon: '🏦', title: 'Profitability Analysis', description: 'ROI, margin, and IRR calculations' },
      { icon: '📄', title: 'Financial Reports', description: 'P&L, balance sheet, and investor reports' }
    ],
    kpis: [{ label: 'Total Budget', value: '£—' }, { label: 'Spent to Date', value: '£—' }, { label: 'Forecast Profit', value: '£—' }, { label: 'Cash Position', value: '£—' }],
    relatedPages: [{ label: 'Investors', route: '/investors' }, { label: 'Reports', route: '/reports' }],
    showTablePreview: false,
    tableColumns: [],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Finance & Budget Control' }, { label: 'Dashboard' }]
  },

  // ─── INVESTORS & FUNDING ───
  'investors-dashboard': {
    pageTitle: 'Investors & Funding',
    subtitle: 'Manage investor profiles, funding rounds, and returns',
    moduleName: 'Investors & Funding',
    status: 'Planned',
    description: 'Track investor relationships, manage funding rounds, monitor capital deployment, and calculate investor returns across the portfolio.',
    features: [
      { icon: '🤝', title: 'Investor Profiles', description: 'Maintain detailed investor database with preferences' },
      { icon: '💎', title: 'Funding Rounds', description: 'Track funding rounds, commitments, and draw-downs' },
      { icon: '📈', title: 'Returns Tracking', description: 'Calculate and report investor returns (IRR, equity multiple)' },
      { icon: '📧', title: 'Investor Communications', description: 'Quarterly reports and distribution notices' }
    ],
    kpis: [{ label: 'Total Committed', value: '£—' }, { label: 'Deployed', value: '£—' }, { label: 'Avg IRR', value: '—%' }, { label: 'Active Investors', value: '—' }],
    relatedPages: [{ label: 'Finance', route: '/finance' }],
    showTablePreview: true,
    tableColumns: ['Investor', 'Type', 'Committed', 'Deployed', 'Returns', 'Status'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Investors & Funding' }]
  },

  // ─── PROPERTY UNITS ───
  'units-dashboard': {
    pageTitle: 'Property Units',
    subtitle: 'Unit configuration, availability, and status tracking',
    moduleName: 'Property Units',
    status: 'Planned',
    description: 'Manage individual property units within developments. Configure unit types, track availability, manage reservations, and monitor sales progress.',
    features: [
      { icon: '🏠', title: 'Unit Registry', description: 'Complete database of all units across all projects' },
      { icon: '📐', title: 'Unit Configuration', description: 'Floor plans, specifications, and pricing' },
      { icon: '🏷️', title: 'Availability Tracking', description: 'Real-time availability status per unit' },
      { icon: '📊', title: 'Sales Progress', description: 'Track reservations, exchanges, and completions' }
    ],
    kpis: [{ label: 'Total Units', value: '—' }, { label: 'Available', value: '—' }, { label: 'Reserved', value: '—' }, { label: 'Sold', value: '—' }],
    relatedPages: [{ label: 'Sales & Marketing', route: '/sales' }],
    showTablePreview: true,
    tableColumns: ['Unit', 'Project', 'Type', 'Beds', 'Price', 'Status'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Property Units' }]
  },

  // ─── SALES & MARKETING ───
  'sales-dashboard': {
    pageTitle: 'Sales & Marketing',
    subtitle: 'Leads, viewings, reservations, and sales pipeline',
    moduleName: 'Sales & Marketing',
    status: 'Planned',
    description: 'End-to-end sales management from lead generation through reservation, exchange, and completion. Includes marketing campaign tracking and agent management.',
    features: [
      { icon: '🎯', title: 'Lead Management', description: 'Capture and nurture sales leads' },
      { icon: '🏠', title: 'Viewings', description: 'Schedule and track property viewings' },
      { icon: '📝', title: 'Reservations', description: 'Manage unit reservations and deposits' },
      { icon: '📊', title: 'Sales Pipeline', description: 'Visual pipeline from lead to completion' },
      { icon: '📢', title: 'Marketing Campaigns', description: 'Track marketing spend and campaign performance' }
    ],
    kpis: [{ label: 'Active Leads', value: '—' }, { label: 'Viewings This Week', value: '—' }, { label: 'Reservations', value: '—' }, { label: 'Revenue Pipeline', value: '£—' }],
    relatedPages: [{ label: 'Property Units', route: '/units' }],
    showTablePreview: true,
    tableColumns: ['Lead Name', 'Source', 'Interest', 'Stage', 'Value', 'Next Action'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Sales & Marketing' }]
  },

  // ─── RENTAL MANAGEMENT ───
  'rental-dashboard': {
    pageTitle: 'Rental Management',
    subtitle: 'Tenants, leases, rent collection, and maintenance',
    moduleName: 'Rental Management',
    status: 'Planned',
    description: 'Manage rental properties post-completion. Track tenants, leases, rent collection, arrears, and maintenance requests across the portfolio.',
    features: [
      { icon: '🏘️', title: 'Tenant Management', description: 'Tenant database with contact details and history' },
      { icon: '📄', title: 'Lease Management', description: 'Track lease terms, renewals, and break clauses' },
      { icon: '💷', title: 'Rent Collection', description: 'Track payments, arrears, and generate statements' },
      { icon: '🔧', title: 'Maintenance', description: 'Log and track maintenance requests and repairs' }
    ],
    kpis: [{ label: 'Total Tenancies', value: '—' }, { label: 'Occupancy Rate', value: '—%' }, { label: 'Monthly Rent Roll', value: '£—' }, { label: 'Open Maintenance', value: '—' }],
    relatedPages: [{ label: 'Property Units', route: '/units' }],
    showTablePreview: true,
    tableColumns: ['Property', 'Tenant', 'Rent', 'Lease Expiry', 'Arrears', 'Status'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Rental Management' }]
  },

  // ─── DOCUMENTS & KNOWLEDGE ───
  'documents-dashboard': {
    pageTitle: 'Documents & Knowledge',
    subtitle: 'Document repository, version control, and templates',
    moduleName: 'Documents & Knowledge',
    status: 'Planned',
    description: 'Centralised document management with version control, tagging, templates, and full-text search. Serves as the knowledge base for the entire organisation.',
    features: [
      { icon: '📁', title: 'Document Repository', description: 'Centralised storage with folder structure' },
      { icon: '🔄', title: 'Version Control', description: 'Track document versions and changes' },
      { icon: '📝', title: 'Templates', description: 'Reusable document templates for common needs' },
      { icon: '🔍', title: 'Full-Text Search', description: 'Search across all documents and metadata' },
      { icon: '🏷️', title: 'Tagging & Categories', description: 'Organise with tags, categories, and projects' }
    ],
    kpis: [{ label: 'Total Documents', value: '—' }, { label: 'This Month', value: '—' }, { label: 'Templates', value: '—' }, { label: 'Storage Used', value: '— GB' }],
    relatedPages: [{ label: 'Legal Contracts', route: '/legal/contracts' }],
    showTablePreview: true,
    tableColumns: ['Document', 'Type', 'Project', 'Version', 'Uploaded By', 'Date'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Documents & Knowledge' }]
  },

  // ─── REPORTS ───
  'reports-dashboard': {
    pageTitle: 'Reports & Dashboards',
    subtitle: 'Executive dashboards, financial reports, and analytics',
    moduleName: 'Reports & Dashboards',
    status: 'Planned',
    description: 'Comprehensive reporting and analytics layer providing executive dashboards, financial reports, sales reports, construction progress reports, and custom report builder.',
    features: [
      { icon: '📊', title: 'Executive Dashboard', description: 'Portfolio-level KPIs for leadership' },
      { icon: '💰', title: 'Financial Reports', description: 'P&L, cash flow, and budget variance reports' },
      { icon: '🏗️', title: 'Construction Reports', description: 'Progress, quality, and safety reports' },
      { icon: '📈', title: 'Sales Reports', description: 'Pipeline, conversion, and revenue reports' },
      { icon: '🔧', title: 'Custom Report Builder', description: 'Build custom reports with drag-and-drop' }
    ],
    kpis: [{ label: 'Available Reports', value: '—' }, { label: 'Scheduled', value: '—' }, { label: 'Last Generated', value: '—' }, { label: 'Recipients', value: '—' }],
    relatedPages: [{ label: 'Finance', route: '/finance' }, { label: 'Dashboard', route: '/dashboard' }],
    showTablePreview: false,
    tableColumns: [],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Reports & Dashboards' }]
  },

  // ─── ADMINISTRATION ───
  'admin-users': {
    pageTitle: 'User Management',
    subtitle: 'Manage users, roles, and permissions',
    moduleName: 'Administration',
    status: 'Planned',
    description: 'Administer platform users, assign roles, manage permissions, and configure security settings. Includes user activity monitoring and access audit logs.',
    features: [
      { icon: '👥', title: 'User Directory', description: 'View and manage all platform users' },
      { icon: '🔑', title: 'Role Assignment', description: 'Assign and manage user roles' },
      { icon: '🛡️', title: 'Permissions', description: 'Fine-grained permission management' },
      { icon: '📋', title: 'Activity Logs', description: 'Monitor user login and action history' }
    ],
    kpis: [{ label: 'Total Users', value: '—' }, { label: 'Active Today', value: '—' }, { label: 'Roles', value: '—' }, { label: 'Locked Accounts', value: '—' }],
    relatedPages: [{ label: 'Audit Log', route: '/admin/audit' }, { label: 'Settings', route: '/admin/settings' }],
    showTablePreview: true,
    tableColumns: ['Name', 'Email', 'Role', 'Last Login', 'Status'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Administration' }, { label: 'Users' }]
  },
  'admin-audit': {
    pageTitle: 'Audit Log',
    subtitle: 'Immutable record of all system actions',
    moduleName: 'Administration',
    status: 'Planned',
    description: 'View the complete audit trail of all actions taken in the system. Filter by user, entity, action type, and date range. Export for compliance reviews.',
    features: [
      { icon: '📜', title: 'Full Audit Trail', description: 'Every create, update, and delete logged' },
      { icon: '🔍', title: 'Advanced Search', description: 'Filter by user, entity, date, action type' },
      { icon: '📤', title: 'Export', description: 'Export audit data for compliance reviews' },
      { icon: '🔒', title: 'Immutable', description: 'Audit records cannot be modified or deleted' }
    ],
    kpis: [{ label: 'Total Events', value: '—' }, { label: 'Today', value: '—' }, { label: 'Users Active', value: '—' }, { label: 'Entities Modified', value: '—' }],
    relatedPages: [{ label: 'Users', route: '/admin/users' }],
    showTablePreview: true,
    tableColumns: ['Timestamp', 'User', 'Action', 'Entity', 'Entity ID', 'Changes'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Administration' }, { label: 'Audit Log' }]
  },
  'admin-settings': {
    pageTitle: 'System Settings',
    subtitle: 'Platform configuration and preferences',
    moduleName: 'Administration',
    status: 'Planned',
    description: 'Configure platform-wide settings including notifications, integrations, email templates, and system preferences.',
    features: [
      { icon: '⚙️', title: 'General Settings', description: 'Company info, branding, timezone' },
      { icon: '🔔', title: 'Notifications', description: 'Configure email and in-app notification rules' },
      { icon: '🔗', title: 'Integrations', description: 'Third-party service connections' },
      { icon: '📧', title: 'Email Templates', description: 'Customise system email templates' }
    ],
    kpis: [],
    relatedPages: [{ label: 'Users', route: '/admin/users' }],
    showTablePreview: false,
    tableColumns: [],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Administration' }, { label: 'Settings' }]
  },

  // ─── LEGAL (expanded placeholder pages) ───
  'legal-compliance': {
    pageTitle: 'Compliance Overview',
    subtitle: 'All compliance checks across opportunities',
    moduleName: 'Legal & Compliance',
    status: 'Partial',
    description: 'A cross-opportunity view of all compliance checks. Currently, compliance checks are managed per-opportunity via the API. This dedicated page will provide filtering, risk scoring, and bulk management capabilities.',
    features: [
      { icon: '✅', title: 'All Checks View', description: 'See every compliance check across all opportunities' },
      { icon: '⚠️', title: 'Risk Dashboard', description: 'Flagged and high-risk items requiring attention' },
      { icon: '📊', title: 'Pass Rate Analytics', description: 'Track compliance pass rates over time' }
    ],
    kpis: [{ label: 'Total Checks', value: '—' }, { label: 'Pending', value: '—' }, { label: 'Flagged', value: '—' }, { label: 'Pass Rate', value: '—%' }],
    relatedPages: [{ label: 'Contracts', route: '/legal/contracts' }, { label: 'Tasks', route: '/legal/tasks' }],
    showTablePreview: true,
    tableColumns: ['Opportunity', 'Check Type', 'Status', 'Risk', 'Assigned To', 'Due Date'],
    breadcrumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Legal & Compliance' }, { label: 'Compliance' }]
  }
};
