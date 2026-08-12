import { Product } from "@/types/Product";

/* ============================================================
   STORAGE
============================================================ */

const STORAGE_KEY = "vascs_products";

/* ============================================================
   GET ALL PRODUCTS
============================================================ */

export function getProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Product[];
  } catch (error) {
    console.error(
      "Failed to load products:",
      error
    );

    return [];
  }
}

/* ============================================================
   SAVE PRODUCT
============================================================ */

export function saveProduct(
  product: Product
): void {
  try {
    const products = getProducts();

    /*
     Prevent accidental duplicate product ID
    */

    const existingIndex =
      products.findIndex(
        (item) => item.id === product.id
      );

    if (existingIndex !== -1) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products)
    );
  } catch (error) {
    console.error(
      "Failed to save product:",
      error
    );

    throw error;
  }
}

/* ============================================================
   UPDATE PRODUCT
============================================================ */

export function updateProduct(
  updatedProduct: Product
): void {
  try {
    const products = getProducts();

    const updatedProducts =
      products.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );
  } catch (error) {
    console.error(
      "Failed to update product:",
      error
    );

    throw error;
  }
}

/* ============================================================
   DELETE PRODUCT
============================================================ */

export function deleteProduct(
  id: string
): void {
  try {
    const products = getProducts();

    const updatedProducts =
      products.filter(
        (product) => product.id !== id
      );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );
  } catch (error) {
    console.error(
      "Failed to delete product:",
      error
    );

    throw error;
  }
}

/* ============================================================
   GET SINGLE PRODUCT
============================================================ */

export function getProductById(
  id: string
): Product | null {
  const products = getProducts();

  return (
    products.find(
      (product) => product.id === id
    ) || null
  );
}

/* ============================================================
   CLEAR ALL PRODUCTS
   ------------------------------------------------------------
   IMPORTANT:
   This function is intentionally NOT connected to the UI.
   It can be used later by Admin/Data Management.
============================================================ */

export function clearAllProducts(): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([])
    );
  } catch (error) {
    console.error(
      "Failed to clear products:",
      error
    );

    throw error;
  }
}