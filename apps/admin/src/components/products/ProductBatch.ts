export interface ProductBatch {
  id: string;

  batchName: string;

  batchCode: string;

  description: string;

  category: string;

  brand: string;

  totalProducts: number;

  completedProducts: number;

  pendingProducts: number;

  failedProducts: number;

  productIds: string[];

  status:
    | "draft"
    | "processing"
    | "completed"
    | "partial"
    | "failed";

  createdAt: string;

  updatedAt: string;
}