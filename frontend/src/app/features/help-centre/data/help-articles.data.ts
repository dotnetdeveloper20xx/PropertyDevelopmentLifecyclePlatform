import { HelpArticle, HelpCategory, GlossaryTerm, FaqItem } from '../models/help-article.model';

/**
 * Static help content. In a production system this could be served from a CMS or API.
 * For now, it lives client-side for instant search and zero-latency navigation.
 */

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    description: 'Learn the basics of BuildEstate Pro and get productive quickly.',
    icon: '🚀',
    articleCount: 3
  },
  {
    id: 'land-acquisition',
    label: 'Land Acquisition',
    description: 'Find, evaluate, and secure land opportunities.',
    icon: '🏗️',
    articleCount: 4
  },
  {
    id: 'planning',
    label: 'Planning & Approvals',
    description: 'Manage planning applications, conditions, and appeals.',
    icon: '📋',
    articleCount: 4
  },
  {
    id: 'workflows',
    label: 'Workflows & Approvals',
    description: 'Understand how tasks, approvals, and status changes work.',
    icon: '🔄',
    articleCount: 3
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    description: 'Who can do what within the platform.',
    icon: '👥',
    articleCount: 2
  },
  {
    id: 'modules',
    label: 'Module Guide',
    description: 'Detailed guides for each platform module.',
    icon: '📦',
    articleCount: 3
  },
  {
    id: 'faq',
    label: 'Frequently Asked Questions',
    description: 'Quick answers to common questions.',
    icon: '❓',
    articleCount: 5
  },
  {
    id: 'glossary',
    label: 'Glossary',
    description: 'Definitions of key terms used across the platform.',
    icon: '📖',
    articleCount: 10
  }
];

