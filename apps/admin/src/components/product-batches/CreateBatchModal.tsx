"use client";

import { useMemo, useState } from "react";

import {
  generateBatchId,
  generateBatchNumber,
  saveProductBatch,
} from "@/services/productBatchService";

type ProductLike = {
  id: string;
  name?: string;
  productName?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  colour?: string;
  color?: string;
};

type CreateBatchModalProps = {
  products: ProductLike[];
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateBatchModal({
  products,
  onClose,
  onCreated,
}: CreateBatchModalProps) {
  const [batchName, setBatchName] =
    useState("");

  const [selectedProductIds, setSelectedProductIds] =
    useState<string[]>([]);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const batchNumber = useMemo(
    () => generateBatchNumber(),
    []
  );

  function getProductName(
    product: ProductLike
  ): string {
    return (
      product.name ||
      product.productName ||
      "Unnamed Product"
    );
  }

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

  function selectAll() {
    setSelectedProductIds(
      products.map(
        (product) => product.id
      )
    );
  }

  function clearAll() {
    setSelectedProductIds([]);
  }

  function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    const trimmedName =
      batchName.trim();

    if (!trimmedName) {
      setError(
        "Please enter a batch name."
      );

      return;
    }

    if (
      selectedProductIds.length === 0
    ) {
      setError(
        "Please select at least one product."
      );

      return;
    }

    setSaving(true);

    try {
      const now =
        new Date().toISOString();

      saveProductBatch({
        id: generateBatchId(),

        batchNumber,

        batchName:
          trimmedName,

        productIds:
          selectedProductIds,

        status: "DRAFT",

        createdAt: now,

        updatedAt: now,
      });

      onCreated();
    } catch (err) {
      console.error(
        "Failed to create batch:",
        err
      );

      setError(
        "Failed to create batch. Please try again."
      );

      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            padding: "22px 24px",
            borderBottom:
              "1px solid #e5e7eb",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              📦 Create Product Batch
            </h2>

            <div
              style={{
                marginTop: "6px",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Batch Number:{" "}
              <strong>
                {batchNumber}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "40px",
              height: "40px",
              border: "none",
              borderRadius: "50%",
              background: "#f3f4f6",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px",
          }}
        >
          {/* BATCH NAME */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Batch Name
            </label>

            <input
              type="text"
              value={batchName}
              onChange={(event) =>
                setBatchName(
                  event.target.value
                )
              }
              placeholder="Example: July 2026 New Saree Collection"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding:
                  "13px 14px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "9px",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* PRODUCT SELECTION */}

          <div>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    fontWeight: 700,
                  }}
                >
                  Select Products
                </h3>

                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  {
                    selectedProductIds.length
                  }{" "}
                  of{" "}
                  {products.length}{" "}
                  products selected
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={selectAll}
                  style={{
                    border:
                      "1px solid #8b0046",
                    background:
                      "#ffffff",
                    color: "#8b0046",
                    borderRadius: "7px",
                    padding:
                      "7px 12px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  style={{
                    border:
                      "1px solid #d1d5db",
                    background:
                      "#ffffff",
                    color: "#374151",
                    borderRadius: "7px",
                    padding:
                      "7px 12px",
                    cursor: "pointer",
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
                  padding: "35px",
                  textAlign: "center",
                  background:
                    "#f9fafb",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "10px",
                  color: "#6b7280",
                }}
              >
                No products available.
              </div>
            ) : (
              <div
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {products.map(
                  (
                    product,
                    index
                  ) => {
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
                            "14px 16px",
                          cursor:
                            "pointer",
                          background:
                            selected
                              ? "#fff7fb"
                              : "#ffffff",
                          borderTop:
                            index === 0
                              ? "none"
                              : "1px solid #eeeeee",
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
                            width: "18px",
                            height: "18px",
                            accentColor:
                              "#8b0046",
                          }}
                        />

                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize:
                                "15px",
                              color:
                                "#111827",
                            }}
                          >
                            {getProductName(
                              product
                            )}
                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              flexWrap:
                                "wrap",
                              gap:
                                "14px",
                              marginTop:
                                "4px",
                              fontSize:
                                "12px",
                              color:
                                "#6b7280",
                            }}
                          >
                            {product.sku && (
                              <span>
                                SKU:{" "}
                                {
                                  product.sku
                                }
                              </span>
                            )}

                            {product.barcode && (
                              <span>
                                Barcode:{" "}
                                {
                                  product.barcode
                                }
                              </span>
                            )}

                            {product.category && (
                              <span>
                                Category:{" "}
                                {
                                  product.category
                                }
                              </span>
                            )}

                            {(product.colour ||
                              product.color) && (
                              <span>
                                Colour:{" "}
                                {
                                  product.colour ||
                                  product.color
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                marginTop: "18px",
                padding: "12px 14px",
                background:
                  "#fef2f2",
                border:
                  "1px solid #fecaca",
                color: "#b91c1c",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* FOOTER */}

          <div
            style={{
              marginTop: "24px",
              paddingTop: "18px",
              borderTop:
                "1px solid #e5e7eb",
              display: "flex",
              justifyContent:
                "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding:
                  "11px 20px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px",
                background:
                  "#ffffff",
                cursor:
                  saving
                    ? "not-allowed"
                    : "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding:
                  "11px 22px",
                border: "none",
                borderRadius: "8px",
                background:
                  "#8b0046",
                color: "#ffffff",
                cursor:
                  saving
                    ? "not-allowed"
                    : "pointer",
                fontWeight: 700,
              }}
            >
              {saving
                ? "Creating..."
                : "📦 Create Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}