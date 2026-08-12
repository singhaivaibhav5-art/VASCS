const DB_NAME = "vascs_image_database";
const DB_VERSION = 1;
const STORE_NAME = "product_images";

type StoredImage = {
  id: string;
  productId: string;
  blob: Blob;
  createdAt: string;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(
          STORE_NAME,
          {
            keyPath: "id",
          }
        );

        store.createIndex(
          "productId",
          "productId",
          {
            unique: false,
          }
        );
      }
    };
  });
}

/**
 * Save one product image
 */
export async function saveProductImage(
  productId: string,
  file: Blob
): Promise<string> {
  const db = await openDatabase();

  const imageId =
    productId +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 9);

  const image: StoredImage = {
    id: imageId,
    productId,
    blob: file,
    createdAt:
      new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const transaction =
      db.transaction(
        STORE_NAME,
        "readwrite"
      );

    const store =
      transaction.objectStore(
        STORE_NAME
      );

    const request =
      store.add(image);

    request.onsuccess = () => {
      resolve(imageId);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Get all image IDs for a product
 */
export async function getProductImageIds(
  productId: string
): Promise<string[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction =
      db.transaction(
        STORE_NAME,
        "readonly"
      );

    const store =
      transaction.objectStore(
        STORE_NAME
      );

    const index =
      store.index("productId");

    const request =
      index.getAll(productId);

    request.onsuccess = () => {
      const images =
        request.result as StoredImage[];

      resolve(
        images.map(
          (image) => image.id
        )
      );
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Get one image as browser URL
 */
export async function getProductImageUrl(
  imageId: string
): Promise<string | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction =
      db.transaction(
        STORE_NAME,
        "readonly"
      );

    const store =
      transaction.objectStore(
        STORE_NAME
      );

    const request =
      store.get(imageId);

    request.onsuccess = () => {
      const image =
        request.result as
          | StoredImage
          | undefined;

      if (!image) {
        resolve(null);
        return;
      }

      const url =
        URL.createObjectURL(
          image.blob
        );

      resolve(url);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Delete one image
 */
export async function deleteProductImage(
  imageId: string
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction =
      db.transaction(
        STORE_NAME,
        "readwrite"
      );

    const store =
      transaction.objectStore(
        STORE_NAME
      );

    const request =
      store.delete(imageId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Delete all images belonging to a product
 */
export async function deleteProductImages(
  productId: string
): Promise<void> {
  const imageIds =
    await getProductImageIds(
      productId
    );

  await Promise.all(
    imageIds.map((imageId) =>
      deleteProductImage(
        imageId
      )
    )
  );
}