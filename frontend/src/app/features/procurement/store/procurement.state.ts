import { PurchaseOrderItem, DeliveryItem } from '../../../core/models/procurement.model';

export interface ProcurementState {
  orders: PurchaseOrderItem[];
  ordersLoading: boolean;
  deliveries: DeliveryItem[];
  deliveriesLoading: boolean;
  error: string | null;
}

export const initialProcurementState: ProcurementState = {
  orders: [],
  ordersLoading: false,
  deliveries: [],
  deliveriesLoading: false,
  error: null
};
