import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { LegalTaskItem, LegalTaskStatus, LegalTaskPriority } from '../../../core/models/legal.model';
import * as LegalActions from '../store/legal.actions';
import * as LegalSelectors from '../store/legal.selectors';

@Component({
  selector: 'app-legal-tasks',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    PageHeaderComponent, PageDescriptionComponent, BreadcrumbComponent,
    LoadingStateComponent, EmptyStateComponent, StatusBadgeComponent,
    ErrorStateComponent, SearchBoxComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Legal & Compliance'}, {label: 'Tasks'}]"></app-breadcrumb>
    <app-page-header title="Legal Tasks" subtitle="Track and manage all legal tasks, actions, and deadlines">
      <button class="btn btn-primary btn-sm" (click)="showCreateForm.set(true)">+ Create Task</button>
    </app-page-header>
    <app-page-description
      description="Legal tasks cover due diligence items, document reviews, signature chasing, compliance checks, and completion actions. Tasks can be linked to contracts or opportunities."
      guidance="Use filters to narrow by status or priority. Change task status directly from the table using the status dropdown."
      helpLink="/help/legal/tasks-overview"
    ></app-page-description>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <app-search-box placeholder="Search tasks by title..."
          (searchChanged)="onSearch($event)"></app-search-box>
      </div>
      <select class="select select-bordered select-sm" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="Open">Open</option>
        <option value="InProgress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <select class="select select-bordered select-sm" [(ngModel)]="priorityFilter" (ngModelChange)="onFilterChange()" aria-label="Filter by priority">
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>
      <div class="text-xs text-base-content/50">
        {{ totalCount$ | async }} total
      </div>
    </div>

    <!-- Inline Create Form -->
    @if (showCreateForm()) {
      <div class="card bg-base-200 border border-base-300 mb-4">
        <div class="card-body">
          <h3 class="font-semibold mb-3">New Legal Task</h3>
          <form [formGroup]="taskForm" (ngSubmit)="createTask()">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <app-form-field label="Title" fieldId="taskTitle" [required]="true"
                [error]="taskForm.get('title')?.touched && taskForm.get('title')?.hasError('required') ? 'Title is required' : undefined">
                <input id="taskTitle" type="text" formControlName="title" class="input input-bordered w-full"
                  [class.input-error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
                  placeholder="e.g., Review draft contract" />
              </app-form-field>

              <app-form-field label="Priority" fieldId="taskPriority" [required]="true">
                <select id="taskPriority" formControlName="priority" class="select select-bordered w-full">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </app-form-field>

              <app-form-field label="Assigned To" fieldId="taskAssignedTo">
                <input id="taskAssignedTo" type="text" formControlName="assignedTo" class="input input-bordered w-full"
                  placeholder="e.g., Sarah Johnson" />
              </app-form-field>

              <app-form-field label="Due Date" fieldId="taskDueDate">
                <input id="taskDueDate" type="date" formControlName="dueDate" class="input input-bordered w-full" />
              </app-form-field>

              <app-form-field label="Description" fieldId="taskDescription">
                <input id="taskDescription" type="text" formControlName="description" class="input input-bordered w-full"
                  placeholder="Brief description (optional)" />
              </app-form-field>
            </div>
            <div class="flex gap-2 mt-4">
              <button type="submit" class="btn btn-primary btn-sm" [disabled]="taskForm.invalid">Create Task</button>
              <button type="button" class="btn btn-ghost btn-sm" (click)="showCreateForm.set(false)">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (loading$ | async) {
      <app-loading-state message="Loading legal tasks..."></app-loading-state>
    } @else if (error$ | async; as error) {
      <app-error-state [message]="error" (retry)="loadTasks()"></app-error-state>
    } @else if ((tasks$ | async)?.length === 0) {
      @if (searchTerm || statusFilter || priorityFilter) {
        <div class="card bg-base-100 border border-base-300 p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold">No Matching Tasks</h3>
          <p class="text-base-content/60 mt-2">No legal tasks match your current search or filter criteria.</p>
          <button class="btn btn-ghost btn-sm mt-4" (click)="clearFilters()">Clear Filters</button>
        </div>
      } @else {
        <app-empty-state
          title="No Legal Tasks Yet"
          message="Create your first legal task to track due diligence items, contract reviews, compliance deadlines, and other legal actions.">
          <button class="btn btn-primary btn-sm" (click)="showCreateForm.set(true)">Create Your First Task</button>
        </app-empty-state>
      }
    } @else {
      <div class="card bg-base-100 shadow-sm border border-base-300">
        <div class="overflow-x-auto">
          <table class="table table-zebra" aria-label="Legal tasks">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (task of filteredTasks(); track task.id) {
                <tr class="hover">
                  <td>
                    <div>
                      <p class="font-medium">{{ task.title }}</p>
                      @if (task.description) {
                        <p class="text-xs text-base-content/50 truncate max-w-[300px]">{{ task.description }}</p>
                      }
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-sm" [ngClass]="getPriorityBadgeClass(task.priority)">{{ task.priority }}</span>
                  </td>
                  <td><app-status-badge [status]="task.status"></app-status-badge></td>
                  <td>{{ task.assignedTo ?? '—' }}</td>
                  <td class="text-xs">
                    @if (task.dueDate) {
                      <span [class.text-error]="isOverdue(task.dueDate, task.status)">{{ task.dueDate | date:'mediumDate' }}</span>
                    } @else {
                      <span class="text-base-content/30">—</span>
                    }
                  </td>
                  <td>
                    <select class="select select-bordered select-xs"
                      [ngModel]="task.status"
                      (ngModelChange)="changeStatus(task.id, $event)"
                      aria-label="Change task status">
                      <option value="Open">Open</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `
})
export class LegalTasksComponent implements OnInit {
  tasks$: Observable<LegalTaskItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;

  searchTerm = '';
  statusFilter: LegalTaskStatus | '' = '';
  priorityFilter: LegalTaskPriority | '' = '';
  showCreateForm = signal(false);

  taskForm: FormGroup;
  private tasksData: LegalTaskItem[] = [];

  constructor(private store: Store, private fb: FormBuilder) {
    this.tasks$ = this.store.select(LegalSelectors.selectTasks);
    this.loading$ = this.store.select(LegalSelectors.selectTasksLoading);
    this.error$ = this.store.select(LegalSelectors.selectLegalError);
    this.totalCount$ = this.store.select(LegalSelectors.selectTasksTotalCount);
    this.tasks$.subscribe(tasks => this.tasksData = tasks);

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      priority: ['Medium', Validators.required],
      assignedTo: [''],
      dueDate: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.store.dispatch(LegalActions.loadTasks({
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined
    }));
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadTasks();
  }

  onFilterChange(): void {
    this.loadTasks();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.loadTasks();
  }

  filteredTasks(): LegalTaskItem[] {
    let result = this.tasksData;
    if (this.priorityFilter) {
      result = result.filter(t => t.priority === this.priorityFilter);
    }
    return result;
  }

  createTask(): void {
    if (this.taskForm.invalid) return;
    const value = this.taskForm.value;
    this.store.dispatch(LegalActions.createTask({
      request: {
        title: value.title,
        priority: value.priority,
        assignedTo: value.assignedTo || undefined,
        dueDate: value.dueDate || undefined,
        description: value.description || undefined
      }
    }));
    this.taskForm.reset({ priority: 'Medium' });
    this.showCreateForm.set(false);
  }

  changeStatus(taskId: string, newStatus: LegalTaskStatus): void {
    this.store.dispatch(LegalActions.changeTaskStatus({ id: taskId, newStatus }));
  }

  getPriorityBadgeClass(priority: LegalTaskPriority): string {
    switch (priority) {
      case 'Low': return 'badge-ghost';
      case 'Medium': return 'badge-info';
      case 'High': return 'badge-warning';
      case 'Urgent': return 'badge-error';
      default: return '';
    }
  }

  isOverdue(dueDate: string, status: LegalTaskStatus): boolean {
    if (status === 'Completed' || status === 'Cancelled') return false;
    return new Date(dueDate) < new Date();
  }
}
