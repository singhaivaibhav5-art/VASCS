"use client";

import { useEffect, useState } from "react";

import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricing from "./ProductPricing";
import ProductImages from "./ProductImages";

import { Product } from "@/types/Product";

import {
  saveProductImage,
  deleteProductImage,
} from "@/services/imageStorage";

type ProductFormProps = {
  onSave: (product: Product) => void;
  editingProduct?: Product | null;
  onCancelEdit?: () => void;
};

export default function ProductForm({
  onSave,
  editingProduct = null,
  onCancelEdit,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    brand: "",
    fabric: "",
    colour: "",
    size: "",
    gst: "",
    hsn: "",

    purchasePrice: "",
    wholesalePrice: "",
    retailPrice: "",
    mrp: "",
    discount: "",

    imageFiles: [] as File[],
    imageIds: [] as string[],
  });

  useEffect(() => {
    if (!editingProduct) {
      setFormData({
        name: "",
        sku: "",
        barcode: "",
        category: "",
        brand: "",
        fabric: "",
        colour: "",
        size: "",
        gst: "",
        hsn: "",
        purchasePrice: "",
        wholesalePrice: "",
        retailPrice: "",
        mrp: "",
        discount: "",
        imageFiles: [],
        imageIds: [],
      });

      return;
    }

    setFormData({
      name: editingProduct.name || "",
      sku: editingProduct.sku || "",
      barcode: editingProduct.barcode || "",
      category: editingProduct.category || "",
      brand: editingProduct.brand || "",
      fabric: editingProduct.fabric || "",
      colour: editingProduct.colour || "",
      size: editingProduct.size || "",
      gst:
        editingProduct.gst !== undefined
          ? String(editingProduct.gst)
          : "",
      hsn: editingProduct.hsn || "",

      purchasePrice:
        editingProduct.purchasePrice !== undefined
          ? String(editingProduct.purchasePrice)
          : "",

      wholesalePrice:
        editingProduct.wholesalePrice !== undefined
          ? String(editingProduct.wholesalePrice)
          : "",

      retailPrice:
        editingProduct.retailPrice !== undefined
          ? String(editingProduct.retailPrice)
          : "",

      mrp:
        editingProduct.mrp !== undefined
          ? String(editingProduct.mrp)
          : "",

      discount:
        editingProduct.discount !== undefined
          ? String(editingProduct.discount)
          : "",

      imageFiles: [],

      imageIds:
        editingProduct.images || [],
    });
  }, [editingProduct]);

  function handleChange(
    field: string,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleImagesChange(
    files: File[]
  ) {
    setFormData((previous) => ({
      ...previous,
      imageFiles: files,
    }));
  }

  async function handleRemoveExistingImage(
    imageId: string
  ) {
    try {
      await deleteProductImage(imageId);

      setFormData((previous) => ({
        ...previous,
        imageIds: previous.imageIds.filter(
          (id) => id !== imageId
        ),
      }));
    } catch (error) {
      console.error(
        "Failed to delete product image:",
        error
      );

      alert(
        "Unable to delete image."
      );
    }
  }

  async function handleSave() {
    if (
      !formData.name.trim() ||
      !formData.category.trim()
    ) {
      alert(
        "Please enter Product Name and Category."
      );

      return;
    }

    const productId =
      editingProduct?.id ||
      Date.now().toString();

    let savedImageIds = [
      ...formData.imageIds,
    ];

    try {
      for (const file of formData.imageFiles) {
        const imageId =
          await saveProductImage(
            productId,
            file
          );

        savedImageIds.push(imageId);
      }

      const product: Product = {
        id: productId,

        name: formData.name.trim(),

        sku:
          formData.sku ||
          "AUTO-" + Date.now(),

        barcode:
          formData.barcode ||
          Date.now().toString(),

        category:
          formData.category,

        brand:
          formData.brand,

        fabric:
          formData.fabric,

        colour:
          formData.colour,

        size:
          formData.size,

        hsn:
          formData.hsn,

        gst:
          Number(
            formData.gst.replace("%", "")
          ) || 0,

        purchasePrice:
          Number(
            formData.purchasePrice
          ) || 0,

        wholesalePrice:
          Number(
            formData.wholesalePrice
          ) || 0,

        retailPrice:
          Number(
            formData.retailPrice
          ) || 0,

        mrp:
          Number(
            formData.mrp
          ) || 0,

        discount:
          Number(
            formData.discount
          ) || 0,

        stock:
          editingProduct?.stock || 0,

        image:
          savedImageIds[0] || "",

        images:
          savedImageIds,

        createdAt:
          editingProduct?.createdAt ||
          new Date().toISOString(),
      };

      onSave(product);

      setFormData({
        name: "",
        sku: "",
        barcode: "",
        category: "",
        brand: "",
        fabric: "",
        colour: "",
        size: "",
        gst: "",
        hsn: "",
        purchasePrice: "",
        wholesalePrice: "",
        retailPrice: "",
        mrp: "",
        discount: "",
        imageFiles: [],
        imageIds: [],
      });
    } catch (error) {
      console.error(
        "Product image save failed:",
        error
      );

      alert(
        "Product image save failed. Please try again."
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <ProductBasicInfo
        data={{
          name:
            formData.name,

          sku:
            formData.sku,

          barcode:
            formData.barcode,

          category:
            formData.category,

          brand:
            formData.brand,

          fabric:
            formData.fabric,

          colour:
            formData.colour,

          size:
            formData.size,

          gst:
            formData.gst,

          hsn:
            formData.hsn,
        }}
        onChange={
          handleChange
        }
      />

      <ProductImages
        files={
          formData.imageFiles
        }
        existingImages={
          formData.imageIds
        }
        onChange={
          handleImagesChange
        }
        onRemoveExisting={
          handleRemoveExistingImage
        }
      />

      <ProductPricing
        data={{
          purchasePrice:
            formData.purchasePrice,

          wholesalePrice:
            formData.wholesalePrice,

          retailPrice:
            formData.retailPrice,

          mrp:
            formData.mrp,

          discount:
            formData.discount,
        }}
        onChange={
          handleChange
        }
      />

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={handleSave}
          style={{
            background: "#7A003C",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding:
              "12px 20px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          💾{" "}
          {editingProduct
            ? "Update Product"
            : "Save Product"}
        </button>

        {editingProduct && (
          <button
            type="button"
            onClick={
              onCancelEdit
            }
            style={{
              background:
                "#6B7280",
              color: "#ffffff",
              border: "none",
              borderRadius:
                "8px",
              padding:
                "12px 20px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </div>
  );
}