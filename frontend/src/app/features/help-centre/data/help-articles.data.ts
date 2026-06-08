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
    id: 'legal',
    label: 'Legal & Compliance',
    description: 'Manage contracts, compliance checks, and legal tasks.',
    icon: '⚖️',
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
  },
  // Legal & Compliance
  {
    id: 'contracts-overview',
    title: 'What is Legal & Compliance?',
    summary: 'An overview of the Legal & Compliance module — contracts, compliance checks, and legal tasks.',
    content: `
## What is Legal & Compliance?

The Legal & Compliance module manages all legal activities across the platform — contracts, compliance checks, documents, and legal tasks.

## What You Can Do

- **Manage Contracts** — Track sale & purchase agreements, option agreements, leases
- **Run Compliance Checks** — AML, KYC, title verification, environmental searches
- **Track Legal Tasks** — Manage deadlines, reviews, and actions
- **Link Documents** — Attach title deeds, search reports, and contract copies
`,
    category: HELP_CATEGORIES[4],
    tags: ['legal', 'compliance', 'contracts', 'overview'],
    lastUpdated: '2026-06-07'
  },
  {
    id: 'contract-lifecycle',
    title: 'Contract Lifecycle',
    summary: 'How contracts progress from Draft through to Completion or Termination.',
    content: `
## Contract Lifecycle

1. **Draft** — Contract being prepared
2. **Under Review** — Legal team reviewing terms
3. **Awaiting Signature** — Sent for signing
4. **Exchanged** — Both parties signed, deposit paid
5. **Completed** — Contract fulfilled
6. **Terminated** — Contract ended before completion
`,
    category: HELP_CATEGORIES[4],
    tags: ['legal', 'contracts', 'lifecycle', 'status'],
    lastUpdated: '2026-06-07'
  },
  {
    id: 'compliance-checks-guide',
    title: 'Compliance Checks',
    summary: 'Types of compliance checks, how to manage them, and risk levels.',
    content: `
## Compliance Check Types

AML, KYC, Title Verification, Local Authority, Environmental, Planning, Utilities, Drainage, Highway Search, Mining.

## Risk Levels

Low, Medium, High, Critical — assigned when a check is completed.

## Status Flow

Not Started → In Progress → Passed / Failed / Flagged
`,
    category: HELP_CATEGORIES[4],
    tags: ['legal', 'compliance', 'checks', 'risk'],
    lastUpdated: '2026-06-07'
  },
  {
    id: 'legal-tasks-guide',
    title: 'Legal Tasks',
    summary: 'How to manage legal tasks, deadlines, and assignments.',
    content: `
## Legal Tasks

Track action items for the legal team — reviews, submissions, chasing solicitors, completion actions.

Tasks have: Title, Priority (Low/Medium/High/Urgent), Status (Open/InProgress/Completed/Cancelled), Assigned To, Due Date.

Overdue tasks are highlighted. Status can be changed directly from the table.
`,
    category: HELP_CATEGORIES[4],
    tags: ['legal', 'tasks', 'deadlines', 'management'],
    lastUpdated: '2026-06-07'
  },

  // Module 4 — Project Management
  {
    id: 'project-overview',
    title: 'Project Management Overview',
    summary: 'What the Project Management module does and its key features.',
    content: `
## What is Project Management?

The Project Management module is the central hub for planning, tracking, and delivering real estate development projects from inception to completion.

## Key Features

- **Project Registry** — Create and manage all development projects in one place
- **Milestones & Tasks** — Break projects into phases, milestones, and actionable tasks
- **Timeline & Gantt** — Visualise project schedules and dependencies
- **Risk & Issue Tracking** — Identify and mitigate risks before they become problems
- **Resource Allocation** — Assign team members and track capacity

## How to Use

Navigate to Projects in the sidebar to view all active projects. Use the project detail page to manage milestones, tasks, and team assignments.
`,
    category: HELP_CATEGORIES[6],
    tags: ['project', 'management', 'milestones', 'tasks', 'timeline'],
    lastUpdated: '2026-06-15'
  },
  {
    id: 'project-lifecycle',
    title: 'Project Lifecycle',
    summary: 'Understanding the stages a project moves through from planning to completion.',
    content: `
## What is the Project Lifecycle?

Every project follows a structured lifecycle that ensures proper governance and delivery.

## Lifecycle Stages

- **Planning** — Define scope, budget, timeline, and resources
- **Pre-Construction** — Design approvals, procurement, contractor appointment
- **In Progress** — Active construction and development work
- **Completed** — All works finished, handover and closeout

## How to Use

Project status is updated as the project progresses. Each stage unlocks relevant features and dashboards for that phase of delivery.
`,
    category: HELP_CATEGORIES[6],
    tags: ['project', 'lifecycle', 'stages', 'planning', 'construction'],
    lastUpdated: '2026-06-15'
  },

  // Module 5 — Construction
  {
    id: 'construction-stages',
    title: 'Construction Stages',
    summary: 'What construction stages are and how to track progress through them.',
    content: `
## What are Construction Stages?

Construction stages break a build project into sequential phases, each representing a major milestone in the physical development.

## Key Features

- **Stage Definition** — Define stages like Foundations, Superstructure, Fit-Out, External Works
- **Progress Tracking** — Record percentage completion per stage
- **Stage Sign-Off** — Require approval before moving to the next stage
- **Photo Evidence** — Attach site photos to document progress

## How to Use

Open a project and navigate to the Construction tab. Add stages in order, update progress as work is completed, and sign off each stage before proceeding.
`,
    category: HELP_CATEGORIES[6],
    tags: ['construction', 'stages', 'progress', 'build', 'site'],
    lastUpdated: '2026-06-15'
  },
  {
    id: 'inspections-snags',
    title: 'Inspections & Snagging',
    summary: 'Types of inspections, what snags are, and how to manage them.',
    content: `
## What are Inspections?

Inspections are formal checks carried out at key points during construction to ensure quality, safety, and compliance with design specifications.

## Key Features

- **Inspection Types** — Building Control, Fire Safety, Quality, Health & Safety, Client
- **Snagging Lists** — Record defects or incomplete work items found during inspections
- **Assign & Track** — Assign snags to contractors with due dates
- **Resolution** — Mark snags as resolved once rectified and re-inspected

## How to Use

Create inspections from the project detail page. During inspections, log any snags found. Track resolution progress on the snagging dashboard.
`,
    category: HELP_CATEGORIES[6],
    tags: ['construction', 'inspections', 'snags', 'defects', 'quality'],
    lastUpdated: '2026-06-15'
  },

  // Module 6 — Procurement
  {
    id: 'procurement-overview',
    title: 'Procurement & Materials',
    summary: 'Overview of procurement — purchase orders, deliveries, and material tracking.',
    content: `
## What is Procurement?

The Procurement module manages the ordering, delivery, and tracking of materials and services needed for construction projects.

## Key Features

- **Purchase Orders** — Create and manage orders to suppliers
- **Delivery Tracking** — Log deliveries against orders and verify quantities
- **Material Registry** — Catalogue of materials with specifications and pricing
- **Budget Integration** — Link procurement spend to project budgets

## How to Use

Navigate to Procurement in the sidebar. Create purchase orders linked to projects, track deliveries as they arrive on site, and monitor spend against budget allocations.
`,
    category: HELP_CATEGORIES[6],
    tags: ['procurement', 'materials', 'purchase orders', 'deliveries', 'supply'],
    lastUpdated: '2026-06-15'
  },
  {
    id: 'purchase-orders',
    title: 'Managing Purchase Orders',
    summary: 'The purchase order lifecycle from Draft to Delivered.',
    content: `
## What is a Purchase Order?

A purchase order (PO) is a formal request to a supplier for materials or services, with agreed quantities, prices, and delivery dates.

## Purchase Order Lifecycle

- **Draft** — PO being prepared, not yet sent to supplier
- **Submitted** — Sent to supplier for confirmation
- **Approved** — Supplier confirmed and order is active
- **Partially Delivered** — Some items received, others outstanding
- **Delivered** — All items received and verified

## How to Use

Create a PO from the Procurement section, link it to a project and supplier, add line items, then submit. Update status as deliveries arrive on site.
`,
    category: HELP_CATEGORIES[6],
    tags: ['procurement', 'purchase orders', 'lifecycle', 'suppliers', 'orders'],
    lastUpdated: '2026-06-15'
  },

  // Module 7 — Contractors
  {
    id: 'contractors-overview',
    title: 'Contractors & Suppliers',
    summary: 'Managing your contractor and supplier database, types, and performance.',
    content: `
## What is Contractors & Suppliers?

This module manages your database of external companies that provide construction services, materials, and specialist expertise.

## Key Features

- **Contractor Registry** — Maintain a database of all contractors and suppliers
- **Types & Categories** — Classify by trade (groundworks, electrical, plumbing, roofing, etc.)
- **Performance Tracking** — Rate contractors on quality, timeliness, and value
- **Compliance Records** — Track insurance, certifications, and health & safety documentation
- **Payment History** — View payment records and outstanding invoices

## How to Use

Navigate to Contractors in the sidebar. Add new contractors with their trade details, certifications, and contact information. Link contractors to projects and track their performance over time.
`,
    category: HELP_CATEGORIES[6],
    tags: ['contractors', 'suppliers', 'vendors', 'trades', 'performance'],
    lastUpdated: '2026-06-15'
  },

  // Module 8 — Finance
  {
    id: 'finance-overview',
    title: 'Finance & Budget Control',
    summary: 'Budget lines, cost tracking, transactions, and cash flow management.',
    content: `
## What is Finance & Budget Control?

The Finance module provides comprehensive budget planning, cost tracking, and financial oversight for all development projects.

## Key Features

- **Budget Lines** — Define budgets per project broken into categories (land, construction, professional fees, marketing)
- **Transaction Recording** — Log all income and expenditure against budget lines
- **Variance Analysis** — Compare actual spend vs budgeted amounts in real-time
- **Cash Flow Forecasting** — Project future income and outgoings
- **Financial Approvals** — Require sign-off for expenditure above thresholds

## How to Use

Open a project and navigate to the Finance tab. Set up budget lines, record transactions as they occur, and monitor the dashboard for variances and cash flow health.
`,
    category: HELP_CATEGORIES[6],
    tags: ['finance', 'budget', 'costs', 'cash flow', 'transactions'],
    lastUpdated: '2026-06-15'
  },

  // Module 9 — Investors
  {
    id: 'investors-overview',
    title: 'Investors & Funding',
    summary: 'Investor profiles, funding rounds, and committed vs deployed capital.',
    content: `
## What is Investors & Funding?

The Investors module manages relationships with funding partners, tracks capital commitments, and monitors deployment of funds across projects.

## Key Features

- **Investor Profiles** — Maintain detailed records of each investor and their preferences
- **Funding Rounds** — Track fundraising activities and capital commitments
- **Committed vs Deployed** — Monitor how much capital is promised versus actually drawn down
- **Returns Tracking** — Calculate and report investor returns per project
- **Communications** — Log interactions and reporting to investors

## How to Use

Navigate to Investors in the sidebar. Add investor profiles, record funding commitments, and track deployment as capital is drawn against projects.
`,
    category: HELP_CATEGORIES[6],
    tags: ['investors', 'funding', 'capital', 'returns', 'finance'],
    lastUpdated: '2026-06-15'
  },

  // Module 10 — Property Units
  {
    id: 'units-overview',
    title: 'Property Units',
    summary: 'Unit registry, statuses, configuration, and availability tracking.',
    content: `
## What are Property Units?

Property Units represent the individual sellable or rentable assets within a development — flats, houses, commercial spaces, or parking bays.

## Key Features

- **Unit Registry** — Define all units within a project with type, size, and specification
- **Status Tracking** — Monitor each unit: Available, Reserved, Sold, Exchanged, Completed, Rented
- **Configuration** — Record bedrooms, bathrooms, floor area, floor level, aspect, and features
- **Pricing** — Set asking prices and track agreed sale prices
- **Availability Dashboard** — Visual overview of unit availability across the development

## How to Use

Navigate to Property Units from the project detail page. Add units individually or in bulk, configure their details, and update statuses as sales or lettings progress.
`,
    category: HELP_CATEGORIES[6],
    tags: ['units', 'property', 'availability', 'configuration', 'status'],
    lastUpdated: '2026-06-15'
  },

  // Module 11 — Sales
  {
    id: 'sales-overview',
    title: 'Sales & Marketing',
    summary: 'Leads management, sales pipeline stages, and reservation tracking.',
    content: `
## What is Sales & Marketing?

The Sales module manages the journey from marketing a development through to reserving and selling individual units to buyers.

## Key Features

- **Lead Management** — Capture and qualify buyer enquiries from all marketing channels
- **Pipeline Stages** — Track leads through: Enquiry → Viewing → Reservation → Exchange → Completion
- **Reservation Management** — Record reservations with deposits and buyer details
- **Sales Reporting** — Monitor sales velocity, revenue forecasts, and conversion rates
- **Marketing Integration** — Link marketing campaigns to lead sources

## How to Use

Navigate to Sales in the sidebar. Add leads as enquiries come in, progress them through viewings and reservations, and track through to legal completion.
`,
    category: HELP_CATEGORIES[6],
    tags: ['sales', 'marketing', 'leads', 'pipeline', 'reservations'],
    lastUpdated: '2026-06-15'
  },

  // Module 12 — Rentals
  {
    id: 'rentals-overview',
    title: 'Rental Management',
    summary: 'Tenancy management, rent collection, and property operations.',
    content: `
## What is Rental Management?

The Rental module manages units that are let rather than sold — handling tenancies, rent collection, and ongoing property operations.

## Key Features

- **Tenancy Records** — Create and manage tenancy agreements with start/end dates and terms
- **Rent Collection** — Track rent due, received, and arrears per tenancy
- **Maintenance Requests** — Log and manage tenant maintenance issues
- **Inspections** — Schedule and record periodic property inspections
- **Renewals & Notices** — Track lease renewals and notice periods

## How to Use

Navigate to Rentals in the sidebar. Create tenancies linked to available units, record rent payments as they arrive, and manage maintenance requests from tenants.
`,
    category: HELP_CATEGORIES[6],
    tags: ['rentals', 'tenants', 'rent', 'maintenance', 'lettings'],
    lastUpdated: '2026-06-15'
  },

  // Module 13 — Documents
  {
    id: 'documents-overview',
    title: 'Documents & Knowledge',
    summary: 'Document repository, categories, version control, and templates.',
    content: `
## What is Documents & Knowledge?

The Documents module provides a centralised repository for all project documentation — contracts, drawings, reports, certificates, and templates.

## Key Features

- **Document Repository** — Upload, store, and organise all project files
- **Categories** — Classify documents: Legal, Planning, Construction, Financial, Marketing, Compliance
- **Version Control** — Track document revisions with version history
- **Templates** — Store reusable document templates for common items
- **Linking** — Associate documents with projects, units, contractors, or opportunities

## How to Use

Navigate to Documents in the sidebar. Upload files, assign categories, and link them to the relevant project entities. Use version control when updating existing documents.
`,
    category: HELP_CATEGORIES[6],
    tags: ['documents', 'files', 'repository', 'versioning', 'templates'],
    lastUpdated: '2026-06-15'
  },

  // Module 14 — Reports
  {
    id: 'reports-overview',
    title: 'Reports & Dashboards',
    summary: 'Report types, generation, and executive dashboards.',
    content: `
## What are Reports & Dashboards?

The Reports module provides analytics and insights across all platform data — financial summaries, construction progress, sales performance, and executive overviews.

## Key Features

- **Report Types** — Financial, Construction Progress, Sales, Pipeline, Compliance, Investor Returns
- **Generation** — Run reports on-demand with date range and project filters
- **Executive Dashboards** — High-level KPIs for leadership decision-making
- **Export** — Download reports as PDF or Excel for stakeholder distribution
- **Scheduled Reports** — Configure automatic report generation and delivery

## How to Use

Navigate to Reports in the sidebar. Select a report type, configure filters (date range, project, status), and generate. Pin frequently used reports to your dashboard for quick access.
`,
    category: HELP_CATEGORIES[6],
    tags: ['reports', 'dashboards', 'analytics', 'kpis', 'insights'],
    lastUpdated: '2026-06-15'
  },

  // Admin — Audit Log
  {
    id: 'audit-log-overview',
    title: 'Audit Log',
    summary: 'What actions are logged, how to filter the audit trail, and compliance usage.',
    content: `
## What is the Audit Log?

The Audit Log records every significant action taken in the platform — creating, updating, and deleting records — providing a complete, immutable trail for compliance and accountability.

## What Gets Logged

- **Who** — User name, ID, and role
- **What** — Action type (Create, Update, Delete) and the entity affected
- **When** — UTC timestamp of the action
- **Changes** — Old values and new values for updated fields

## How to Filter

- Filter by user, date range, entity type, or action type
- Search for specific entity IDs to trace the full history of a record
- Export filtered results for compliance reviews or audits

## Compliance

The audit trail is immutable — entries cannot be edited or deleted. This meets ISO 27001 and GDPR accountability requirements. Use exports to provide evidence during regulatory audits.
`,
    category: HELP_CATEGORIES[6],
    tags: ['audit', 'log', 'compliance', 'trail', 'admin', 'security'],
    lastUpdated: '2026-06-15'
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
