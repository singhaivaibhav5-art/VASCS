"use client";

import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";

import { Product } from "@/types/Product";

type ProductLabelPreviewProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductLabelPreview({
  product,
  onClose,
}: ProductLabelPreviewProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* ==================================================
          PREVIEW WINDOW
          ================================================== */}

      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "14px",
          padding: "24px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
              }}
            >
              🏷️ Product Label Preview
            </h2>

            <div
              style={{
                marginTop: "5px",
                color: "#666",
                fontSize: "13px",
              }}
            >
              Single Product Sticker
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              border: "none",
              borderRadius: "50%",
              background: "#f3f4f6",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ×
          </button>
        </div>

        {/* ==================================================
            LABEL PREVIEW AREA
            ================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "30px",
            background: "#f3f4f6",
            borderRadius: "12px",
          }}
        >
          {/* ==================================================
              SINGLE LABEL

              Target:
              52.5mm × 30mm

              This is preview only.
              Final A4 sheet will be handled separately.
              ================================================== */}

          <div
            style={{
              width: "52.5mm",
              minHeight: "30mm",
              boxSizing: "border-box",
              background: "#ffffff",
              border: "1px solid #222",
              borderRadius: "2px",
              padding: "2.5mm",
              color: "#111111",
              overflow: "hidden",
              fontFamily:
                "Arial, Helvetica, sans-serif",
            }}
          >
            {/* ==================================================
                PRODUCT NAME
                ================================================== */}

            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "1.5mm",
              }}
              title={product.name}
            >
              {product.name || "PRODUCT NAME"}
            </div>

            {/* ==================================================
                SKU + COLOUR
                ================================================== */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "4px",
                fontSize: "7px",
                lineHeight: 1.1,
                marginBottom: "1mm",
              }}
            >
              <span>
                SKU:{" "}
                <strong>
                  {product.sku || "-"}
                </strong>
              </span>

              <span
                style={{
                  maxWidth: "25mm",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {product.colour || ""}
              </span>
            </div>

            {/* ==================================================
                BARCODE
                ================================================== */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "10mm",
                overflow: "hidden",
                marginBottom: "1mm",
              }}
            >
              <Barcode
                value={
                  product.barcode ||
                  product.sku ||
                  "000000"
                }
                format="CODE128"
                width={1}
                height={25}
                displayValue={true}
                fontSize={7}
                margin={0}
              />
            </div>

            {/* ==================================================
                BOTTOM INFORMATION
                ================================================== */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "2mm",
              }}
            >
              {/* PRICE AREA */}

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: "7px",
                    lineHeight: 1.2,
                  }}
                >
                  MRP
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  ₹
                  {Number(
                    product.mrp || 0
                  ).toLocaleString("en-IN")}
                </div>

                <div
                  style={{
                    marginTop: "1mm",
                    fontSize: "6.5px",
                    lineHeight: 1.1,
                  }}
                >
                  Retail ₹
                  {Number(
                    product.retailPrice || 0
                  ).toLocaleString("en-IN")}
                </div>
              </div>

              {/* QR CODE */}

              <div
                style={{
                  width: "12mm",
                  height: "12mm",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <QRCodeSVG
                  value={JSON.stringify({
                    productId:
                      product.id,
                    name:
                      product.name,
                    sku:
                      product.sku,
                    barcode:
                      product.barcode,
                    category:
                      product.category,
                  })}
                  size={45}
                  level="M"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            PRODUCT SUMMARY
            ================================================== */}

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            Product Label Information
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "8px",
              fontSize: "13px",
              color: "#555",
            }}
          >
            <div>
              <strong>Product:</strong>{" "}
              {product.name || "-"}
            </div>

            <div>
              <strong>SKU:</strong>{" "}
              {product.sku || "-"}
            </div>

            <div>
              <strong>Barcode:</strong>{" "}
              {product.barcode || "-"}
            </div>

            <div>
              <strong>MRP:</strong> ₹
              {Number(
                product.mrp || 0
              ).toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* ==================================================
            ACTIONS
            ================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              border:
                "1px solid #d1d5db",
              background: "#ffffff",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}