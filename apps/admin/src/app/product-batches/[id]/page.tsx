"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Product } from "@/types/Product";
import { getProducts } from "@/services/productService";

type Batch = {
  id: string;
  name: string;
  batchNumber: string;
  status: string;
  createdAt: string;
};

export default function ProductBatchDetailPage() {
  const params = useParams();

  const batchId = Array.isArray(params?.id)
    ? params.id[0]
    : String(params?.id || "");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * Current demo batch information.
   *
   * Products are now loaded from the real
   * vascs_products localStorage database.
   */

  const batch: Batch = {
    id: batchId,
    name: "batch first",
    batchNumber: "BATCH-1786426363090",
    status: "DRAFT",
    createdAt: "11/8/2026, 11:02:43 am",
  };

  useEffect(() => {
    try {
      const savedProducts = getProducts();

      setProducts(savedProducts);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f5f6fa",
          padding: "55px 45px",
          color: "#111827",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            border: "1px solid #e2e5eb",
            padding: "80px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "20px",
            }}
          >
            ⏳
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            Loading Batch...
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "17px",
            }}
          >
            Loading products from Product Master.
          </p>
        </div>
      </main>
    );
  }

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        padding: "55px 45px",
        color: "#111827",
      }}
    >
      {/* ========================================================
          BACK
      ======================================================== */}

      <div
        style={{
          marginBottom: "35px",
        }}
      >
        <Link
          href="/product-batches"
          style={{
            textDecoration: "none",
            color: "#97004d",
            fontSize: "21px",
            fontWeight: 700,
          }}
        >
          ← Back to Product Batches
        </Link>
      </div>

      {/* ========================================================
          HEADER
      ======================================================== */}

      <section
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e5eb",
          padding: "35px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              📦
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: 800,
              }}
            >
              {batch.name}
            </h1>

            <p
              style={{
                marginTop: "12px",
                marginBottom: 0,
                color: "#64748b",
                fontSize: "18px",
              }}
            >
              Product Batch Details
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                background: "#fff0c2",
                color: "#a05a00",
                padding: "10px 20px",
                borderRadius: "30px",
                fontWeight: 800,
              }}
            >
              {batch.status}
            </span>

            <span
              style={{
                background: "#fde7f3",
                color: "#97004d",
                padding: "10px 20px",
                borderRadius: "30px",
                fontWeight: 800,
              }}
            >
              {products.length} Products
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          BATCH INFORMATION
      ======================================================== */}

      <section
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e5eb",
          padding: "35px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            fontSize: "28px",
          }}
        >
          📋 Batch Information
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          <InfoBox
            title="Batch Name"
            value={batch.name}
          />

          <InfoBox
            title="Batch Number"
            value={batch.batchNumber}
          />

          <InfoBox
            title="Products"
            value={String(products.length)}
          />

          <InfoBox
            title="Status"
            value={batch.status}
          />

          <InfoBox
            title="Created"
            value={batch.createdAt}
          />

          <InfoBox
            title="Batch ID"
            value={batch.id}
          />
        </div>
      </section>

      {/* ========================================================
          PRODUCTS
      ======================================================== */}

      <section
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e5eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "30px 35px",
            borderBottom:
              "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "28px",
            }}
          >
            🛍️ Products in this Batch
          </h2>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            All products belonging to this
            product batch
          </p>
        </div>

        {/* ======================================================
            NO PRODUCTS
        ====================================================== */}

        {products.length === 0 ? (
          <div
            style={{
              padding: "70px 30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                marginBottom: "15px",
              }}
            >
              🛍️
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "24px",
              }}
            >
              No Products Found
            </h3>

            <p
              style={{
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              Product Master में अभी कोई product
              saved नहीं है।
            </p>
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
                minWidth: "1250px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    textAlign: "left",
                  }}
                >
                  <th style={thStyle}>
                    Product
                  </th>

                  <th style={thStyle}>
                    SKU
                  </th>

                  <th style={thStyle}>
                    Barcode
                  </th>

                  <th style={thStyle}>
                    Category
                  </th>

                  <th style={thStyle}>
                    Colour
                  </th>

                  <th style={thStyle}>
                    Wholesale
                  </th>

                  <th style={thStyle}>
                    MRP
                  </th>

                  <th style={thStyle}>
                    Stock
                  </th>

                  <th style={thStyle}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(
                  (product) => (
                    <tr key={product.id}>
                      <td style={tdStyle}>
                        <strong
                          style={{
                            color: "#111827",
                          }}
                        >
                          {product.name}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {product.sku}
                      </td>

                      <td style={tdStyle}>
                        {product.barcode}
                      </td>

                      <td style={tdStyle}>
                        {product.category}
                      </td>

                      <td style={tdStyle}>
                        {product.colour}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {formatMoney(
                            product.wholesalePrice
                          )}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {formatMoney(
                            product.mrp
                          )}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            display:
                              "inline-block",
                            background:
                              product.stock > 0
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              product.stock > 0
                                ? "#166534"
                                : "#b91c1c",
                            padding:
                              "7px 14px",
                            borderRadius:
                              "20px",
                            fontWeight: 700,
                          }}
                        >
                          {product.stock ||
                            0}
                        </span>
                      </td>

                      {/* ==================================================
                          IMPORTANT:
                          NOW USING REAL PRODUCT ID
                      ================================================== */}

                      <td style={tdStyle}>
                        <Link
                          href={`/product-batches/${batchId}/${product.id}`}
                          style={{
                            display:
                              "inline-block",
                            textDecoration:
                              "none",
                            background:
                              "#2563eb",
                            color:
                              "#ffffff",
                            padding:
                              "10px 18px",
                            borderRadius:
                              "9px",
                            fontWeight: 700,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          👁️ View
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: "15px",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "19px",
          fontWeight: 700,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}

/* ============================================================
   TABLE HEADER
============================================================ */

const thStyle: React.CSSProperties = {
  padding: "18px 20px",
  color: "#334155",
  fontSize: "15px",
  fontWeight: 800,
  borderBottom:
    "1px solid #e5e7eb",
};

/* ============================================================
   TABLE DATA
============================================================ */

const tdStyle: React.CSSProperties = {
  padding: "20px",
  borderBottom:
    "1px solid #e5e7eb",
  fontSize: "15px",
  color: "#475569",
};