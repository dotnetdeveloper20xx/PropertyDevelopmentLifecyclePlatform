import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProjectListItem, ProjectDetail, MilestoneItem, ProjectTaskItem, ProjectRiskItem } from '../../../core/models/project.model';

export const projectAdapter: EntityAdapter<ProjectListItem> = createEntityAdapter<ProjectListItem>({ selectId: (p) => p.id });

export interface ProjectsState extends EntityState<ProjectListItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
  selectedProject: ProjectDetail | null;
  selectedLoading: boolean;
  milestones: MilestoneItem[];
  milestonesLoading: boolean;
  tasks: ProjectTaskItem[];
  tasksLoading: boolean;
  risks: ProjectRiskItem[];
  risksLoading: boolean;
}

export const initialProjectsState: ProjectsState = projectAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0,
  selectedProject: null,
  selectedLoading: false,
  milestones: [],
  milestonesLoading: false,
  tasks: [],
  tasksLoading: false,
  risks: [],
  risksLoading: false
});
