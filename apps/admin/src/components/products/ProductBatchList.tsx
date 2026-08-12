"use client";

import { ProductBatch } from "@/types/ProductBatch";

type ProductBatchListProps = {
  batches: ProductBatch[];

  onEdit: (batch: ProductBatch) => void;

  onDelete: (id: string) => void;
};

export default function ProductBatchList({
  batches,
  onEdit,
  onDelete,
}: ProductBatchListProps) {
  function getStatusLabel(
    status: ProductBatch["status"]
  ) {
    switch (status) {
      case "draft":
        return "Draft";

      case "processing":
        return "Processing";

      case "completed":
        return "Completed";

      case "partial":
        return "Partially Completed";

      case "failed":
        return "Failed";

      default:
        return status;
    }
  }

  function getStatusBackground(
    status: ProductBatch["status"]
  ) {
    switch (status) {
      case "draft":
        return "#f3f4f6";

      case "processing":
        return "#fff7ed";

      case "completed":
        return "#ecfdf5";

      case "partial":
        return "#fffbeb";

      case "failed":
        return "#fef2f2";

      default:
        return "#f3f4f6";
    }
  }

  function getStatusColor(
    status: ProductBatch["status"]
  ) {
    switch (status) {
      case "draft":
        return "#374151";

      case "processing":
        return "#c2410c";

      case "completed":
        return "#047857";

      case "partial":
        return "#b45309";

      case "failed":
        return "#b91c1c";

      default:
        return "#374151";
    }
  }

  function calculateProgress(
    batch: ProductBatch
  ) {
    if (batch.totalProducts <= 0) {
      return 0;
    }

    return Math.min(
      Math.round(
        (batch.completedProducts /
          batch.totalProducts) *
          100
      ),
      100
    );
  }

  function handleDelete(
    batch: ProductBatch
  ) {
    const confirmed =
      window.confirm(
        `Delete batch "${batch.batchName}"?`
      );

    if (!confirmed) {
      return;
    }

    onDelete(batch.id);
  }

  if (batches.length === 0) {
    return (
      <div
        style={{
          background: "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "70px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "55px",
            marginBottom: "15px",
          }}
        >
          📦
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: "21px",
            fontWeight: 700,
          }}
        >
          No Product Batches Found
        </h3>

        <p
          style={{
            marginTop: "8px",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Create your first product
          batch to start catalogue
          processing.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          padding: "20px 22px",
          borderBottom:
            "1px solid #e5e7eb",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            📋 Product Batches
          </h2>

          <p
            style={{
              margin:
                "6px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Total Batches:{" "}
            <strong>
              {batches.length}
            </strong>
          </p>
        </div>
      </div>

      {/* BATCH LIST */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {batches.map(
          (batch, index) => {
            const progress =
              calculateProgress(
                batch
              );

            return (
              <div
                key={batch.id}
                style={{
                  padding:
                    "20px 22px",
                  borderBottom:
                    index ===
                    batches.length - 1
                      ? "none"
                      : "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    gap: "20px",
                    flexWrap:
                      "wrap",
                  }}
                >
                  {/* BATCH INFO */}

                  <div
                    style={{
                      flex: 1,
                      minWidth:
                        "280px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "10px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize:
                            "18px",
                          fontWeight:
                            700,
                        }}
                      >
                        {
                          batch.batchName
                        }
                      </h3>

                      <span
                        style={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          padding:
                            "5px 10px",
                          borderRadius:
                            "999px",
                          background:
                            getStatusBackground(
                              batch.status
                            ),
                          color:
                            getStatusColor(
                              batch.status
                            ),
                          fontSize:
                            "12px",
                          fontWeight:
                            700,
                        }}
                      >
                        {getStatusLabel(
                          batch.status
                        )}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop:
                          "7px",
                        color:
                          "#6b7280",
                        fontSize:
                          "13px",
                      }}
                    >
                      Batch Code:{" "}
                      <strong
                        style={{
                          color:
                            "#374151",
                        }}
                      >
                        {
                          batch.batchCode
                        }
                      </strong>
                    </div>

                    {batch.description && (
                      <div
                        style={{
                          marginTop:
                            "8px",
                          color:
                            "#6b7280",
                          fontSize:
                            "13px",
                        }}
                      >
                        {
                          batch.description
                        }
                      </div>
                    )}

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "18px",
                        flexWrap:
                          "wrap",
                        marginTop:
                          "14px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color:
                              "#6b7280",
                            fontSize:
                              "12px",
                          }}
                        >
                          Total
                        </span>

                        <div
                          style={{
                            fontWeight:
                              700,
                            marginTop:
                              "3px",
                          }}
                        >
                          {
                            batch.totalProducts
                          }
                        </div>
                      </div>

                      <div>
                        <span
                          style={{
                            color:
                              "#6b7280",
                            fontSize:
                              "12px",
                          }}
                        >
                          Completed
                        </span>

                        <div
                          style={{
                            fontWeight:
                              700,
                            color:
                              "#047857",
                            marginTop:
                              "3px",
                          }}
                        >
                          {
                            batch.completedProducts
                          }
                        </div>
                      </div>

                      <div>
                        <span
                          style={{
                            color:
                              "#6b7280",
                            fontSize:
                              "12px",
                          }}
                        >
                          Pending
                        </span>

                        <div
                          style={{
                            fontWeight:
                              700,
                            color:
                              "#b45309",
                            marginTop:
                              "3px",
                          }}
                        >
                          {
                            batch.pendingProducts
                          }
                        </div>
                      </div>

                      <div>
                        <span
                          style={{
                            color:
                              "#6b7280",
                            fontSize:
                              "12px",
                          }}
                        >
                          Failed
                        </span>

                        <div
                          style={{
                            fontWeight:
                              700,
                            color:
                              "#b91c1c",
                            marginTop:
                              "3px",
                          }}
                        >
                          {
                            batch.failedProducts
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "8px",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(batch)
                      }
                      style={{
                        background:
                          "#2563eb",
                        color:
                          "#ffffff",
                        border: "none",
                        borderRadius:
                          "8px",
                        padding:
                          "10px 15px",
                        cursor:
                          "pointer",
                        fontWeight:
                          600,
                        fontSize:
                          "14px",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          batch
                        )
                      }
                      style={{
                        background:
                          "#dc2626",
                        color:
                          "#ffffff",
                        border: "none",
                        borderRadius:
                          "8px",
                        padding:
                          "10px 15px",
                        cursor:
                          "pointer",
                        fontWeight:
                          600,
                        fontSize:
                          "14px",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* PROGRESS */}

                <div
                  style={{
                    marginTop:
                      "20px",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom:
                        "7px",
                    }}
                  >
                    <span
                      style={{
                        fontSize:
                          "12px",
                        color:
                          "#6b7280",
                      }}
                    >
                      Processing
                      Progress
                    </span>

                    <strong
                      style={{
                        fontSize:
                          "12px",
                      }}
                    >
                      {progress}%
                    </strong>
                  </div>

                  <div
                    style={{
                      width:
                        "100%",
                      height:
                        "8px",
                      background:
                        "#e5e7eb",
                      borderRadius:
                        "999px",
                      overflow:
                        "hidden",
                    }}
                  >
                    <div
                      style={{
                        width:
                          `${progress}%`,
                        height:
                          "100%",
                        background:
                          "#7A003C",
                        borderRadius:
                          "999px",
                        transition:
                          "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* FOOTER */}

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    gap: "15px",
                    flexWrap:
                      "wrap",
                    marginTop:
                      "12px",
                    fontSize:
                      "11px",
                    color:
                      "#9ca3af",
                  }}
                >
                  <span>
                    Category:{" "}
                    {batch.category ||
                      "—"}
                    {" • "}
                    Brand:{" "}
                    {batch.brand ||
                      "—"}
                  </span>

                  <span>
                    Created:{" "}
                    {new Date(
                      batch.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}