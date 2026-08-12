"use client";

import { useEffect, useState } from "react";

import { Product } from "@/types/Product";
import { ProductBatch } from "@/types/ProductBatch";

type ProductBatchFormProps = {
  products: Product[];

  onSave: (batch: ProductBatch) => void;

  editingBatch?: ProductBatch | null;

  onCancelEdit?: () => void;
};

export default function ProductBatchForm({
  products,
  onSave,
  editingBatch = null,
  onCancelEdit,
}: ProductBatchFormProps) {
  const [batchName, setBatchName] =
    useState("");

  const [batchCode, setBatchCode] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [selectedProductIds, setSelectedProductIds] =
    useState<string[]>([]);

  useEffect(() => {
    if (!editingBatch) {
      setBatchName("");
      setBatchCode("");
      setDescription("");
      setCategory("");
      setBrand("");
      setSelectedProductIds([]);

      return;
    }

    setBatchName(
      editingBatch.batchName || ""
    );

    setBatchCode(
      editingBatch.batchCode || ""
    );

    setDescription(
      editingBatch.description || ""
    );

    setCategory(
      editingBatch.category || ""
    );

    setBrand(
      editingBatch.brand || ""
    );

    setSelectedProductIds(
      editingBatch.productIds || []
    );
  }, [editingBatch]);

  function toggleProduct(
    productId: string
  ) {
    setSelectedProductIds(
      (previous) => {
        if (
          previous.includes(productId)
        ) {
          return previous.filter(
            (id) => id !== productId
          );
        }

        return [
          ...previous,
          productId,
        ];
      }
    );
  }

  function selectAllProducts() {
    setSelectedProductIds(
      products.map(
        (product) => product.id
      )
    );
  }

  function clearSelectedProducts() {
    setSelectedProductIds([]);
  }

  function generateBatchCode() {
    const code =
      "BATCH-" +
      Date.now().toString();

    setBatchCode(code);
  }

  function handleSave() {
    if (!batchName.trim()) {
      alert(
        "Please enter Batch Name."
      );

      return;
    }

    if (!batchCode.trim()) {
      alert(
        "Please enter Batch Code."
      );

      return;
    }

    if (
      selectedProductIds.length === 0
    ) {
      alert(
        "Please select at least one product."
      );

      return;
    }

    const now =
      new Date().toISOString();

    const batchId =
      editingBatch?.id ||
      "batch-" +
        Date.now().toString();

    const totalProducts =
      selectedProductIds.length;

    const completedProducts =
      editingBatch?.completedProducts || 0;

    const failedProducts =
      editingBatch?.failedProducts || 0;

    const pendingProducts =
      Math.max(
        totalProducts -
          completedProducts -
          failedProducts,
        0
      );

    const batch: ProductBatch = {
      id: batchId,

      batchName:
        batchName.trim(),

      batchCode:
        batchCode.trim(),

      description:
        description.trim(),

      category:
        category.trim(),

      brand:
        brand.trim(),

      totalProducts,

      completedProducts,

      pendingProducts,

      failedProducts,

      productIds:
        selectedProductIds,

      status:
        editingBatch?.status ||
        "draft",

      createdAt:
        editingBatch?.createdAt ||
        now,

      updatedAt:
        now,
    };

    onSave(batch);

    if (!editingBatch) {
      setBatchName("");
      setBatchCode("");
      setDescription("");
      setCategory("");
      setBrand("");
      setSelectedProductIds([]);
    }
  }

  return (
    <div
      style={{
        background: "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            📦{" "}
            {editingBatch
              ? "Edit Product Batch"
              : "Create Product Batch"}
          </h2>

          <p
            style={{
              margin:
                "7px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Select products and
            create a batch for
            catalogue processing.
          </p>
        </div>

        <div
          style={{
            background: "#f3f4f6",
            borderRadius: "10px",
            padding:
              "10px 16px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Selected:{" "}
          {selectedProductIds.length}
        </div>
      </div>

      {/* BASIC BATCH INFORMATION */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "7px",
            }}
          >
            Batch Name
          </label>

          <input
            value={batchName}
            onChange={(event) =>
              setBatchName(
                event.target.value
              )
            }
            placeholder="Example: Banarasi August Collection"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding:
                "12px 14px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "7px",
            }}
          >
            Batch Code
          </label>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={batchCode}
              onChange={(event) =>
                setBatchCode(
                  event.target.value
                )
              }
              placeholder="Example: BATCH-001"
              style={{
                flex: 1,
                minWidth: 0,
                padding:
                  "12px 14px",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />

            <button
              type="button"
              onClick={
                generateBatchCode
              }
              style={{
                border: "none",
                borderRadius:
                  "8px",
                padding:
                  "0 14px",
                background:
                  "#f3f4f6",
                cursor:
                  "pointer",
                fontWeight: 600,
                whiteSpace:
                  "nowrap",
              }}
            >
              Auto
            </button>
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "7px",
            }}
          >
            Category
          </label>

          <input
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            placeholder="Example: Banarasi"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding:
                "12px 14px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "7px",
            }}
          >
            Brand
          </label>

          <input
            value={brand}
            onChange={(event) =>
              setBrand(
                event.target.value
              )
            }
            placeholder="Example: Veeransh"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding:
                "12px 14px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            gridColumn:
              "1 / -1",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "7px",
            }}
          >
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Describe this product batch..."
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding:
                "12px 14px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* PRODUCT SELECTION */}

      <div
        style={{
          borderTop:
            "1px solid #e5e7eb",
          paddingTop: "22px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "15px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            🛍️ Select Products
          </h3>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={
                selectAllProducts
              }
              style={{
                border: "none",
                borderRadius:
                  "7px",
                padding:
                  "8px 12px",
                background:
                  "#7A003C",
                color: "#ffffff",
                cursor:
                  "pointer",
                fontWeight: 600,
              }}
            >
              Select All
            </button>

            <button
              type="button"
              onClick={
                clearSelectedProducts
              }
              style={{
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "7px",
                padding:
                  "8px 12px",
                background:
                  "#ffffff",
                cursor:
                  "pointer",
                fontWeight: 600,
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div
            style={{
              padding: "35px 20px",
              textAlign: "center",
              border:
                "1px dashed #d1d5db",
              borderRadius:
                "10px",
              color: "#6b7280",
            }}
          >
            📦 No products available.

            <div
              style={{
                marginTop: "6px",
                fontSize: "13px",
              }}
            >
              Add products in
              Product Master first.
            </div>
          </div>
        ) : (
          <div
            style={{
              maxHeight: "420px",
              overflowY: "auto",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "10px",
            }}
          >
            {products.map(
              (product) => {
                const selected =
                  selectedProductIds.includes(
                    product.id
                  );

                return (
                  <label
                    key={
                      product.id
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "14px",
                      padding:
                        "13px 15px",
                      borderBottom:
                        "1px solid #f0f0f0",
                      background:
                        selected
                          ? "#fff7fb"
                          : "#ffffff",
                      cursor:
                        "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selected
                      }
                      onChange={() =>
                        toggleProduct(
                          product.id
                        )
                      }
                      style={{
                        width:
                          "18px",
                        height:
                          "18px",
                        cursor:
                          "pointer",
                      }}
                    />

                    <div
                      style={{
                        width:
                          "55px",
                        height:
                          "55px",
                        borderRadius:
                          "8px",
                        overflow:
                          "hidden",
                        background:
                          "#f3f4f6",
                        flexShrink: 0,
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                      }}
                    >
                      {product.image ? (
                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover",
                          }}
                        />
                      ) : (
                        <span>
                          📦
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize:
                            "14px",
                          marginBottom:
                            "4px",
                        }}
                      >
                        {
                          product.name
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            "12px",
                          color:
                            "#6b7280",
                        }}
                      >
                        SKU:{" "}
                        {
                          product.sku
                        }
                        {" • "}
                        {
                          product.category
                        }
                        {" • "}
                        {
                          product.colour
                        }
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign:
                          "right",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize:
                            "14px",
                        }}
                      >
                        ₹
                        {product.mrp.toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      <div
                        style={{
                          fontSize:
                            "11px",
                          color:
                            "#6b7280",
                        }}
                      >
                        Stock:{" "}
                        {
                          product.stock
                        }
                      </div>
                    </div>
                  </label>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={handleSave}
          style={{
            background:
              "#7A003C",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding:
              "12px 22px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          💾{" "}
          {editingBatch
            ? "Update Batch"
            : "Create Batch"}
        </button>

        {editingBatch && (
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
                "12px 22px",
              cursor:
                "pointer",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}