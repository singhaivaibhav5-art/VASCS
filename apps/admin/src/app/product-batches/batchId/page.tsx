"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Product } from "@/types/Product";

import {
  getProducts,
} from "@/services/productService";

import {
  getProductBatches,
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

export default function ProductBatchDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const batchId =
    typeof params?.batchId === "string"
      ? params.batchId
      : "";

  const [batch, setBatch] =
    useState<ProductBatch | null>(null);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
   * ============================================================
   * LOAD BATCH + PRODUCTS
   * ============================================================
   */

  useEffect(() => {
    if (!batchId) {
      setLoading(false);
      return;
    }

    try {
      const allBatches =
        getProductBatches();

      const foundBatch =
        allBatches.find(
          (item) =>
            item.id === batchId
        );

      setBatch(
        foundBatch || null
      );

      const allProducts =
        getProducts();

      setProducts(
        allProducts
      );
    } catch (error) {
      console.error(
        "Failed to load batch:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  /*
   * ============================================================
   * PRODUCT HELPERS
   * ============================================================
   */

  function getDisplayProduct(
    product: Product
  ): ProductDisplay {
    return product as ProductDisplay;
  }

  function getProductName(
    product: Product
  ): string {
    const item =
      getDisplayProduct(product);

    return (
      item.name ||
      item.productName ||
      "Unnamed Product"
    );
  }

  function getProductSku(
    product: Product
  ): string {
    const item =
      getDisplayProduct(product);

    return item.sku || "-";
  }

  function getProductBarcode(
    product: Product
  ): string {
    const item =
      getDisplayProduct(product);

    return item.barcode || "-";
  }

  function getProductCategory(
    product: Product
  ): string {
    const item =
      getDisplayProduct(product);

    return item.category || "-";
  }

  function getProductColour(
    product: Product
  ): string {
    const item =
      getDisplayProduct(product);

    return (
      item.colour ||
      item.color ||
      "-"
    );
  }

  /*
   * ============================================================
   * PRODUCTS INSIDE THIS BATCH
   * ============================================================
   */

  const batchProducts =
    useMemo(() => {
      if (!batch) {
        return [];
      }

      return batch.productIds
        .map((productId) =>
          products.find(
            (product) =>
              product.id ===
              productId
          )
        )
        .filter(
          (
            product
          ): product is Product =>
            Boolean(product)
        );
    }, [
      batch,
      products,
    ]);

  /*
   * ============================================================
   * STATUS STYLE
   * ============================================================
   */

  function getStatusStyle(
    status: ProductBatch["status"]
  ) {
    if (
      status === "ACTIVE"
    ) {
      return {
        background:
          "#dcfce7",
        color:
          "#166534",
      };
    }

    if (
      status === "COMPLETED"
    ) {
      return {
        background:
          "#dbeafe",
        color:
          "#1d4ed8",
      };
    }

    return {
      background:
        "#fef3c7",
      color:
        "#92400e",
    };
  }

  /*
   * ============================================================
   * DATE FORMAT
   * ============================================================
   */

  function formatDate(
    value: string
  ) {
    if (!value) {
      return "-";
    }

    try {
      return new Date(
        value
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return value;
    }
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div
        style={{
          minHeight:
            "100vh",
          background:
            "#f5f6fa",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          fontSize:
            "18px",
          color:
            "#64748b",
        }}
      >
        Loading Batch...
      </div>
    );
  }

  /*
   * ============================================================
   * BATCH NOT FOUND
   * ============================================================
   */

  if (!batch) {
    return (
      <div
        style={{
          minHeight:
            "100vh",
          background:
            "#f5f6fa",
          padding:
            "40px",
        }}
      >
        <div
          style={{
            maxWidth:
              "700px",
            margin:
              "80px auto",
            background:
              "#ffffff",
            borderRadius:
              "16px",
            padding:
              "40px",
            textAlign:
              "center",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontSize:
                "50px",
              marginBottom:
                "15px",
            }}
          >
            📦
          </div>

          <h1
            style={{
              margin:
                "0 0 10px",
              fontSize:
                "28px",
            }}
          >
            Batch Not Found
          </h1>

          <p
            style={{
              color:
                "#64748b",
              marginBottom:
                "25px",
            }}
          >
            The requested
            product batch
            could not be
            found.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/product-batches"
              )
            }
            style={{
              border: "none",
              background:
                "#7A003C",
              color:
                "#ffffff",
              borderRadius:
                "8px",
              padding:
                "12px 22px",
              fontWeight:
                700,
              cursor:
                "pointer",
            }}
          >
            ← Back to
            Product Batches
          </button>
        </div>
      </div>
    );
  }

  const statusStyle =
    getStatusStyle(
      batch.status
    );

  /*
   * ============================================================
   * MAIN UI
   * ============================================================
   */

  return (
    <div
      style={{
        minHeight:
          "100vh",
        background:
          "#f5f6fa",
        padding:
          "24px",
        color:
          "#111827",
      }}
    >
      {/* ========================================================
          HEADER
          ======================================================== */}

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap:
            "20px",
          marginBottom:
            "25px",
          flexWrap:
            "wrap",
        }}
      >
        <div>
          <button
            type="button"
            onClick={() =>
              router.push(
                "/product-batches"
              )
            }
            style={{
              border: "none",
              background:
                "transparent",
              color:
                "#7A003C",
              fontSize:
                "14px",
              fontWeight:
                700,
              cursor:
                "pointer",
              padding:
                "0",
              marginBottom:
                "12px",
            }}
          >
            ← Back to
            Product Batches
          </button>

          <h1
            style={{
              margin: 0,
              fontSize:
                "32px",
              fontWeight:
                800,
            }}
          >
            📦 {batch.batchName}
          </h1>

          <p
            style={{
              margin:
                "8px 0 0",
              color:
                "#64748b",
              fontSize:
                "15px",
            }}
          >
            Batch Details
            &nbsp;•&nbsp;
            {batch.batchNumber}
          </p>
        </div>

        <div
          style={{
            display:
              "flex",
            gap:
              "10px",
            alignItems:
              "center",
          }}
        >
          <span
            style={{
              display:
                "inline-flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              padding:
                "8px 16px",
              borderRadius:
                "20px",
              fontSize:
                "13px",
              fontWeight:
                800,
              ...statusStyle,
            }}
          >
            {batch.status}
          </span>
        </div>
      </div>

      {/* ========================================================
          BATCH SUMMARY
          ======================================================== */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap:
            "16px",
          marginBottom:
            "24px",
        }}
      >
        <SummaryCard
          icon="📦"
          title="Batch Name"
          value={
            batch.batchName
          }
        />

        <SummaryCard
          icon="🔢"
          title="Batch Number"
          value={
            batch.batchNumber
          }
        />

        <SummaryCard
          icon="🛍️"
          title="Products"
          value={String(
            batchProducts.length
          )}
        />

        <SummaryCard
          icon="📅"
          title="Created"
          value={formatDate(
            batch.createdAt
          )}
        />
      </div>

      {/* ========================================================
          PRODUCT SECTION
          ======================================================== */}

      <div
        style={{
          background:
            "#ffffff",
          borderRadius:
            "14px",
          border:
            "1px solid #e5e7eb",
          overflow:
            "hidden",
          boxShadow:
            "0 5px 18px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            padding:
              "20px 22px",
            borderBottom:
              "1px solid #e5e7eb",
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap:
              "15px",
            flexWrap:
              "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize:
                  "21px",
                fontWeight:
                  800,
              }}
            >
              🛍️ Batch Products
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color:
                  "#64748b",
                fontSize:
                  "13px",
              }}
            >
              Products included
              in this batch
            </p>
          </div>

          <div
            style={{
              background:
                "#fce7f3",
              color:
                "#8b0046",
              borderRadius:
                "20px",
              padding:
                "7px 14px",
              fontSize:
                "13px",
              fontWeight:
                800,
            }}
          >
            {
              batchProducts.length
            }{" "}
            Products
          </div>
        </div>

        {batchProducts.length ===
        0 ? (
          <div
            style={{
              padding:
                "50px",
              textAlign:
                "center",
              color:
                "#64748b",
            }}
          >
            <div
              style={{
                fontSize:
                  "45px",
                marginBottom:
                  "10px",
              }}
            >
              📭
            </div>

            <div
              style={{
                fontSize:
                  "17px",
                fontWeight:
                  700,
                marginBottom:
                  "6px",
              }}
            >
              No Products
            </div>

            <div
              style={{
                fontSize:
                  "13px",
              }}
            >
              No valid products
              were found in
              this batch.
            </div>
          </div>
        ) : (
          <div
            style={{
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width:
                  "100%",
                borderCollapse:
                  "collapse",
                minWidth:
                  "850px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#f8fafc",
                  }}
                >
                  <th
                    style={headerStyle}
                  >
                    #
                  </th>

                  <th
                    style={headerStyle}
                  >
                    Product
                  </th>

                  <th
                    style={headerStyle}
                  >
                    SKU
                  </th>

                  <th
                    style={headerStyle}
                  >
                    Barcode
                  </th>

                  <th
                    style={headerStyle}
                  >
                    Category
                  </th>

                  <th
                    style={headerStyle}
                  >
                    Colour
                  </th>

                  <th
                    style={{
                      ...headerStyle,
                      textAlign:
                        "center",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {batchProducts.map(
                  (
                    product,
                    index
                  ) => (
                    <tr
                      key={
                        product.id
                      }
                      style={{
                        borderTop:
                          "1px solid #e5e7eb",
                      }}
                    >
                      <td
                        style={{
                          ...cellStyle,
                          color:
                            "#94a3b8",
                          fontWeight:
                            700,
                        }}
                      >
                        {index + 1}
                      </td>

                      <td
                        style={
                          cellStyle
                        }
                      >
                        <div
                          style={{
                            fontWeight:
                              800,
                            fontSize:
                              "15px",
                          }}
                        >
                          {getProductName(
                            product
                          )}
                        </div>

                        <div
                          style={{
                            marginTop:
                              "4px",
                            fontSize:
                              "12px",
                            color:
                              "#94a3b8",
                          }}
                        >
                          ID:{" "}
                          {
                            product.id
                          }
                        </div>
                      </td>

                      <td
                        style={{
                          ...cellStyle,
                          fontWeight:
                            600,
                        }}
                      >
                        {getProductSku(
                          product
                        )}
                      </td>

                      <td
                        style={
                          cellStyle
                        }
                      >
                        <span
                          style={{
                            fontFamily:
                              "monospace",
                            fontSize:
                              "13px",
                            background:
                              "#f8fafc",
                            padding:
                              "5px 8px",
                            borderRadius:
                              "5px",
                          }}
                        >
                          {getProductBarcode(
                            product
                          )}
                        </span>
                      </td>

                      <td
                        style={
                          cellStyle
                        }
                      >
                        {getProductCategory(
                          product
                        )}
                      </td>

                      <td
                        style={
                          cellStyle
                        }
                      >
                        {getProductColour(
                          product
                        )}
                      </td>

                      <td
                        style={{
                          ...cellStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/product-master?productId=${encodeURIComponent(
                                product.id
                              )}`
                            )
                          }
                          style={{
                            border:
                              "1px solid #7A003C",
                            background:
                              "#ffffff",
                            color:
                              "#7A003C",
                            borderRadius:
                              "7px",
                            padding:
                              "7px 12px",
                            cursor:
                              "pointer",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          View Product
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          NEXT PROCESS
          ======================================================== */}

      <div
        style={{
          marginTop:
            "24px",
          background:
            "#fff7fb",
          border:
            "1px solid #f3c4dc",
          borderRadius:
            "14px",
          padding:
            "22px",
        }}
      >
        <h2
          style={{
            margin:
              "0 0 8px",
            fontSize:
              "20px",
            fontWeight:
              800,
            color:
              "#7A003C",
          }}
        >
          🚀 Batch Processing
        </h2>

        <p
          style={{
            margin:
              "0 0 16px",
            color:
              "#64748b",
            fontSize:
              "14px",
          }}
        >
          This batch is now
          ready for the next
          VASCS processing
          stage.
        </p>

        <div
          style={{
            display:
              "flex",
            gap:
              "10px",
            flexWrap:
              "wrap",
          }}
        >
          <button
            type="button"
            onClick={() =>
              alert(
                "AI Catalogue Generation module will be connected in the next step."
              )
            }
            style={{
              border:
                "none",
              background:
                "#7A003C",
              color:
                "#ffffff",
              borderRadius:
                "8px",
              padding:
                "11px 18px",
              cursor:
                "pointer",
              fontWeight:
                700,
            }}
          >
            🤖 Start AI
            Catalogue
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Batch image processing module will be connected in the next step."
              )
            }
            style={{
              border:
                "1px solid #7A003C",
              background:
                "#ffffff",
              color:
                "#7A003C",
              borderRadius:
                "8px",
              padding:
                "11px 18px",
              cursor:
                "pointer",
              fontWeight:
                700,
            }}
          >
            🖼️ Process Images
          </button>
        </div>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * SUMMARY CARD
 * ============================================================
 */

function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius:
          "12px",
        padding:
          "18px",
        boxShadow:
          "0 3px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div
        style={{
          display:
            "flex",
          alignItems:
            "center",
          gap:
            "10px",
          marginBottom:
            "9px",
        }}
      >
        <span
          style={{
            fontSize:
              "20px",
          }}
        >
          {icon}
        </span>

        <span
          style={{
            color:
              "#64748b",
            fontSize:
              "12px",
            fontWeight:
              700,
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          fontSize:
            "16px",
          fontWeight:
            800,
          color:
            "#111827",
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/*
 * ============================================================
 * TABLE STYLES
 * ============================================================
 */

const headerStyle: React.CSSProperties =
  {
    textAlign:
      "left",
    padding:
      "15px 16px",
    fontSize:
      "12px",
    color:
      "#475569",
    fontWeight:
      800,
    whiteSpace:
      "nowrap",
  };

const cellStyle: React.CSSProperties =
  {
    padding:
      "16px",
    fontSize:
      "13px",
    color:
      "#334155",
    verticalAlign:
      "middle",
  };