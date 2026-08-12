export type ProductBatchStatus =
  | "draft"
  | "processing"
  | "completed"
  | "partial"
  | "failed";

export interface ProductBatch {
  /**
   * Unique batch ID
   */
  id: string;

  /**
   * Display name of the batch
   * Example:
   * "Banarasi August Collection"
   */
  batchName: string;

  /**
   * Unique/readable batch code
   * Example:
   * "BATCH-001"
   */
  batchCode: string;

  /**
   * Optional batch description
   */
  description: string;

  /**
   * Product category
   */
  category: string;

  /**
   * Product brand
   */
  brand: string;

  /**
   * Total number of products
   * included in this batch
   */
  totalProducts: number;

  /**
   * Number of products
   * successfully completed
   */
  completedProducts: number;

  /**
   * Number of products
   * still waiting for processing
   */
  pendingProducts: number;

  /**
   * Number of products
   * that failed processing
   */
  failedProducts: number;

  /**
   * Product IDs belonging
   * to this batch
   */
  productIds: string[];

  /**
   * Current batch status
   */
  status: ProductBatchStatus;

  /**
   * Batch creation timestamp
   */
  createdAt: string;

  /**
   * Last update timestamp
   */
  updatedAt: string;
}