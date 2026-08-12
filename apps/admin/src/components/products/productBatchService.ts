import { ProductBatch } from "@/types/ProductBatch";

const STORAGE_KEY = "vascs_product_batches";

/**
 * Get all product batches
 */
export function getProductBatches(): ProductBatch[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const batches = JSON.parse(data);

    if (!Array.isArray(batches)) {
      return [];
    }

    return batches as ProductBatch[];
  } catch (error) {
    console.error(
      "Failed to load product batches:",
      error
    );

    return [];
  }
}

/**
 * Get one product batch by ID
 */
export function getProductBatch(
  id: string
): ProductBatch | null {
  const batches = getProductBatches();

  return (
    batches.find(
      (batch) => batch.id === id
    ) || null
  );
}

/**
 * Save a new product batch
 */
export function saveProductBatch(
  batch: ProductBatch
): void {
  const batches = getProductBatches();

  batches.push(batch);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(batches)
  );
}

/**
 * Update an existing product batch
 */
export function updateProductBatch(
  updatedBatch: ProductBatch
): void {
  const batches = getProductBatches();

  const updatedBatches =
    batches.map((batch) =>
      batch.id === updatedBatch.id
        ? updatedBatch
        : batch
    );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedBatches)
  );
}

/**
 * Delete one product batch
 */
export function deleteProductBatch(
  id: string
): void {
  const batches = getProductBatches();

  const remainingBatches =
    batches.filter(
      (batch) => batch.id !== id
    );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(remainingBatches)
  );
}

/**
 * Add products to an existing batch
 */
export function addProductsToBatch(
  batchId: string,
  productIds: string[]
): ProductBatch | null {
  const batch =
    getProductBatch(batchId);

  if (!batch) {
    return null;
  }

  const mergedProductIds = Array.from(
    new Set([
      ...batch.productIds,
      ...productIds,
    ])
  );

  const updatedBatch: ProductBatch = {
    ...batch,

    productIds:
      mergedProductIds,

    totalProducts:
      mergedProductIds.length,

    pendingProducts:
      Math.max(
        mergedProductIds.length -
          batch.completedProducts -
          batch.failedProducts,
        0
      ),

    updatedAt:
      new Date().toISOString(),
  };

  updateProductBatch(updatedBatch);

  return updatedBatch;
}

/**
 * Remove products from a batch
 */
export function removeProductsFromBatch(
  batchId: string,
  productIds: string[]
): ProductBatch | null {
  const batch =
    getProductBatch(batchId);

  if (!batch) {
    return null;
  }

  const removeIds =
    new Set(productIds);

  const remainingProductIds =
    batch.productIds.filter(
      (id) => !removeIds.has(id)
    );

  const updatedBatch: ProductBatch = {
    ...batch,

    productIds:
      remainingProductIds,

    totalProducts:
      remainingProductIds.length,

    pendingProducts:
      Math.max(
        remainingProductIds.length -
          batch.completedProducts -
          batch.failedProducts,
        0
      ),

    updatedAt:
      new Date().toISOString(),
  };

  updateProductBatch(updatedBatch);

  return updatedBatch;
}

/**
 * Mark one product as completed
 */
export function markBatchProductCompleted(
  batchId: string
): ProductBatch | null {
  const batch =
    getProductBatch(batchId);

  if (!batch) {
    return null;
  }

  const completedProducts =
    Math.min(
      batch.completedProducts + 1,
      batch.totalProducts
    );

  const pendingProducts =
    Math.max(
      batch.totalProducts -
        completedProducts -
        batch.failedProducts,
      0
    );

  const status =
    completedProducts ===
    batch.totalProducts
      ? "completed"
      : "processing";

  const updatedBatch: ProductBatch = {
    ...batch,

    completedProducts,

    pendingProducts,

    status,

    updatedAt:
      new Date().toISOString(),
  };

  updateProductBatch(updatedBatch);

  return updatedBatch;
}

/**
 * Mark one product as failed
 */
export function markBatchProductFailed(
  batchId: string
): ProductBatch | null {
  const batch =
    getProductBatch(batchId);

  if (!batch) {
    return null;
  }

  const failedProducts =
    Math.min(
      batch.failedProducts + 1,
      batch.totalProducts
    );

  const pendingProducts =
    Math.max(
      batch.totalProducts -
        batch.completedProducts -
        failedProducts,
      0
    );

  let status:
    | "draft"
    | "processing"
    | "completed"
    | "partial"
    | "failed";

  if (
    failedProducts ===
      batch.totalProducts
  ) {
    status = "failed";
  } else if (
    pendingProducts === 0 &&
    failedProducts > 0
  ) {
    status = "partial";
  } else {
    status = "processing";
  }

  const updatedBatch: ProductBatch = {
    ...batch,

    failedProducts,

    pendingProducts,

    status,

    updatedAt:
      new Date().toISOString(),
  };

  updateProductBatch(updatedBatch);

  return updatedBatch;
}

/**
 * Reset batch processing progress
 */
export function resetBatchProgress(
  batchId: string
): ProductBatch | null {
  const batch =
    getProductBatch(batchId);

  if (!batch) {
    return null;
  }

  const updatedBatch: ProductBatch = {
    ...batch,

    completedProducts: 0,

    pendingProducts:
      batch.totalProducts,

    failedProducts: 0,

    status: "draft",

    updatedAt:
      new Date().toISOString(),
  };

  updateProductBatch(updatedBatch);

  return updatedBatch;
}

/**
 * Delete all product batches
 */
export function clearProductBatches(): void {
  localStorage.removeItem(
    STORAGE_KEY
  );
}