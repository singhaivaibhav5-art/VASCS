export interface Product {
  id: string;

  name: string;

  sku: string;

  barcode: string;

  category: string;

  brand: string;

  fabric: string;

  colour: string;

  size: string;

  hsn: string;

  gst: number;

  purchasePrice: number;

  wholesalePrice: number;

  retailPrice: number;

  mrp: number;

  discount: number;

  stock: number;

  // Existing single product image
  image: string;

  // Multiple product images
  // Optional for backward compatibility
  images?: string[];

  createdAt: string;
}