export const HELP_ARTICLES: HelpArticle[] = [
  // Getting Started
  {
    id: 'gs-welcome',
    title: 'Welcome to BuildEstate Pro',
    summary: 'An introduction to the platform, its purpose, and how it helps real estate developers manage projects end-to-end.',
    content: `
BuildEstate Pro is an enterprise platform for managing the full lifecycle of property development — from identifying land opportunities through construction, sales, handover, and long-term asset management.

## What You Can Do

- **Track Land Opportunities** — Manage your pipeline of potential development sites
- **Run Due Diligence** — Record legal, environmental, and planning checks
- **Manage Offers** — Submit, negotiate, and track offers on land
- **Monitor Progress** — Dashboard gives you a real-time view of pipeline health

## How It Works

The platform follows a natural workflow: Identify → Evaluate → Offer → Acquire → Develop → Sell → Manage.

Each stage has dedicated tools, forms, and dashboards to keep your team productive and informed.

## Getting Help

Use the Help Centre (this page) to find guides, FAQs, and terminology definitions. Every page in the application also includes contextual guidance at the top.
    `,
    category: HELP_CATEGORIES[0],
    tags: ['introduction', 'overview', 'platform', 'start'],
    lastUpdated: '2026-06-01',
    video: {
      title: 'Platform Overview Tour',
      duration: '5:30',
      description: 'A visual walkthrough of BuildEstate Pro — see the dashboard, pipeline, and key features in action.'
    }
  },
  {
    id: 'gs-navigation',
    title: 'Navigating the Application',
    summary: 'Learn how to use the sidebar, breadcrumbs, and page headers to move around efficiently.',
    content: `
## Sidebar Navigation

The left sidebar contains links to all major sections of the platform. On mobile, tap the menu icon to open it.

## Breadcrumbs

At the top of every page, breadcrumbs show your current location in the hierarchy. Click any breadcrumb to navigate back.

## Page Headers & Descriptions

Every major page includes:
- **Title** — What this page is
- **Subtitle** — Brief purpose
- **Description panel** — Business context and guidance

## Quick Actions

Look for action buttons in page headers (e.g., "Create Opportunity") for common tasks.
    `,
    category: HELP_CATEGORIES[0],
    tags: ['navigation', 'sidebar', 'breadcrumbs', 'menus'],
    lastUpdated: '2026-06-01'
  },
  {
    id: 'gs-first-opportunity',
    title: 'Creating Your First Opportunity',
    summary: 'Step-by-step guide to adding a land opportunity to your pipeline.',
    content: `
## Steps

1. Navigate to **Opportunities** in the sidebar
2. Click **Create New Opportunity**
3. Fill in the required fields: Name, Location, Land Size
4. Optionally add financial details (Asking Price) and notes
5. Click **Save** to add it to your pipeline

## What Happens Next

Your opportunity starts in "Identified" status. You can then:
- Progress it to "Initial Review"
- Add Due Diligence records
- Submit offers when ready

## Tips

- Use clear, descriptive names (e.g., "Meadow Lane - 2.5 Acres")
- Add the source (e.g., "Agent referral" or "Direct approach")
- Set the Expected Acquisition date to help forecast your pipeline
    `,
    category: HELP_CATEGORIES[0],
    tags: ['opportunity', 'create', 'first', 'pipeline', 'tutorial'],
    lastUpdated: '2026-06-01',
    video: {
      title: 'Creating Your First Opportunity',
      duration: '3:15',
      description: 'Step-by-step video guide showing how to create and manage a land opportunity.'
    }
  },

  // Land Acquisition
  {
    id: 'la-pipeline',
    title: 'Understanding the Land Pipeline',
    summary: 'How opportunities flow through statuses from identification to acquisition.',
    content: `
## Pipeline Statuses

Each land opportunity moves through these stages:

| Status | Meaning |
|--------|---------|
| Identified | Opportunity has been found and recorded |
| Initial Review | Basic assessment underway |
| Due Diligence | Detailed legal/technical evaluation |
| Offer Made | An offer has been submitted to the seller |
| Under Contract | Contracts have been exchanged |
| Acquired | Purchase completed |
| Withdrawn | Opportunity is no longer being pursued |

## Moving Between Statuses

Use the status dropdown on the opportunity detail page. The system enforces valid transitions (e.g., you cannot jump from Identified to Acquired).

## Dashboard View

The main dashboard shows a count of opportunities at each stage, giving you instant visibility of pipeline health.
    `,
    category: HELP_CATEGORIES[1],
    tags: ['pipeline', 'status', 'workflow', 'land', 'stages'],
    lastUpdated: '2026-06-01',
    video: {
      title: 'Understanding the Pipeline',
      duration: '4:00',
      description: 'Visual explanation of how opportunities flow through the acquisition pipeline stages.'
    }
  },
  {
    id: 'la-due-diligence',
    title: 'Due Diligence Management',
    summary: 'Recording and tracking legal, environmental, and planning checks on land opportunities.',
    content: `
## What is Due Diligence?

Due diligence is the investigation phase where you verify that a land opportunity is suitable for development. It covers legal, environmental, planning, utilities, and valuation checks.

## Types

- **Legal** — Title searches, ownership verification, encumbrances
- **Environmental** — Contamination, flood risk, ecology
- **Planning** — Zoning, permitted uses, planning history
- **Utilities** — Water, electricity, gas, drainage availability
- **Valuation** — Market value assessment, development appraisal

## How to Add Due Diligence

1. Open the opportunity detail page
2. Navigate to the "Due Diligence" tab
3. Click "Add Due Diligence"
4. Select the type and fill in findings
5. Update status as work progresses

## Statuses

- Pending — Not yet started
- In Progress — Investigation underway
- Completed — Findings recorded
- Failed — Critical issue found (may block acquisition)
    `,
    category: HELP_CATEGORIES[1],
    tags: ['due diligence', 'legal', 'environmental', 'planning', 'checks'],
    lastUpdated: '2026-06-01'
  },
  {
    id: 'la-offers',
    title: 'Making and Managing Offers',
    summary: 'How to submit, track, and negotiate offers on land opportunities.',
    content: `
## Offer Workflow

1. **Prepare** — Determine offer amount based on valuation and feasibility
2. **Submit** — Record the offer against the opportunity
3. **Track** — Monitor the seller's response
4. **Negotiate** — Record counter-offers if needed
5. **Accept/Reject** — Final outcome

## Offer Statuses

- Under Review — Waiting for seller response
- Accepted — Offer accepted, proceed to contracts
- Rejected — Seller declined
- Counter-Offered — Seller proposed different terms

## Tips

- Set a "Valid Until" date to create urgency
- Record the currency explicitly for international deals
- Link offers to the relevant opportunity for full traceability
    `,
    category: HELP_CATEGORIES[1],
    tags: ['offers', 'negotiation', 'price', 'deal'],
    lastUpdated: '2026-06-01'
  },
  {
    id: 'la-valuation',
    title: 'Valuation & Feasibility',
    summary: 'Understanding financial metrics and investment appraisals for land opportunities.',
    content: `
## Key Metrics

- **Asking Price** — What the seller is requesting
- **Estimated Value** — Your independent valuation
- **Development Cost** — Projected build and infrastructure costs
- **Expected Revenue** — Projected sales income
- **ROI** — Return on investment calculation

## Feasibility Process

1. Obtain independent valuation
2. Estimate development costs
3. Project revenue from unit sales
4. Calculate ROI and profit margin
5. Present to investment committee for approval

## Where to Record

Financial information is captured in the Opportunity form and detail page. Future modules will add dedicated feasibility tools.
    `,
    category: HELP_CATEGORIES[1],
    tags: ['valuation', 'feasibility', 'roi', 'finance', 'appraisal'],
    lastUpdated: '2026-06-01'
  },

  // Workflows
  {
    id: 'wf-approvals',
    title: 'Approval Workflows',
    summary: 'How the approval process works across all modules.',
    content: `
## Standard Approval Pattern

Every approval in BuildEstate Pro follows the same pattern:

1. **Submitted** — User submits item for review
2. **Under Review** — Assigned reviewer evaluates
3. **Approved / Rejected** — Decision recorded with notes
4. **Escalation** — Auto-escalated if no response within SLA

## Who Approves What?

| Item | Approver |
|------|----------|
| New Opportunity | Acquisition Manager |
| Due Diligence | Legal & Compliance Officer |
| Offer | Finance Director |
| Contract | Legal & Compliance Officer |
| Budget | Finance Director |

## Notifications

You'll receive in-app notifications when items need your approval or when decisions are made on your submissions.
    `,
    category: HELP_CATEGORIES[2],
    tags: ['approval', 'workflow', 'review', 'submit'],
    lastUpdated: '2026-06-01'
  },
  {
    id: 'wf-status-transitions',
    title: 'Status Transitions',
    summary: 'Valid status changes and what triggers them.',
    content: `
## Rules

The system enforces valid status transitions. You cannot skip stages or move backwards without justification.

## Opportunity Transitions

- Identified → Initial Review
- Initial Review → Due Diligence
- Due Diligence → Offer Made
- Offer Made → Under Contract
- Under Contract → Acquired
- Any status → Withdrawn (with reason)

## What Triggers a Transition

Status changes can be triggered by:
- Manual user action (clicking a status button)
- Approval workflow completion
- System automation (e.g., contract exchange date reached)
    `,
    category: HELP_CATEGORIES[2],
    tags: ['status', 'transition', 'change', 'state machine'],
    lastUpdated: '2026-06-01'
  },
  {
    id: 'wf-audit-trail',
    title: 'Audit Trail & Activity History',
    summary: 'How all actions are logged for compliance and traceability.',
    content: `
## What Gets Logged

Every create, update, and delete action is recorded:
- WHO did it (user name and role)
- WHAT they did (action type and entity affected)
- WHEN (timestamp)
- WHAT CHANGED (old values → new values)

## Where to View

Activity history appears on entity detail pages (e.g., Opportunity detail → Activity tab).

## Compliance

The audit trail is immutable — records cannot be edited or deleted. This ensures full compliance with regulatory requirements.

## Export

Audit data can be exported for compliance reviews and reporting.
    `,
    category: HELP_CATEGORIES[2],
    tags: ['audit', 'history', 'compliance', 'log', 'trail'],
    lastUpdated: '2026-06-01'
  },

  // Roles
  {
    id: 'roles-overview',
    title: 'Roles & Responsibilities',
    summary: 'Understanding who does what in BuildEstate Pro.',
    content: `
## Platform Roles

| Role | Responsibility |
|------|---------------|
| Acquisition Manager | Finds and evaluates land opportunities |
| Legal & Compliance Officer | Due diligence, legal checks, contracts |
| Planning Manager | Planning applications and council approvals |
| Project Manager | Project planning, budgets, timelines |
| Site Manager | Construction oversight, quality, safety |
| Sales Manager | Marketing, leads, sales pipeline |
| Completion Manager | Handover and project closeout |
| Property Manager | Rentals, tenants, maintenance |
| Finance Director | Financial performance and approvals |
| Valuation Analyst | Financial review and feasibility |
| Admin / Support | Documentation and data entry |

## What You Can See

Your role determines what navigation items, pages, and actions are visible to you. The system uses Role-Based Access Control (RBAC) to ensure you only see what's relevant.
    `,
    category: HELP_CATEGORIES[3],
    tags: ['roles', 'permissions', 'access', 'rbac', 'responsibilities'],
    lastUpdated: '2026-06-01'
  },
  {
    id: 'roles-permissions',
    title: 'Permission Levels',
    summary: 'How the permission hierarchy works.',
    content: `
## Permission Hierarchy

SuperAdmin > Finance Director > Project Manager > Domain Managers > Admin > Viewer

## What Each Level Can Do

- **SuperAdmin** — Full access to all features, users, and settings
- **Finance Director** — Financial approvals, budget oversight, reporting
- **Project Manager** — Project-level management across modules
- **Domain Managers** — Full access within their domain (e.g., Acquisition Manager for land)
- **Admin** — Data entry, document management, support tasks
- **Viewer** — Read-only access to relevant data

## Principle of Least Privilege

Users are given the minimum access needed to perform their role. This protects sensitive data and prevents accidental changes.
    `,
    category: HELP_CATEGORIES[3],
    tags: ['permissions', 'hierarchy', 'access', 'levels', 'security'],
    lastUpdated: '2026-06-01'
  },

  // Module Guide
  {
    id: 'mod-overview',
    title: 'Platform Modules Overview',
    summary: 'The 14 core modules and how they connect.',
    content: `
## The 14 Modules

1. **Land Acquisition** — Find, evaluate, and secure land
2. **Planning & Approvals** — Council approvals and permits
3. **Legal & Compliance** — Contracts and regulatory compliance
4. **Project Management** — Planning, milestones, tasks
5. **Construction Management** — Build progress and inspections
6. **Procurement & Materials** — Purchase orders and suppliers
7. **Contractors & Suppliers** — Vendor management
8. **Finance & Budget Control** — Cost tracking and cash flow
9. **Investors & Funding** — Capital management
10. **Property Units** — Unit configuration and availability
11. **Sales & Conveyancing** — Leads, reservations, sales
12. **Rental Management** — Tenants and maintenance
13. **Documents & Knowledge** — Document repository
14. **Reports & Dashboards** — Analytics and insights

## Data Flow

Data flows sequentially: Land Acquisition → Due Diligence → Planning → Design → Construction → Sales → Handover → Operations → Analytics

## Currently Available

The Land Acquisition module is live. Additional modules are being developed and will appear in the sidebar as they become available.
    `,
    category: HELP_CATEGORIES[4],
    tags: ['modules', 'overview', 'platform', 'features'],
    lastUpdated: '2026-06-01'
  },
  {
    id: 'mod-land-acquisition',
    title: 'Land Acquisition Module Guide',
    summary: 'Detailed guide for the Land Acquisition module.',
    content: `
## Purpose

Manage the full lifecycle of land opportunities from identification through to completed acquisition.

## Key Features

- **Opportunity Pipeline** — Visual pipeline of all land opportunities
- **Detail Pages** — Comprehensive information per opportunity
- **Due Diligence** — Track legal, environmental, planning checks
- **Offers** — Record and manage offer negotiations
- **Status Tracking** — Enforced workflow with valid transitions
- **Financial Data** — Asking price, valuation, ROI estimates

## Workflow

Identify → Initial Review → Due Diligence → Offer → Contract → Acquired

## Access

Available to: Acquisition Manager, Finance Director, SuperAdmin

## Key Pages

- **Dashboard** — Pipeline overview with status counts and financial summary
- **Opportunity List** — Searchable, filterable list of all opportunities
- **Opportunity Detail** — Full information with tabs for details, due diligence, offers
- **Create/Edit Form** — Guided form for capturing opportunity data
    `,
    category: HELP_CATEGORIES[4],
    tags: ['land acquisition', 'module', 'guide', 'opportunities'],
    lastUpdated: '2026-06-01'
  },
  {
    id: 'mod-dashboard',
    title: 'Dashboard Guide',
    summary: 'Understanding the main dashboard and its KPIs.',
    content: `
## What the Dashboard Shows

- **Pipeline Status Cards** — Count of opportunities at each stage
- **Financial Summary** — Total pipeline value, average price, total count
- **Quick Actions** — Shortcuts to common tasks

## How to Read It

- Green/high numbers in early stages = healthy pipeline
- Stuck items in "Due Diligence" or "Offer Made" = may need attention
- Total pipeline value = sum of all active opportunity asking prices

## Refresh

Data loads automatically when you visit the dashboard. Click "retry" if an error occurs.

## Future Enhancements

Charts, trend lines, and risk indicators will be added in upcoming releases.
    `,
    category: HELP_CATEGORIES[4],
    tags: ['dashboard', 'kpi', 'metrics', 'overview'],
    lastUpdated: '2026-06-01'
  },
  // Planning & Approvals
  {
    id: 'planning-overview',
    title: 'What is Planning & Approvals?',
    summary: 'An overview of the Planning & Approvals module and how it fits into the development lifecycle.',
    content: `
## What is Planning & Approvals?

After land is acquired, a planning application must be submitted to the local council before development can begin. The Planning & Approvals module helps you manage this process end-to-end.

## What You Can Do

- **Track Applications** — Manage your portfolio of planning applications across multiple sites and councils
- **Monitor Status** — Follow each application through its lifecycle from pre-application to decision
- **Manage Conditions** — Track and discharge planning conditions attached to approved applications
- **Handle Appeals** — Submit and track appeals for refused applications

## How It Works

1. Create a planning application linked to a land opportunity
2. Track status as the council processes it (Submitted → Validated → Under Review → Decision)
3. If approved with conditions, track and discharge each condition
4. If refused, submit an appeal and monitor the outcome
`,
    category: HELP_CATEGORIES[2],
    tags: ['planning', 'applications', 'council', 'overview'],
    lastUpdated: '2026-06-07'
  },
  {
    id: 'planning-lifecycle',
    title: 'Planning Application Lifecycle',
    summary: 'Understanding the stages a planning application goes through from submission to decision.',
    content: `
## Application Lifecycle

A planning application follows this lifecycle:

1. **Pre-Application** — Initial preparation and pre-app advice from the council
2. **Submitted** — Application formally submitted with all required documents
3. **Validated** — Council confirms all required information is present
4. **Under Review** — Planning officer assesses the application
5. **Committee Review** — (If required) Goes to planning committee for decision
6. **Approved / Approved with Conditions / Refused** — Council decision issued

## Status Transitions

Not all transitions are possible. The system enforces valid transitions:
- Pre-Application → Submitted or Withdrawn
- Submitted → Validated or Withdrawn
- Validated → Under Review or Withdrawn
- Under Review → Committee Review, Approved, Approved with Conditions, Refused, or Withdrawn
- Refused → Appeal

## Key Dates

The system tracks important dates automatically:
- **Submission Date** — Set when status changes to Submitted
- **Validation Date** — Set when status changes to Validated
- **Decision Date** — Set when a decision is made (Approved/Refused)
`,
    category: HELP_CATEGORIES[2],
    tags: ['planning', 'lifecycle', 'status', 'transitions'],
    lastUpdated: '2026-06-07'
  },
  {
    id: 'planning-conditions',
    title: 'Managing Planning Conditions',
    summary: 'How to track, manage, and discharge planning conditions attached to approved applications.',
    content: `
## What Are Planning Conditions?

When a planning application is approved with conditions, specific requirements must be met before or during development. Common conditions include:

- Landscaping schemes
- Materials samples
- Construction management plans
- Drainage strategies
- Ecological surveys

## Tracking Conditions

Each condition is automatically numbered and tracked with:
- **Title** — What the condition requires
- **Status** — Pending, Submitted, Partially Discharged, or Discharged
- **Due Date** — When it needs to be discharged by
- **Assigned To** — Who is responsible

## Discharging Conditions

To discharge a condition:
1. Navigate to the application detail page
2. Open the Conditions tab
3. Click "Discharge" on the relevant condition
4. Choose full or partial discharge
5. Optionally add a discharge reference number

Conditions can be partially discharged if only some elements have been approved.
`,
    category: HELP_CATEGORIES[2],
    tags: ['planning', 'conditions', 'discharge', 'approval'],
    lastUpdated: '2026-06-07'
  },
  {
    id: 'planning-appeals',
    title: 'Planning Appeals',
    summary: 'How to submit and track appeals against refused planning applications.',
    content: `
## When Can You Appeal?

An appeal can only be submitted when a planning application has been refused by the local council.

## How to Submit an Appeal

1. Navigate to the refused application's detail page
2. Open the Appeals tab
3. Click "Submit Appeal"
4. Provide the appeal reference, grounds, and any hearing details

## Appeal Lifecycle

- **Submitted** — Appeal filed with the Planning Inspectorate
- **In Progress** — Inspector assigned, evidence being reviewed
- **Allowed** — Appeal successful, planning permission granted
- **Dismissed** — Appeal unsuccessful, refusal upheld

## What Happens After

- If **Allowed**: The parent application status updates to Approved
- If **Dismissed**: The application remains Refused

## Tips

- Ensure your grounds for appeal are clearly documented
- Include the inspector's name once assigned
- Track hearing dates to ensure preparation is timely
`,
    category: HELP_CATEGORIES[2],
    tags: ['planning', 'appeals', 'refused', 'inspectorate'],
    lastUpdated: '2026-06-07'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I create a new land opportunity?',
    answer: 'Navigate to Opportunities in the sidebar, then click "Create New Opportunity". Fill in the required fields (Name, Location, Land Size) and click Save.',
    category: 'Land Acquisition'
  },
  {
    question: 'Can I change the status of an opportunity?',
    answer: 'Yes. Open the opportunity detail page and use the status controls. The system enforces valid transitions — you can only move to the next logical stage.',
    category: 'Workflows'
  },
  {
    question: 'What happens when I withdraw an opportunity?',
    answer: 'Withdrawing moves the opportunity out of the active pipeline. It remains in the system for historical records and reporting but will not appear in pipeline counts.',
    category: 'Land Acquisition'
  },
  {
    question: 'Who can approve offers?',
    answer: 'Offers are typically approved by the Finance Director or SuperAdmin. Your role determines what actions are available to you.',
    category: 'Roles & Permissions'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. BuildEstate Pro uses JWT authentication, role-based access control, encrypted connections (HTTPS), and a full audit trail. All actions are logged and traceable.',
    category: 'Security'
  },
  {
    question: 'How do I switch between light and dark theme?',
    answer: 'Click the moon/sun icon in the top-right corner of the header bar. Your preference is saved locally.',
    category: 'General'
  },
  {
    question: 'Can I export data?',
    answer: 'Export functionality is being developed. Currently, you can view all data on-screen with sorting and filtering capabilities.',
    category: 'General'
  },
  {
    question: 'What browsers are supported?',
    answer: 'BuildEstate Pro supports the latest versions of Chrome, Firefox, Edge, and Safari. We recommend Chrome or Edge for the best experience.',
    category: 'General'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Contact your system administrator. Self-service password reset will be available in a future release.',
    category: 'Account'
  },
  {
    question: 'Where can I see the audit trail?',
    answer: 'Activity history is available on entity detail pages. A dedicated audit log viewer will be added in a future release.',
    category: 'Compliance'
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Acquisition', definition: 'The process of purchasing land or property for development.', module: 'Land Acquisition' },
  { term: 'Due Diligence', definition: 'Comprehensive investigation of a land opportunity covering legal, environmental, planning, and financial aspects before purchase.', module: 'Land Acquisition' },
  { term: 'Pipeline', definition: 'The collection of all land opportunities at various stages of evaluation and acquisition.', module: 'Land Acquisition' },
  { term: 'Opportunity', definition: 'A potential land site identified for development. Tracked through the acquisition pipeline.', module: 'Land Acquisition' },
  { term: 'RBAC', definition: 'Role-Based Access Control. A security model where permissions are assigned to roles, and users are assigned roles.', module: 'Security' },
  { term: 'Snagging', definition: 'The process of identifying defects or incomplete work items before handover to the client.', module: 'Construction' },
  { term: 'Section 106', definition: 'A planning obligation requiring developers to make contributions to local infrastructure or affordable housing.', module: 'Planning' },
  { term: 'CIL', definition: 'Community Infrastructure Levy. A charge local authorities can set on new development to fund infrastructure.', module: 'Planning' },
  { term: 'Freehold', definition: 'Outright ownership of land and any buildings on it, with no time limit on ownership.', module: 'Legal' },
  { term: 'Leasehold', definition: 'Ownership of a property for a fixed period of time under a lease agreement with the freeholder.', module: 'Legal' },
  { term: 'ROI', definition: 'Return on Investment. The profit from a development expressed as a percentage of the total investment.', module: 'Finance' },
  { term: 'EPC', definition: 'Energy Performance Certificate. A rating of the energy efficiency of a building, required for sales and lettings.', module: 'Construction' },
  { term: 'LOI', definition: 'Letter of Intent. A document expressing a serious interest in purchasing land, often preceding a formal offer.', module: 'Land Acquisition' },
  { term: 'Conveyancing', definition: 'The legal process of transferring property ownership from one party to another.', module: 'Legal' },
  { term: 'Retention', definition: 'A percentage of a contractor payment withheld until defects liability period expires.', module: 'Finance' }
];
