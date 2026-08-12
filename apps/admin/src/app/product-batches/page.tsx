"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Product } from "@/types/Product";

import {
  getProducts,
} from "@/services/productService";

import {
  deleteProductBatch,
  generateBatchId,
  generateBatchNumber,
  getProductBatches,
  saveProductBatch,
  type ProductBatch,
} from "@/services/productBatchService";

type ProductDisplay = Product & {
  name?: string;
  productName?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  brand?: string;
  colour?: string;
  color?: string;
};

export default function ProductBatchesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<ProductBatch[]>([]);

  const [showCreateBatch, setShowCreateBatch] =
    useState(false);

  const [batchName, setBatchName] =
    useState("");

  const [selectedProductIds, setSelectedProductIds] =
    useState<string[]>([]);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  function loadData() {
    setProducts(getProducts());
    setBatches(getProductBatches());
  }

  useEffect(() => {
    loadData();
  }, []);

  const previewBatchNumber = useMemo(
    () => generateBatchNumber(),
    []
  );

  function getDisplayProduct(
    product: Product
  ): ProductDisplay {
    return product as ProductDisplay;
  }

  function getProductName(
    product: Product
  ): string {
    const item = getDisplayProduct(product);

    return (
      item.name ||
      item.productName ||
      "Unnamed Product"
    );
  }

  function getProductSku(
    product: Product
  ): string {
    const item = getDisplayProduct(product);

    return item.sku || "-";
  }

  function getProductBarcode(
    product: Product
  ): string {
    const item = getDisplayProduct(product);

    return item.barcode || "-";
  }

  function getProductCategory(
    product: Product
  ): string {
    const item = getDisplayProduct(product);

    return item.category || "-";
  }

  function getProductColour(
    product: Product
  ): string {
    const item = getDisplayProduct(product);

    return (
      item.colour ||
      item.color ||
      "-"
    );
  }

  function openCreateBatch() {
    setBatchName("");
    setSelectedProductIds([]);
    setError("");
    setShowCreateBatch(true);
  }

  function closeCreateBatch() {
    if (saving) {
      return;
    }

    setShowCreateBatch(false);
    setBatchName("");
    setSelectedProductIds([]);
    setError("");
  }

  function toggleProduct(
    productId: string
  ) {
    setSelectedProductIds(
      (current) => {
        if (current.includes(productId)) {
          return current.filter(
            (id) => id !== productId
          );
        }

        return [
          ...current,
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

  function handleCreateBatch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanName =
      batchName.trim();

    if (!cleanName) {
      setError(
        "Please enter a Batch Name."
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

      const newBatch: ProductBatch = {
        id: generateBatchId(),

        batchNumber:
          generateBatchNumber(),

        batchName:
          cleanName,

        productIds:
          selectedProductIds,

        status:
          "DRAFT",

        createdAt:
          now,

        updatedAt:
          now,
      };

      saveProductBatch(
        newBatch
      );

      setBatches(
        getProductBatches()
      );

      setShowCreateBatch(false);
      setBatchName("");
      setSelectedProductIds([]);
      setError("");

    } catch (err) {
      console.error(
        "Create batch error:",
        err
      );

      setError(
        "Batch create नहीं हो पाया."
      );

    } finally {
      setSaving(false);
    }
  }

  function handleDeleteBatch(
    batch: ProductBatch
  ) {
    const confirmed =
      window.confirm(
        `Delete batch "${batch.batchName}"?`
      );

    if (!confirmed) {
      return;
    }

    deleteProductBatch(
      batch.id
    );

    setBatches(
      getProductBatches()
    );
  }

  function getBatchProductCount(
    batch: ProductBatch
  ) {
    return batch.productIds.length;
  }

  function getStatusStyle(
    status: ProductBatch["status"]
  ) {
    if (status === "ACTIVE") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      status === "COMPLETED"
    ) {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        padding: "24px",
        color: "#111827",
      }}
    >

      {/* PAGE HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            📦 Product Batches
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              fontSize: "16px",
              color: "#64748b",
            }}
          >
            Create and manage product batches
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateBatch}
          style={{
            border: "none",
            borderRadius: "10px",
            background: "#8b0046",
            color: "#ffffff",
            padding: "14px 24px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Create Batch
        </button>
      </div>


      {/* SUMMARY */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "24px",
          marginBottom: "34px",
        }}
      >

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "34px",
            minHeight: "160px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "38px",
              marginBottom: "20px",
            }}
          >
            📦
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#64748b",
              marginBottom: "18px",
            }}
          >
            Total Batches
          </div>

          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            {batches.length}
          </div>
        </div>


        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "34px",
            minHeight: "160px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "38px",
              marginBottom: "20px",
            }}
          >
            🛍️
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#64748b",
              marginBottom: "18px",
            }}
          >
            Total Products
          </div>

          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            {products.length}
          </div>
        </div>

      </div>


      {/* BATCH CATALOGUE */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >

        <div
          style={{
            padding: "28px 34px",
            borderBottom:
              "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 500,
            }}
          >
            📋 Batch Catalogue
          </h2>
        </div>


        {batches.length === 0 ? (

          <div
            style={{
              minHeight: "360px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                marginBottom: "20px",
              }}
            >
              📦
            </div>

            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "28px",
                fontWeight: 500,
              }}
            >
              No Batches Found
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              Create your first product batch
              to start managing products.
            </p>

            <button
              type="button"
              onClick={openCreateBatch}
              style={{
                marginTop: "24px",
                border: "none",
                borderRadius: "9px",
                background: "#8b0046",
                color: "#ffffff",
                padding: "12px 20px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Create First Batch
            </button>
          </div>

        ) : (

          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >

              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                  }}
                >
                  <th style={headerLeft}>
                    Batch
                  </th>

                  <th style={headerLeft}>
                    Batch Number
                  </th>

                  <th style={headerCenter}>
                    Products
                  </th>

                  <th style={headerCenter}>
                    Status
                  </th>

                  <th style={headerLeft}>
                    Created
                  </th>

                  <th style={headerCenter}>
                    Actions
                  </th>
                </tr>
              </thead>


              <tbody>

                {batches.map(
                  (batch) => {

                    const statusStyle =
                      getStatusStyle(
                        batch.status
                      );

                    return (
                      <tr
                        key={batch.id}
                        style={{
                          borderTop:
                            "1px solid #e5e7eb",
                        }}
                      >

                        <td
                          style={{
                            padding: "20px",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "16px",
                            }}
                          >
                            {batch.batchName}
                          </div>
                        </td>


                        <td
                          style={{
                            padding: "20px",
                            color: "#64748b",
                          }}
                        >
                          {batch.batchNumber}
                        </td>


                        <td
                          style={{
                            padding: "20px",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              minWidth: "40px",
                              height: "32px",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "16px",
                              background: "#fce7f3",
                              color: "#8b0046",
                              fontWeight: 700,
                            }}
                          >
                            {getBatchProductCount(
                              batch
                            )}
                          </span>
                        </td>


                        <td
                          style={{
                            padding: "20px",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              padding: "7px 13px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 700,
                              ...statusStyle,
                            }}
                          >
                            {batch.status}
                          </span>
                        </td>


                        <td
                          style={{
                            padding: "20px",
                            color: "#64748b",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(
                            batch.createdAt
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>


                        {/* ACTIONS */}

                        <td
                          style={{
                            padding: "20px",
                            textAlign: "center",
                          }}
                        >

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >

                            {/* REAL BATCH VIEW */}

                            <Link
                              href={`/product-batches/${encodeURIComponent(
                                String(batch.id)
                              )}`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "none",
                                borderRadius: "8px",
                                background: "#2563eb",
                                color: "#ffffff",
                                padding: "9px 15px",
                                cursor: "pointer",
                                fontWeight: 600,
                                textDecoration: "none",
                                fontSize: "14px",
                              }}
                            >
                              👁️ View
                            </Link>


                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteBatch(
                                  batch
                                )
                              }
                              style={{
                                border: "none",
                                borderRadius: "8px",
                                background: "#dc2626",
                                color: "#ffffff",
                                padding: "9px 15px",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              🗑️ Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>


      {/* CREATE BATCH MODAL */}

      {showCreateBatch && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
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

            <div
              style={{
                padding: "22px 24px",
                borderBottom:
                  "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                  📦 Create Product Batch
                </h2>

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  Batch Number:{" "}
                  <strong>
                    {previewBatchNumber}
                  </strong>
                </div>

              </div>


              <button
                type="button"
                onClick={closeCreateBatch}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleCreateBatch}
              style={{
                padding: "24px",
              }}
            >

              <div
                style={{
                  marginBottom: "24px",
                }}
              >

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
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
                    padding: "13px 14px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "9px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                />

              </div>


              <div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    gap: "12px",
                  }}
                >

                  <div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                      }}
                    >
                      Select Products
                    </h3>

                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {
                        selectedProductIds.length
                      }{" "}
                      of{" "}
                      {
                        products.length
                      }{" "}
                      selected
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
                      onClick={
                        selectAllProducts
                      }
                      style={{
                        border:
                          "1px solid #8b0046",
                        background: "#ffffff",
                        color: "#8b0046",
                        borderRadius: "7px",
                        padding: "8px 12px",
                        cursor: "pointer",
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
                          "1px solid #cbd5e1",
                        background: "#ffffff",
                        color: "#475569",
                        borderRadius: "7px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Clear
                    </button>

                  </div>

                </div>


                <div
                  style={{
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >

                  {products.length === 0 ? (

                    <div
                      style={{
                        padding: "35px",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No products available.
                    </div>

                  ) : (

                    products.map(
                      (product, index) => {

                        const selected =
                          selectedProductIds.includes(
                            product.id
                          );

                        return (

                          <label
                            key={product.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                              padding: "14px 16px",
                              cursor: "pointer",
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
                              checked={selected}
                              onChange={() =>
                                toggleProduct(
                                  product.id
                                )
                              }
                              style={{
                                width: "18px",
                                height: "18px",
                                accentColor: "#8b0046",
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
                                  fontSize: "15px",
                                }}
                              >
                                {
                                  getProductName(
                                    product
                                  )
                                }
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "14px",
                                  marginTop: "5px",
                                  fontSize: "12px",
                                  color: "#64748b",
                                }}
                              >

                                <span>
                                  SKU:{" "}
                                  {
                                    getProductSku(
                                      product
                                    )
                                  }
                                </span>

                                <span>
                                  Barcode:{" "}
                                  {
                                    getProductBarcode(
                                      product
                                    )
                                  }
                                </span>

                                <span>
                                  Category:{" "}
                                  {
                                    getProductCategory(
                                      product
                                    )
                                  }
                                </span>

                                <span>
                                  Colour:{" "}
                                  {
                                    getProductColour(
                                      product
                                    )
                                  }
                                </span>

                              </div>

                            </div>

                          </label>
                        );
                      }
                    )
                  )}

                </div>

              </div>


              {error && (

                <div
                  style={{
                    marginTop: "18px",
                    padding: "12px 14px",
                    background: "#fef2f2",
                    border:
                      "1px solid #fecaca",
                    color: "#b91c1c",
                    borderRadius: "8px",
                  }}
                >
                  ⚠️ {error}
                </div>

              )}


              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "18px",
                  borderTop:
                    "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >

                <button
                  type="button"
                  onClick={closeCreateBatch}
                  disabled={saving}
                  style={{
                    padding: "11px 20px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    background: "#ffffff",
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
                    padding: "11px 22px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#8b0046",
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

      )}

    </div>
  );
}


const headerLeft: React.CSSProperties = {
  textAlign: "left",
  padding: "18px 20px",
  fontSize: "14px",
  color: "#475569",
};

const headerCenter: React.CSSProperties = {
  textAlign: "center",
  padding: "18px 20px",
  fontSize: "14px",
  color: "#475569",
};