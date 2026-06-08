import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import {
  ProjectDetail, ProjectStatus, MilestoneItem, ProjectTaskItem, ProjectRiskItem
} from '../../../core/models/project.model';
import * as ProjectsActions from '../store/projects.actions';
import * as ProjectsSelectors from '../store/projects.selectors';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    PageHeaderComponent, BreadcrumbComponent, LoadingStateComponent,
    EmptyStateComponent, StatusBadgeComponent, ErrorStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Project Management', url: '/projects'}, {label: 'Projects', url: '/projects'}, {label: (project$ | async)?.projectReference ?? 'Detail'}]"></app-breadcrumb>

    @if (selectedLoading$ | async) {
      <app-loading-state message="Loading project details..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadData()"></app-error-state>
    } @else if (project$ | async; as project) {
      <app-page-header [title]="project.projectReference" [subtitle]="project.name">
        <div class="flex gap-2">
          <a [routerLink]="['/projects', project.id, 'edit']" class="btn btn-primary btn-sm">Edit Project</a>
          @if (canChangeStatus(project.status)) {
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-outline btn-sm">Change Status ▾</label>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                @for (status of availableStatuses(project.status); track status) {
                  <li><button (click)="changeStatus(project.id, status)">{{ formatStatus(status) }}</button></li>
                }
              </ul>
            </div>
          }
        </div>
      </app-page-header>

      <!-- Key Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Status</p>
          <app-status-badge [status]="project.status"></app-status-badge>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Manager</p>
          <p class="font-medium">{{ project.projectManager ?? '—' }}</p>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Budget</p>
          <p class="font-medium">{{ project.budget ? ('£' + (project.budget | number:'1.0-0')) : '—' }}</p>
        </div>
        <div class="card bg-base-100 border border-base-300 p-4">
          <p class="text-xs text-base-content/50 uppercase">Progress</p>
          @if (project.progressPercent !== null) {
            <div class="flex items-center gap-2">
              <progress class="progress progress-primary w-20" [value]="project.progressPercent" max="100"></progress>
              <span class="font-medium">{{ project.progressPercent }}%</span>
            </div>
          } @else {
            <p class="font-medium">—</p>
          }
        </div>
      </div>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-bordered mb-6">
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'details'" (click)="activeTab.set('details')">Details</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'milestones'" (click)="switchTab('milestones')">
          Milestones ({{ project.milestoneCount }})
        </button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'tasks'" (click)="switchTab('tasks')">
          Tasks ({{ project.taskCount }})
        </button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'risks'" (click)="switchTab('risks')">
          Risks ({{ project.riskCount }})
        </button>
        <button role="tab" class="tab" [class.tab-active]="activeTab() === 'activity'" (click)="activeTab.set('activity')">Activity</button>
      </div>

      <!-- Details Tab -->
      @if (activeTab() === 'details') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div><span class="text-xs text-base-content/50">Linked Opportunity</span>
                <p><a [routerLink]="['/opportunities', project.opportunityId]" class="link link-primary text-sm">{{ project.opportunityName }}</a></p>
              </div>
              <div><span class="text-xs text-base-content/50">Project Reference</span><p>{{ project.projectReference }}</p></div>
              <div><span class="text-xs text-base-content/50">Project Manager</span><p>{{ project.projectManager ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Site Address</span><p>{{ project.siteAddress ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Start Date</span><p>{{ project.startDate ? (project.startDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Target End Date</span><p>{{ project.targetEndDate ? (project.targetEndDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Actual End Date</span><p>{{ project.actualEndDate ? (project.actualEndDate | date:'mediumDate') : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Budget</span><p>{{ project.budget ? ('£' + (project.budget | number:'1.2-2')) : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Actual Cost</span><p>{{ project.actualCost ? ('£' + (project.actualCost | number:'1.2-2')) : '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Total Units</span><p>{{ project.totalUnits ?? '—' }}</p></div>
              <div><span class="text-xs text-base-content/50">Created</span><p>{{ project.createdAt | date:'medium' }}</p></div>
              <div><span class="text-xs text-base-content/50">Created By</span><p>{{ project.createdBy }}</p></div>
              <div><span class="text-xs text-base-content/50">Last Updated</span><p>{{ project.updatedAt ? (project.updatedAt | date:'medium') : '—' }}</p></div>
            </div>

            @if (project.description) {
              <div class="mt-4 pt-4 border-t border-base-300">
                <span class="text-xs text-base-content/50">Description</span>
                <p class="whitespace-pre-wrap mt-1">{{ project.description }}</p>
              </div>
            }

            @if (project.notes) {
              <div class="mt-4 pt-4 border-t border-base-300">
                <span class="text-xs text-base-content/50">Notes</span>
                <p class="whitespace-pre-wrap mt-1">{{ project.notes }}</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- Milestones Tab -->
      @if (activeTab() === 'milestones') {
        <div class="card bg-base-100 border border-base-300 mb-4">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">Project Milestones</h3>
              <button class="btn btn-primary btn-sm" (click)="showMilestoneForm.set(!showMilestoneForm())">
                {{ showMilestoneForm() ? '✕ Cancel' : '+ Add Milestone' }}
              </button>
            </div>

            @if (showMilestoneForm()) {
              <form [formGroup]="milestoneForm" (ngSubmit)="submitMilestone(project.id)" class="p-4 bg-base-200 rounded-lg mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input formControlName="title" class="input input-bordered input-sm w-full" placeholder="Milestone title *"
                    [class.input-error]="milestoneForm.get('title')?.invalid && milestoneForm.get('title')?.touched" />
                  <input formControlName="targetDate" type="date" class="input input-bordered input-sm w-full"
                    [class.input-error]="milestoneForm.get('targetDate')?.invalid && milestoneForm.get('targetDate')?.touched" />
                  <input formControlName="description" class="input input-bordered input-sm w-full" placeholder="Description (optional)" />
                  <input formControlName="notes" class="input input-bordered input-sm w-full" placeholder="Notes (optional)" />
                </div>
                <div class="mt-3 flex justify-end">
                  <button type="submit" class="btn btn-primary btn-sm" [disabled]="milestoneForm.invalid">Create Milestone</button>
                </div>
              </form>
            }

            @if (milestonesLoading$ | async) {
              <app-loading-state message="Loading milestones..."></app-loading-state>
            } @else if ((milestones$ | async)?.length === 0) {
              <app-empty-state
                title="No Milestones Yet"
                message="Add milestones to track key deliverables and deadlines for this project.">
              </app-empty-state>
            } @else {
              <div class="overflow-x-auto">
                <table class="table table-zebra table-sm" aria-label="Project milestones">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Target Date</th>
                      <th>Completed</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (milestone of milestones$ | async; track milestone.id) {
                      <tr>
                        <td class="font-medium">{{ milestone.title }}</td>
                        <td><app-status-badge [status]="milestone.status"></app-status-badge></td>
                        <td class="text-sm">{{ milestone.targetDate | date:'mediumDate' }}</td>
                        <td class="text-sm">{{ milestone.completedDate ? (milestone.completedDate | date:'mediumDate') : '—' }}</td>
                        <td class="text-sm max-w-[200px] truncate">{{ milestone.notes ?? '—' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      }

      <!-- Tasks Tab -->
      @if (activeTab() === 'tasks') {
        <div class="card bg-base-100 border border-base-300 mb-4">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">Project Tasks</h3>
              <button class="btn btn-primary btn-sm" (click)="showTaskForm.set(!showTaskForm())">
                {{ showTaskForm() ? '✕ Cancel' : '+ Add Task' }}
              </button>
            </div>

            @if (showTaskForm()) {
              <form [formGroup]="taskForm" (ngSubmit)="submitTask(project.id)" class="p-4 bg-base-200 rounded-lg mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input formControlName="title" class="input input-bordered input-sm w-full" placeholder="Task title *"
                    [class.input-error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" />
                  <select formControlName="priority" class="select select-bordered select-sm w-full">
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                  <input formControlName="assignedTo" class="input input-bordered input-sm w-full" placeholder="Assigned to (optional)" />
                  <input formControlName="dueDate" type="date" class="input input-bordered input-sm w-full" />
                  <input formControlName="description" class="input input-bordered input-sm w-full" placeholder="Description (optional)" />
                  <input formControlName="notes" class="input input-bordered input-sm w-full" placeholder="Notes (optional)" />
                </div>
                <div class="mt-3 flex justify-end">
                  <button type="submit" class="btn btn-primary btn-sm" [disabled]="taskForm.invalid">Create Task</button>
                </div>
              </form>
            }

            @if (tasksLoading$ | async) {
              <app-loading-state message="Loading tasks..."></app-loading-state>
            } @else if ((tasks$ | async)?.length === 0) {
              <app-empty-state
                title="No Tasks Yet"
                message="Add tasks to break down project work into manageable actions with assignments and due dates.">
              </app-empty-state>
            } @else {
              <div class="overflow-x-auto">
                <table class="table table-zebra table-sm" aria-label="Project tasks">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assigned To</th>
                      <th>Due Date</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (task of tasks$ | async; track task.id) {
                      <tr>
                        <td class="font-medium">{{ task.title }}</td>
                        <td><app-status-badge [status]="task.status"></app-status-badge></td>
                        <td>
                          <span class="badge badge-sm" [ngClass]="{
                            'badge-error': task.priority === 'Critical',
                            'badge-warning': task.priority === 'High',
                            'badge-info': task.priority === 'Medium',
                            'badge-ghost': task.priority === 'Low'
                          }">{{ task.priority }}</span>
                        </td>
                        <td class="text-sm">{{ task.assignedTo ?? '—' }}</td>
                        <td class="text-sm">{{ task.dueDate ? (task.dueDate | date:'mediumDate') : '—' }}</td>
                        <td class="text-sm">{{ task.progressPercent !== null ? (task.progressPercent + '%') : '—' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      }

      <!-- Risks Tab -->
      @if (activeTab() === 'risks') {
        <div class="card bg-base-100 border border-base-300 mb-4">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">Project Risks</h3>
              <button class="btn btn-primary btn-sm" (click)="showRiskForm.set(!showRiskForm())">
                {{ showRiskForm() ? '✕ Cancel' : '+ Add Risk' }}
              </button>
            </div>

            @if (showRiskForm()) {
              <form [formGroup]="riskForm" (ngSubmit)="submitRisk(project.id)" class="p-4 bg-base-200 rounded-lg mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input formControlName="title" class="input input-bordered input-sm w-full" placeholder="Risk title *"
                    [class.input-error]="riskForm.get('title')?.invalid && riskForm.get('title')?.touched" />
                  <select formControlName="impact" class="select select-bordered select-sm w-full">
                    <option value="">Select impact *</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <select formControlName="probability" class="select select-bordered select-sm w-full">
                    <option value="">Select probability *</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="VeryHigh">Very High</option>
                  </select>
                  <input formControlName="owner" class="input input-bordered input-sm w-full" placeholder="Risk owner (optional)" />
                  <input formControlName="description" class="input input-bordered input-sm w-full" placeholder="Description (optional)" />
                  <input formControlName="mitigationPlan" class="input input-bordered input-sm w-full" placeholder="Mitigation plan (optional)" />
                  <input formControlName="notes" class="input input-bordered input-sm w-full md:col-span-2" placeholder="Notes (optional)" />
                </div>
                <div class="mt-3 flex justify-end">
                  <button type="submit" class="btn btn-primary btn-sm" [disabled]="riskForm.invalid">Create Risk</button>
                </div>
              </form>
            }

            @if (risksLoading$ | async) {
              <app-loading-state message="Loading risks..."></app-loading-state>
            } @else if ((risks$ | async)?.length === 0) {
              <app-empty-state
                title="No Risks Identified"
                message="Record project risks with their impact, probability, and mitigation plans to proactively manage threats.">
              </app-empty-state>
            } @else {
              <div class="overflow-x-auto">
                <table class="table table-zebra table-sm" aria-label="Project risks">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Impact</th>
                      <th>Probability</th>
                      <th>Owner</th>
                      <th>Mitigation</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (risk of risks$ | async; track risk.id) {
                      <tr>
                        <td class="font-medium">{{ risk.title }}</td>
                        <td><app-status-badge [status]="risk.status"></app-status-badge></td>
                        <td>
                          <span class="badge badge-sm" [ngClass]="{
                            'badge-error': risk.impact === 'Critical',
                            'badge-warning': risk.impact === 'High',
                            'badge-info': risk.impact === 'Medium',
                            'badge-ghost': risk.impact === 'Low'
                          }">{{ risk.impact }}</span>
                        </td>
                        <td class="text-sm">{{ formatStatus(risk.probability) }}</td>
                        <td class="text-sm">{{ risk.owner ?? '—' }}</td>
                        <td class="text-sm max-w-[200px] truncate">{{ risk.mitigationPlan ?? '—' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      }

      <!-- Activity Tab -->
      @if (activeTab() === 'activity') {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <app-empty-state
              title="Activity Timeline"
              message="All status changes, milestone completions, task updates, and events for this project are recorded here from the audit log.">
            </app-empty-state>
          </div>
        </div>
      }
    }
  `
})
export class ProjectDetailComponent implements OnInit {
  project$: Observable<ProjectDetail | null>;
  selectedLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  milestones$: Observable<MilestoneItem[]>;
  milestonesLoading$: Observable<boolean>;
  tasks$: Observable<ProjectTaskItem[]>;
  tasksLoading$: Observable<boolean>;
  risks$: Observable<ProjectRiskItem[]>;
  risksLoading$: Observable<boolean>;

  activeTab = signal<'details' | 'milestones' | 'tasks' | 'risks' | 'activity'>('details');
  showMilestoneForm = signal(false);
  showTaskForm = signal(false);
  showRiskForm = signal(false);

  milestoneForm: FormGroup;
  taskForm: FormGroup;
  riskForm: FormGroup;

  private projectId = '';

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.project$ = this.store.select(ProjectsSelectors.selectSelectedProject);
    this.selectedLoading$ = this.store.select(ProjectsSelectors.selectSelectedLoading);
    this.error$ = this.store.select(ProjectsSelectors.selectProjectsError);
    this.milestones$ = this.store.select(ProjectsSelectors.selectMilestones);
    this.milestonesLoading$ = this.store.select(ProjectsSelectors.selectMilestonesLoading);
    this.tasks$ = this.store.select(ProjectsSelectors.selectTasks);
    this.tasksLoading$ = this.store.select(ProjectsSelectors.selectTasksLoading);
    this.risks$ = this.store.select(ProjectsSelectors.selectRisks);
    this.risksLoading$ = this.store.select(ProjectsSelectors.selectRisksLoading);

    this.milestoneForm = this.fb.group({
      title: ['', Validators.required],
      targetDate: ['', Validators.required],
      description: [''],
      notes: ['']
    });

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      priority: ['Medium', Validators.required],
      assignedTo: [''],
      dueDate: [''],
      description: [''],
      notes: ['']
    });

    this.riskForm = this.fb.group({
      title: ['', Validators.required],
      impact: ['', Validators.required],
      probability: ['', Validators.required],
      owner: [''],
      description: [''],
      mitigationPlan: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadData();
  }

  loadData(): void {
    this.store.dispatch(ProjectsActions.loadProject({ id: this.projectId }));
  }

  switchTab(tab: 'milestones' | 'tasks' | 'risks'): void {
    this.activeTab.set(tab);
    if (tab === 'milestones') {
      this.store.dispatch(ProjectsActions.loadMilestones({ projectId: this.projectId }));
    } else if (tab === 'tasks') {
      this.store.dispatch(ProjectsActions.loadTasks({ projectId: this.projectId }));
    } else if (tab === 'risks') {
      this.store.dispatch(ProjectsActions.loadRisks({ projectId: this.projectId }));
    }
  }

  canChangeStatus(status: ProjectStatus): boolean {
    return ['Planning', 'PreConstruction', 'InProgress', 'OnHold'].includes(status);
  }

  availableStatuses(current: ProjectStatus): ProjectStatus[] {
    const transitions: Record<string, ProjectStatus[]> = {
      Planning: ['PreConstruction', 'OnHold', 'Cancelled'],
      PreConstruction: ['InProgress', 'OnHold', 'Cancelled'],
      InProgress: ['OnHold', 'Completed', 'Cancelled'],
      OnHold: ['InProgress', 'Cancelled']
    };
    return transitions[current] ?? [];
  }

  changeStatus(projectId: string, newStatus: ProjectStatus): void {
    this.store.dispatch(ProjectsActions.changeStatus({ id: projectId, newStatus }));
  }

  formatStatus(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }

  submitMilestone(projectId: string): void {
    if (this.milestoneForm.invalid) return;
    const v = this.milestoneForm.value;
    this.store.dispatch(ProjectsActions.createMilestone({
      projectId,
      request: {
        title: v.title,
        targetDate: v.targetDate,
        description: v.description || undefined,
        notes: v.notes || undefined
      }
    }));
    this.milestoneForm.reset();
    this.showMilestoneForm.set(false);
  }

  submitTask(projectId: string): void {
    if (this.taskForm.invalid) return;
    const v = this.taskForm.value;
    this.store.dispatch(ProjectsActions.createTask({
      projectId,
      request: {
        title: v.title,
        priority: v.priority,
        assignedTo: v.assignedTo || undefined,
        dueDate: v.dueDate || undefined,
        description: v.description || undefined,
        notes: v.notes || undefined
      }
    }));
    this.taskForm.reset({ priority: 'Medium' });
    this.showTaskForm.set(false);
  }

  submitRisk(projectId: string): void {
    if (this.riskForm.invalid) return;
    const v = this.riskForm.value;
    this.store.dispatch(ProjectsActions.createRisk({
      projectId,
      request: {
        title: v.title,
        impact: v.impact,
        probability: v.probability,
        owner: v.owner || undefined,
        description: v.description || undefined,
        mitigationPlan: v.mitigationPlan || undefined,
        notes: v.notes || undefined
      }
    }));
    this.riskForm.reset();
    this.showRiskForm.set(false);
  }
}
