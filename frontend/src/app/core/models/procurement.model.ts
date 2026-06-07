/**
 * Procurement & Materials models matching backend DTOs.
 */

export type PurchaseOrderStatus = 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'PartiallyDelivered' | 'Delivered' | 'Cancelled';
export type DeliveryStatus = 'Pending' | 'InTransit' | 'Delivered' | 'PartialDelivery' | 'Rejected';

export interface PurchaseOrderItem {
  id: string;
  projectId: string;
  orderReference: string;
  supplierName: string;
  supplierContact: string | null;
  description: string | null;
  status: PurchaseOrderStatus;
  totalValue: number;
  currency: string;
  orderDate: string;
  expectedDeliveryDate: string | null;
  actualDeliveryDate: string | null;
  approvedBy: string | null;
  notes: string | null;
  deliveryCount: number;
  createdAt: string;
}

export interface CreatePurchaseOrderRequest {
  projectId: string;
  orderReference: string;
  supplierName: string;
  supplierContact?: string;
  description?: string;
  totalValue: number;
  currency?: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

export interface DeliveryItem {
  id: string;
  purchaseOrderId: string;
  deliveryReference: string | null;
  status: DeliveryStatus;
  deliveryDate: string | null;
  receivedBy: string | null;
  items: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateDeliveryRequest {
  deliveryReference?: string;
  deliveryDate?: string;
  receivedBy?: string;
  items?: string;
  notes?: string;
}
