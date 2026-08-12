export type ProductBatch = {
  id: string;
  batchNumber: string;
  batchName: string;
  productIds: string[];
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "vascs_product_batches";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getProductBatches(): ProductBatch[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error(
      "Failed to load product batches:",
      error
    );

    return [];
  }
}

export function saveProductBatch(
  batch: ProductBatch
): void {
  if (!isBrowser()) {
    return;
  }

  const batches = getProductBatches();

  batches.push(batch);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(batches)
  );
}

export function updateProductBatch(
  updatedBatch: ProductBatch
): void {
  if (!isBrowser()) {
    return;
  }

  const batches = getProductBatches();

  const updatedBatches = batches.map(
    (batch) =>
      batch.id === updatedBatch.id
        ? updatedBatch
        : batch
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedBatches)
  );
}

export function deleteProductBatch(
  id: string
): void {
  if (!isBrowser()) {
    return;
  }

  const batches = getProductBatches();

  const remainingBatches = batches.filter(
    (batch) => batch.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(remainingBatches)
  );
}

export function getProductBatchById(
  id: string
): ProductBatch | null {
  const batches = getProductBatches();

  return (
    batches.find(
      (batch) => batch.id === id
    ) ?? null
  );
}

export function generateBatchNumber(): string {
  const timestamp = Date.now();

  return `BATCH-${timestamp}`;
}

export function generateBatchId(): string {
  return (
    `batch-` +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );
}