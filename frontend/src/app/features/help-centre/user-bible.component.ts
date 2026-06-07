import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../shared/components/page-description/page-description.component';
import { SearchBoxComponent } from '../../shared/components/search-box/search-box.component';

interface BibleSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

/**
 * The User Bible — a comprehensive, searchable reference for everything about the platform.
 * Explains what the application does, why it exists, how each module works,
 * common tasks, best practices, troubleshooting, and role responsibilities.
 */
@Component({
  selector: 'app-user-bible',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, PageHeaderComponent, PageDescriptionComponent, SearchBoxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      {label: 'Home', url: '/dashboard'},
      {label: 'Help Centre', url: '/help'},
      {label: 'User Bible'}
    ]"></app-breadcrumb>
    <app-page-header title="User Bible" subtitle="The complete guide to BuildEstate Pro"></app-page-header>
    <app-page-description
      description="This is the definitive reference for BuildEstate Pro. It explains what the platform does, why each feature exists, how workflows operate, and what each role is responsible for. Use the search or table of contents to find what you need."
      guidance="Bookmark this page — it's your go-to reference for any question about the platform."
    ></app-page-description>

    <!-- Search -->
    <div class="mb-6">
      <app-search-box placeholder="Search the User Bible..." (searchChanged)="onSearch($event)"></app-search-box>
    </div>

    <!-- Table of Contents -->
    @if (!searchTerm) {
      <div class="card bg-base-100 border border-base-300 mb-6">
        <div class="card-body">
          <h3 class="font-semibold text-base-content mb-3">Table of Contents</h3>
          <nav aria-label="User Bible table of contents">
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
              @for (section of sections; track section.id) {
                <li>
                  <a [href]="'#' + section.id" class="flex items-center gap-2 p-2 rounded hover:bg-base-200 transition-colors">
                    <span>{{ section.icon }}</span>
                    <span class="text-sm font-medium text-primary">{{ section.title }}</span>
                  </a>
                </li>
              }
            </ul>
          </nav>
        </div>
      </div>
    }

    <!-- Sections -->
    <div class="space-y-6">
      @for (section of filteredSections; track section.id) {
        <div [id]="section.id" class="card bg-base-100 border border-base-300 scroll-mt-20">
          <div class="card-body">
            <h2 class="flex items-center gap-2 text-lg font-bold text-base-content">
              <span>{{ section.icon }}</span>
              {{ section.title }}
            </h2>
            <div class="text-sm text-base-content/70 leading-relaxed mt-3 whitespace-pre-line">{{ section.content }}</div>

            @if (section.subsections) {
              <div class="mt-4 space-y-4">
                @for (sub of section.subsections; track sub.title) {
                  <div class="pl-4 border-l-2 border-primary/20">
                    <h4 class="text-sm font-semibold text-base-content">{{ sub.title }}</h4>
                    <p class="text-sm text-base-content/60 mt-1 whitespace-pre-line">{{ sub.content }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>

    <div class="mt-6">
      <a routerLink="/help" class="btn btn-ghost btn-sm">← Back to Help Centre</a>
    </div>
  `
})
export class UserBibleComponent {
  searchTerm = '';
  filteredSections: BibleSection[] = [];

  readonly sections: BibleSection[] = [
    {
      id: 'what-is-buildestate',
      title: 'What is BuildEstate Pro?',
      icon: '🏢',
      content: 'BuildEstate Pro is an enterprise platform for managing the full lifecycle of property development projects. It covers everything from finding land opportunities through to construction, sales, handover, and long-term asset management.\n\nThe platform is designed for real estate development companies who need visibility, control, and compliance across all project phases.',
      subsections: [
        { title: 'Why does it exist?', content: 'Real estate development involves dozens of stakeholders, complex workflows, regulatory requirements, and significant financial risk. BuildEstate Pro brings all of this into one platform — replacing spreadsheets, emails, and disconnected tools with a unified system that provides real-time visibility and enforced compliance.' },
        { title: 'Who is it for?', content: 'Property development companies, housing associations, and investment firms who manage land acquisition, construction, and property sales at scale. Roles include Acquisition Managers, Project Managers, Finance Directors, Legal Officers, and Site Managers.' }
      ]
    },
    {
      id: 'platform-modules',
      title: 'Platform Modules',
      icon: '📦',
      content: 'BuildEstate Pro consists of 14 core modules, each handling a phase of the property development lifecycle:\n\n1. Land Acquisition — Find, evaluate, and purchase land\n2. Planning & Approvals — Manage council planning applications\n3. Legal & Compliance — Contracts, deeds, regulatory compliance\n4. Project Management — Plans, milestones, timelines, tasks\n5. Construction — Build progress, inspections, snagging\n6. Procurement — Purchase orders, materials tracking\n7. Contractors — Vendor management and performance\n8. Finance — Budgets, cost tracking, cash flow\n9. Investors — Capital management and returns\n10. Property Units — Unit configuration and availability\n11. Sales — Leads, viewings, reservations, completions\n12. Rental — Tenants, leases, maintenance\n13. Documents — Repository with version control\n14. Reports — Executive dashboards and analytics',
      subsections: [
        { title: 'Data Flow', content: 'Data flows sequentially through the platform: Land Acquisition → Due Diligence → Planning → Design & Prep → Construction → Sales → Handover → Operations → Analytics. Each module inherits context from previous phases.' },
        { title: 'Currently Available', content: 'The Land Acquisition module is live and fully operational. Additional modules are being developed and released incrementally.' }
      ]
    },
    {
      id: 'workflows',
      title: 'How Workflows Work',
      icon: '🔄',
      content: 'Every task in BuildEstate Pro follows a standard lifecycle:\n\n1. Task Created — Record appears in the system\n2. Assigned — Automatically assigned to the correct user based on role\n3. In Progress — User works on the task\n4. Review / Approval — Reviewed by an authorised approver\n5. Completed — Task finished and recorded\n6. Notifications — Stakeholders notified\n7. Audit Trail — All actions logged\n8. Reports Updated — Dashboards refresh automatically',
      subsections: [
        { title: 'Approval Pattern', content: 'Items follow: Submitted → Under Review → Approved/Rejected → Escalation (if SLA breached). Each entity type has a defined approver role.' },
        { title: 'Status Transitions', content: 'The system enforces valid status transitions. You cannot skip stages or go backwards without justification. This ensures data integrity and compliance.' }
      ]
    },
    {
      id: 'roles',
      title: 'Role Responsibilities',
      icon: '👥',
      content: 'BuildEstate Pro uses Role-Based Access Control (RBAC). Each user is assigned one or more roles that determine what they can see and do.',
      subsections: [
        { title: 'Acquisition Manager', content: 'Finds land opportunities, evaluates them, submits for approval, manages the pipeline.' },
        { title: 'Legal & Compliance Officer', content: 'Performs due diligence, manages contracts, ensures regulatory compliance.' },
        { title: 'Finance Director', content: 'Approves investments, monitors budgets, reviews feasibility analyses.' },
        { title: 'Project Manager', content: 'Plans the project, manages timelines, budgets, resources, and risks.' },
        { title: 'Site Manager', content: 'Oversees construction, tracks progress, manages quality and safety.' },
        { title: 'Sales Manager', content: 'Manages marketing, leads, sales pipeline, and unit reservations.' },
        { title: 'Admin / Support', content: 'Handles data entry, documentation, and system support tasks.' }
      ]
    },
    {
      id: 'common-tasks',
      title: 'Common Tasks',
      icon: '✅',
      content: 'Quick reference for the most frequent actions in the platform:',
      subsections: [
        { title: 'Create a Land Opportunity', content: 'Sidebar → Opportunities → Create New Opportunity → Fill Name, Location, Land Size → Save' },
        { title: 'Progress an Opportunity', content: 'Open opportunity detail → Use status controls → System enforces valid transitions' },
        { title: 'Add Due Diligence', content: 'Open opportunity → Due Diligence tab → Add Due Diligence → Select type → Record findings' },
        { title: 'Make an Offer', content: 'Open opportunity → Offers tab → Make an Offer → Enter amount and validity → Submit' },
        { title: 'Switch Theme', content: 'Click the moon/sun icon in the header → Preference saves automatically' },
        { title: 'Get Help', content: 'Click the "?" icon in the header or navigate to Help Centre in the sidebar' }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: '⭐',
      content: 'Follow these practices to get the most from BuildEstate Pro:',
      subsections: [
        { title: 'Naming Conventions', content: 'Use descriptive opportunity names that include location and size (e.g., "Riverside 2.5 Acres, Wandsworth"). This makes pipeline scanning faster.' },
        { title: 'Keep Data Current', content: 'Update opportunity status as soon as progress is made. The dashboard and reports are only as good as the data entered.' },
        { title: 'Use Notes', content: 'Add notes to opportunities when you learn new information. This helps colleagues who access the record later.' },
        { title: 'Complete Due Diligence', content: 'Don\'t skip due diligence types. Even if a check is "N/A", record it so the team knows it was considered.' },
        { title: 'Review the Dashboard', content: 'Check the dashboard daily to spot stalled items and identify priorities.' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      content: 'Common issues and how to resolve them:',
      subsections: [
        { title: 'Cannot log in', content: 'Verify your email and password. After 5 failed attempts, your account is locked for 15 minutes. Contact your admin if the issue persists.' },
        { title: 'Page not loading', content: 'Check your internet connection. Try refreshing the page. If the error persists, the system may be undergoing maintenance.' },
        { title: 'Cannot change status', content: 'The system enforces valid transitions. Check that the opportunity is at the correct stage for the action you want to take.' },
        { title: 'Missing sidebar items', content: 'Navigation is role-based. If you cannot see a menu item, your role may not have access. Contact your admin to review permissions.' },
        { title: 'Data not saving', content: 'Check that all required fields (marked with *) are filled in. Review any validation error messages shown in red below the fields.' }
      ]
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      icon: '🔒',
      content: 'BuildEstate Pro is built with enterprise security standards:',
      subsections: [
        { title: 'Authentication', content: 'JWT tokens with 60-minute expiry and automatic refresh. Account lockout after 5 failed attempts.' },
        { title: 'Authorization', content: 'Role-Based Access Control (RBAC) with principle of least privilege. Users only see data relevant to their role.' },
        { title: 'Audit Trail', content: 'Every create, update, and delete action is logged immutably. Includes who, what, when, and what changed.' },
        { title: 'Data Protection', content: 'HTTPS encryption in transit. Sensitive data encrypted at rest. No secrets in URLs or logs.' },
        { title: 'Compliance', content: 'Designed to support ISO 27001, GDPR, and AML requirements. Audit data is exportable for regulatory reviews.' }
      ]
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Navigation',
      icon: '⌨️',
      content: 'BuildEstate Pro supports full keyboard navigation:',
      subsections: [
        { title: 'Tab', content: 'Move between interactive elements (links, buttons, inputs)' },
        { title: 'Enter / Space', content: 'Activate buttons and links' },
        { title: 'Escape', content: 'Close modals and dialogs' },
        { title: 'Arrow Keys', content: 'Navigate within tabs, menus, and dropdowns' },
        { title: 'Skip to Content', content: 'Tab from the page top to skip navigation and jump to main content' }
      ]
    }
  ];

  constructor() {
    this.filteredSections = this.sections;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    if (!term.trim()) {
      this.filteredSections = this.sections;
      return;
    }
    const lower = term.toLowerCase();
    this.filteredSections = this.sections.filter(s =>
      s.title.toLowerCase().includes(lower) ||
      s.content.toLowerCase().includes(lower) ||
      s.subsections?.some(sub =>
        sub.title.toLowerCase().includes(lower) ||
        sub.content.toLowerCase().includes(lower)
      )
    );
  }
}
