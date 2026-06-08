import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DefectItem } from '../../../core/models/defect.model';

export const defectsAdapter: EntityAdapter<DefectItem> =
  createEntityAdapter<DefectItem>({ selectId: (item) => item.id });

export interface DefectsState extends EntityState<DefectItem> {
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export const initialDefectsState: DefectsState = defectsAdapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0
});
