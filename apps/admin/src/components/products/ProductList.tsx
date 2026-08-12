"use client";

import { Product } from "@/types/Product";

type ProductListProps = {
  products: Product[];

  onDelete: (
    id: string
  ) => void;

  onEdit: (
    product: Product
  ) => void;

  onView?: (
    product: Product
  ) => void;
};

export default function ProductList({
  products,
  onDelete,
  onEdit,
  onView,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div
        style={{
          padding: "50px 20px",
          textAlign: "center",
          border:
            "1px solid #e5e7eb",
          borderRadius: "12px",
          background: "#ffffff",
          color: "#6b7280",
        }}
      >
        <div
          style={{
            fontSize: "45px",
            marginBottom: "10px",
          }}
        >
          📦
        </div>

        <h3
          style={{
            margin: 0,
            color: "#374151",
          }}
        >
          No Products Found
        </h3>

        <p>
          Add a product or change
          your search filters.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "25px",
      }}
    >
      <div
        style={{
          marginBottom: "15px",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        📋 Product Catalogue
      </div>

      <div
        style={{
          overflowX: "auto",
          border:
            "1px solid #e5e7eb",
          borderRadius: "12px",
          background: "#ffffff",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
            minWidth:
              "1100px",
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  "#f9fafb",
              }}
            >
              <Th>
                Product
              </Th>

              <Th>
                SKU
              </Th>

              <Th>
                Barcode
              </Th>

              <Th>
                Category
              </Th>

              <Th>
                Colour
              </Th>

              <Th>
                Wholesale
              </Th>

              <Th>
                MRP
              </Th>

              <Th>
                Stock
              </Th>

              <Th>
                Actions
              </Th>
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product) => (
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
                    style={
                      cellStyle
                    }
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color:
                          "#111827",
                      }}
                    >
                      {product.name ||
                        "-"}
                    </div>

                    <div
                      style={{
                        fontSize:
                          "12px",
                        color:
                          "#6b7280",
                        marginTop:
                          "3px",
                      }}
                    >
                      {product.brand ||
                        "-"}
                    </div>
                  </td>

                  <td
                    style={
                      cellStyle
                    }
                  >
                    {product.sku ||
                      "-"}
                  </td>

                  <td
                    style={
                      cellStyle
                    }
                  >
                    {product.barcode ||
                      "-"}
                  </td>

                  <td
                    style={
                      cellStyle
                    }
                  >
                    {product.category ||
                      "-"}
                  </td>

                  <td
                    style={
                      cellStyle
                    }
                  >
                    {product.colour ||
                      "-"}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      fontWeight: 600,
                    }}
                  >
                    ₹
                    {Number(
                      product.wholesalePrice ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      fontWeight: 700,
                    }}
                  >
                    ₹
                    {Number(
                      product.mrp ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td
                    style={
                      cellStyle
                    }
                  >
                    <span
                      style={{
                        display:
                          "inline-block",
                        padding:
                          "4px 9px",
                        borderRadius:
                          "15px",
                        background:
                          product.stock >
                          0
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          product.stock >
                          0
                            ? "#166534"
                            : "#991b1b",
                        fontSize:
                          "12px",
                        fontWeight: 700,
                      }}
                    >
                      {product.stock ||
                        0}
                    </span>
                  </td>

                  <td
                    style={
                      cellStyle
                    }
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "6px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      {onView && (
                        <button
                          type="button"
                          onClick={() =>
                            onView(
                              product
                            )
                          }
                          style={
                            viewButtonStyle
                          }
                        >
                          👁️ View
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(
                            product
                          )
                        }
                        style={
                          editButtonStyle
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const confirmed =
                            window.confirm(
                              `Delete "${product.name}"?`
                            );

                          if (
                            confirmed
                          ) {
                            onDelete(
                              product.id
                            );
                          }
                        }}
                        style={
                          deleteButtonStyle
                        }
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*
============================================================
TABLE HEADER
============================================================
*/

function Th({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      style={{
        padding:
          "13px 12px",
        textAlign:
          "left",
        fontSize:
          "13px",
        color:
          "#4b5563",
        fontWeight: 700,
        whiteSpace:
          "nowrap",
      }}
    >
      {children}
    </th>
  );
}

/*
============================================================
CELL
============================================================
*/

const cellStyle: React.CSSProperties =
  {
    padding:
      "13px 12px",
    fontSize:
      "13px",
    color:
      "#374151",
    whiteSpace:
      "nowrap",
  };

/*
============================================================
BUTTONS
============================================================
*/

const viewButtonStyle: React.CSSProperties =
  {
    border: "none",
    borderRadius: "7px",
    padding:
      "7px 10px",
    background:
      "#2563eb",
    color:
      "#ffffff",
    cursor:
      "pointer",
    fontSize:
      "12px",
    fontWeight: 600,
  };

const editButtonStyle: React.CSSProperties =
  {
    border: "none",
    borderRadius: "7px",
    padding:
      "7px 10px",
    background:
      "#7A003C",
    color:
      "#ffffff",
    cursor:
      "pointer",
    fontSize:
      "12px",
    fontWeight: 600,
  };

const deleteButtonStyle: React.CSSProperties =
  {
    border: "none",
    borderRadius: "7px",
    padding:
      "7px 10px",
    background:
      "#DC2626",
    color:
      "#ffffff",
    cursor:
      "pointer",
    fontSize:
      "12px",
    fontWeight: 600,
  };