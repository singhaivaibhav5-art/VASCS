"use client";

import { useRef, useState } from "react";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";

import { Product } from "@/types/Product";

type ProductLabelPrintProps = {
  product: Product;
  onClose: () => void;
};

/* ============================================================
   SHEET
   ============================================================ */

const SHEET_WIDTH_MM = 210;
const SHEET_HEIGHT_MM = 300;

/* ============================================================
   STICKER
   ============================================================ */

const LABEL_WIDTH_MM = 52.5;
const LABEL_HEIGHT_MM = 30;

/* ============================================================
   ORIGINAL PRINTABLE AREA
   ============================================================ */

const INNER_WIDTH_MM = 49.5;
const INNER_HEIGHT_MM = 28.5;

/* ============================================================
   ORIGINAL INNER POSITION
   ============================================================ */

const INNER_LEFT_MM = 1.5;
const INNER_TOP_MM = 0.75;

/* ============================================================
   3 MM SAFETY GAP
   ============================================================ */

const SAFE_GAP_MM = 3;

/*
   Printable area:
   49.5 × 28.5 mm

   3 mm gap on all sides:

   Width:
   49.5 - 3 - 3 = 43.5 mm

   Height:
   28.5 - 3 - 3 = 22.5 mm
*/

const CONTENT_WIDTH_MM =
  INNER_WIDTH_MM - SAFE_GAP_MM * 2;

const CONTENT_HEIGHT_MM =
  INNER_HEIGHT_MM - SAFE_GAP_MM * 2;

/* ============================================================
   15% SHRINK
   ============================================================ */

const CONTENT_SCALE = 0.85;

/* ============================================================
   CONTENT POSITION

   Printable area starts at:

   left = 1.5 mm
   top  = 0.75 mm

   Then 3 mm safety gap.
   ============================================================ */

const CONTENT_LEFT_MM =
  INNER_LEFT_MM + SAFE_GAP_MM;

const CONTENT_TOP_MM =
  INNER_TOP_MM + SAFE_GAP_MM;

/* ============================================================
   GRID
   ============================================================ */

const COLUMNS = 4;
const ROWS = 10;

const TOTAL_LABELS = COLUMNS * ROWS;

/* ============================================================
   COMPONENT
   ============================================================ */

export default function ProductLabelPrint({
  product,
  onClose,
}: ProductLabelPrintProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const [printing, setPrinting] =
    useState(false);

  const barcodeValue =
    product.barcode ||
    product.sku ||
    "000000";

  const qrData = JSON.stringify({
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    barcode: product.barcode,
    category: product.category,
  });

  /* ==========================================================
     PRINT
     ========================================================== */

  const handlePrint = () => {
    if (printing) return;

    const sheet =
      sheetRef.current;

    if (!sheet) {
      alert(
        "Sticker sheet is not ready."
      );
      return;
    }

    setPrinting(true);

    try {
      const printWindow =
        window.open(
          "",
          "_blank",
          "width=1000,height=1000"
        );

      if (!printWindow) {
        alert(
          "Print window could not open. Please allow pop-ups."
        );

        setPrinting(false);
        return;
      }

      const sheetHTML =
        sheet.innerHTML;

      printWindow.document.open();

      printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8" />

<title>
Veeransh Sarees - Sticker Print
</title>

<style>

@page {
  size: 210mm 300mm;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 210mm;
  height: 300mm;
  background: #ffffff;
}

body {
  font-family:
    Arial,
    Helvetica,
    sans-serif;
}

.print-sheet {

  width: 210mm;
  height: 300mm;

  margin: 0;
  padding: 0;

  display: grid;

  grid-template-columns:
    repeat(4, 52.5mm);

  grid-template-rows:
    repeat(10, 30mm);

  column-gap: 0;
  row-gap: 0;

  overflow: hidden;

  page-break-after: avoid;
  break-after: avoid;

}

.print-label {

  width: 52.5mm;
  height: 30mm;

  min-width: 52.5mm;
  min-height: 30mm;

  max-width: 52.5mm;
  max-height: 30mm;

  margin: 0;
  padding: 0;

  position: relative;

  overflow: hidden;

  page-break-inside: avoid;
  break-inside: avoid;
}

.sticker-inner {

  position: absolute;

  left: 4.5mm;
  top: 3.75mm;

  width: 43.5mm;
  height: 22.5mm;

  overflow: hidden;

  box-sizing: border-box;

  display: flex;

  flex-direction: column;

  justify-content: flex-start;

}

.content-scaled {

  width: 43.5mm;
  height: 22.5mm;

  transform:
    scale(0.85);

  transform-origin:
    top left;

  overflow: hidden;

}

/* =========================================================
   BRAND
   ========================================================= */

.label-brand {

  width: 43.5mm;

  height: 2.6mm;
  min-height: 2.6mm;

  text-align: center;

  font-size: 6.1px;

  font-weight: 700;

  line-height: 2.6mm;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  margin: 0;
  padding: 0;

}

/* =========================================================
   PRODUCT NAME
   ========================================================= */

.label-name {

  width: 43.5mm;

  height: 2.6mm;
  min-height: 2.6mm;

  text-align: center;

  font-size: 5.8px;

  font-weight: 600;

  line-height: 2.6mm;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  margin: 0;
  padding: 0;

}

/* =========================================================
   SKU + COLOUR
   ========================================================= */

.label-meta {

  width: 43.5mm;

  height: 2.3mm;
  min-height: 2.3mm;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 1mm;

  overflow: hidden;

  font-size: 4.4px;

  line-height: 2.3mm;

  margin: 0;
  padding: 0;

}

.label-sku {

  flex: 1;

  min-width: 0;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

}

.label-colour {

  max-width: 13mm;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

  text-align: right;

}

/* =========================================================
   BARCODE
   ========================================================= */

.label-barcode {

  width: 43.5mm;

  height: 6.3mm;
  min-height: 6.3mm;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  margin: 0;
  padding: 0;

}

.label-barcode svg {

  display: block;

  max-width: 39mm;

  height: 5.5mm;

}

/* =========================================================
   BARCODE NUMBER
   ========================================================= */

.label-barcode-number {

  width: 43.5mm;

  height: 1.8mm;
  min-height: 1.8mm;

  text-align: center;

  font-size: 4.2px;

  line-height: 1.8mm;

  white-space: nowrap;

  overflow: hidden;

  margin: 0;
  padding: 0;

}

/* =========================================================
   BOTTOM
   ========================================================= */

.label-bottom {

  width: 43.5mm;

  height: 6.4mm;
  min-height: 6.4mm;

  display: flex;

  align-items: flex-end;

  justify-content:
    space-between;

  gap: 1mm;

  overflow: hidden;

  margin: 0;
  padding: 0;

}

/* =========================================================
   PRICE
   ========================================================= */

.label-price {

  flex: 1;

  min-width: 0;

  height: 6.4mm;

  display: flex;

  flex-direction: column;

  justify-content:
    flex-end;

  overflow: hidden;

  margin: 0;
  padding: 0;

}

.label-mrp-title {

  height: 1.4mm;

  font-size: 4.4px;

  font-weight: 700;

  line-height: 1.4mm;

  margin: 0;
  padding: 0;

}

.label-mrp {

  height: 2.5mm;

  font-size: 8.5px;

  font-weight: 700;

  line-height: 2.5mm;

  white-space: nowrap;

  margin: 0;
  padding: 0;

}

.label-wholesale {

  height: 2.1mm;

  font-size: 6.8px;

  font-weight: 700;

  line-height: 2.1mm;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  margin: 0;
  padding: 0;

}

/* =========================================================
   QR
   ========================================================= */

.label-qr {

  width: 6.8mm;
  height: 6.8mm;

  min-width: 6.8mm;
  min-height: 6.8mm;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  margin: 0;
  padding: 0;

}

.label-qr svg {

  width: 6.8mm;
  height: 6.8mm;

  display: block;

}

</style>

</head>

<body>

<div class="print-sheet">

${sheetHTML}

</div>

<script>

window.onload = function () {

  setTimeout(function () {

    window.focus();

    window.print();

  }, 500);

};

window.onafterprint = function () {

  setTimeout(function () {

    window.close();

  }, 300);

};

</script>

</body>
</html>
      `);

      printWindow.document.close();

      setTimeout(() => {
        setPrinting(false);
      }, 3000);

    } catch (error) {

      console.error(
        "Sticker print error:",
        error
      );

      setPrinting(false);

      alert(
        "Unable to prepare sticker print."
      );
    }
  };

  /* ==========================================================
     SCREEN
     ========================================================== */

  return (
    <>
      <div
        className="label-modal-overlay"
      >
        <div
          className="label-modal"
        >

          {/* HEADER */}

          <div
            className="label-header"
          >

            <div>

              <h2>
                🖨️ Sticker Print Preview
              </h2>

              <div
                className="label-subtitle"
              >
                Sheet: 210 × 300 mm
                {" • "}
                4 Columns × 10 Rows
                {" • "}
                40 Labels
              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={printing}
              className="close-button"
            >
              ×
            </button>

          </div>

          {/* CONTROLS */}

          <div
            className="label-controls"
          >

            <button
              type="button"
              onClick={handlePrint}
              disabled={printing}
              className="print-button"
            >
              {printing
                ? "Preparing Print..."
                : "🖨️ Print 40 Labels"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={printing}
              className="cancel-button"
            >
              Close
            </button>

          </div>

          {/* PRODUCT INFO */}

          <div
            className="product-info"
          >

            <strong>
              Product:
            </strong>{" "}
            {product.name || "-"}

            {"  |  "}

            <strong>
              SKU:
            </strong>{" "}
            {product.sku || "-"}

            {"  |  "}

            <strong>
              Barcode:
            </strong>{" "}
            {barcodeValue}

          </div>

          {/* PREVIEW */}

          <div
            className="preview-container"
          >

            <div
              ref={sheetRef}
              className="preview-sheet"
            >

              {Array.from({
                length:
                  TOTAL_LABELS,
              }).map(
                (_, index) => (
                  <ProductSticker
                    key={index}
                    product={product}
                    qrData={qrData}
                    barcodeValue={
                      barcodeValue
                    }
                    index={index}
                  />
                )
              )}

            </div>

          </div>

        </div>
      </div>

      <style jsx>{`

        .label-modal-overlay {

          position: fixed;

          inset: 0;

          z-index: 99999;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 20px;

          background:
            rgba(
              0,
              0,
              0,
              0.60
            );

        }

        .label-modal {

          width: 100%;

          max-width: 1100px;

          max-height: 94vh;

          overflow: auto;

          padding: 24px;

          background:
            #ffffff;

          border-radius: 14px;

          box-shadow:
            0 20px 60px
            rgba(
              0,
              0,
              0,
              0.30
            );

        }

        .label-header {

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 15px;

          margin-bottom: 18px;

        }

        .label-header h2 {

          margin: 0;

          font-size: 24px;

          font-weight: 700;

        }

        .label-subtitle {

          margin-top: 6px;

          font-size: 13px;

          color: #666666;

        }

        .close-button {

          width: 38px;

          height: 38px;

          border: none;

          border-radius: 50%;

          background:
            #f3f4f6;

          color:
            #333333;

          font-size: 22px;

          cursor: pointer;

        }

        .label-controls {

          display: flex;

          align-items: center;

          justify-content:
            center;

          gap: 10px;

          margin-bottom: 18px;

        }

        .print-button {

          padding:
            12px 24px;

          border: none;

          border-radius: 8px;

          background:
            #059669;

          color:
            #ffffff;

          font-size: 15px;

          font-weight: 700;

          cursor: pointer;

        }

        .print-button:disabled {

          opacity: 0.6;

          cursor: wait;

        }

        .cancel-button {

          padding:
            12px 24px;

          border:
            1px solid #d1d5db;

          border-radius: 8px;

          background:
            #ffffff;

          color:
            #333333;

          font-size: 15px;

          font-weight: 600;

          cursor: pointer;

        }

        .product-info {

          margin-bottom: 18px;

          padding:
            12px 15px;

          border-radius: 8px;

          background:
            #f9fafb;

          color:
            #555555;

          font-size: 13px;

        }

        .preview-container {

          width: 100%;

          overflow: auto;

          padding: 25px;

          border-radius: 10px;

          background:
            #e5e7eb;

        }

        .preview-sheet {

          width: 210mm;

          height: 300mm;

          min-width: 210mm;

          min-height: 300mm;

          max-width: 210mm;

          max-height: 300mm;

          margin: 0 auto;

          padding: 0;

          background:
            #ffffff;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              52.5mm
            );

          grid-template-rows:
            repeat(
              10,
              30mm
            );

          column-gap: 0;

          row-gap: 0;

          overflow: hidden;

          box-sizing: border-box;

        }

        .preview-sheet
        .print-label {

          width: 52.5mm;

          height: 30mm;

          min-width: 52.5mm;

          min-height: 30mm;

          max-width: 52.5mm;

          max-height: 30mm;

          margin: 0;

          padding: 0;

          box-sizing: border-box;

          overflow: hidden;

          background:
            #ffffff;

          position: relative;

        }

      `}</style>
    </>
  );
}

/* ============================================================
   PRODUCT STICKER
   ============================================================ */

function ProductSticker({
  product,
  qrData,
  barcodeValue,
  index,
}: {
  product: Product;
  qrData: string;
  barcodeValue: string;
  index: number;
}) {

  return (
    <div
      className="print-label"
      data-label-number={
        index + 1
      }
      style={{
        width:
          `${LABEL_WIDTH_MM}mm`,

        height:
          `${LABEL_HEIGHT_MM}mm`,

        position:
          "relative",

        overflow:
          "hidden",

        background:
          "#ffffff",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        color:
          "#111111",

        boxSizing:
          "border-box",
      }}
    >

      {/* ==================================================
          3 MM GAP AREA
          ================================================== */}

      <div
        className="sticker-inner"
        style={{
          position:
            "absolute",

          left:
            `${CONTENT_LEFT_MM}mm`,

          top:
            `${CONTENT_TOP_MM}mm`,

          width:
            `${CONTENT_WIDTH_MM}mm`,

          height:
            `${CONTENT_HEIGHT_MM}mm`,

          overflow:
            "hidden",

          boxSizing:
            "border-box",
        }}
      >

        {/* ==================================================
            15% SHRUNK CONTENT
            ================================================== */}

        <div
          className="content-scaled"
          style={{
            width:
              `${CONTENT_WIDTH_MM}mm`,

            height:
              `${CONTENT_HEIGHT_MM}mm`,

            transform:
              `scale(${CONTENT_SCALE})`,

            transformOrigin:
              "top left",

            overflow:
              "hidden",

            display:
              "flex",

            flexDirection:
              "column",

            boxSizing:
              "border-box",
          }}
        >

          {/* BRAND */}

          <div
            className="label-brand"
            style={{
              width:
                "43.5mm",

              height:
                "2.6mm",

              minHeight:
                "2.6mm",

              textAlign:
                "center",

              fontSize:
                "6.1px",

              fontWeight:
                700,

              lineHeight:
                "2.6mm",

              whiteSpace:
                "nowrap",

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              margin: 0,

              padding: 0,
            }}
          >
            VEERANSH SAREES
          </div>

          {/* PRODUCT NAME */}

          <div
            className="label-name"
            title={
              product.name ||
              ""
            }
            style={{
              width:
                "43.5mm",

              height:
                "2.6mm",

              minHeight:
                "2.6mm",

              textAlign:
                "center",

              fontSize:
                "5.8px",

              fontWeight:
                600,

              lineHeight:
                "2.6mm",

              whiteSpace:
                "nowrap",

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              margin: 0,

              padding: 0,
            }}
          >
            {product.name ||
              "PRODUCT NAME"}
          </div>

          {/* SKU + COLOUR */}

          <div
            className="label-meta"
            style={{
              width:
                "43.5mm",

              height:
                "2.3mm",

              minHeight:
                "2.3mm",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                "1mm",

              overflow:
                "hidden",

              fontSize:
                "4.4px",

              lineHeight:
                "2.3mm",

              margin: 0,

              padding: 0,
            }}
          >

            <span
              className="label-sku"
              title={
                product.sku ||
                ""
              }
              style={{
                flex: 1,

                minWidth: 0,

                overflow:
                  "hidden",

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",
              }}
            >
              SKU:{" "}
              <strong>
                {product.sku ||
                  "-"}
              </strong>
            </span>

            <span
              className="label-colour"
              title={
                product.colour ||
                ""
              }
              style={{
                maxWidth:
                  "13mm",

                overflow:
                  "hidden",

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",

                textAlign:
                  "right",
              }}
            >
              {product.colour ||
                ""}
            </span>

          </div>

          {/* BARCODE */}

          <div
            className="label-barcode"
            style={{
              width:
                "43.5mm",

              height:
                "6.3mm",

              minHeight:
                "6.3mm",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              overflow:
                "hidden",

              margin: 0,

              padding: 0,
            }}
          >

            <Barcode
              value={
                barcodeValue
              }
              format="CODE128"
              width={0.62}
              height={19}
              displayValue={false}
              margin={0}
            />

          </div>

          {/* BARCODE NUMBER */}

          <div
            className=
              "label-barcode-number"
            style={{
              width:
                "43.5mm",

              height:
                "1.8mm",

              minHeight:
                "1.8mm",

              textAlign:
                "center",

              fontSize:
                "4.2px",

              lineHeight:
                "1.8mm",

              whiteSpace:
                "nowrap",

              overflow:
                "hidden",

              margin: 0,

              padding: 0,
            }}
          >
            {barcodeValue}
          </div>

          {/* BOTTOM */}

          <div
            className=
              "label-bottom"
            style={{
              width:
                "43.5mm",

              height:
                "6.4mm",

              minHeight:
                "6.4mm",

              display:
                "flex",

              alignItems:
                "flex-end",

              justifyContent:
                "space-between",

              gap:
                "1mm",

              overflow:
                "hidden",

              margin: 0,

              padding: 0,
            }}
          >

            {/* PRICE */}

            <div
              className=
                "label-price"
              style={{
                flex: 1,

                minWidth: 0,

                height:
                  "6.4mm",

                display:
                  "flex",

                flexDirection:
                  "column",

                justifyContent:
                  "flex-end",

                overflow:
                  "hidden",

                margin: 0,

                padding: 0,
              }}
            >

              {/* MRP LABEL */}

              <div
                className=
                  "label-mrp-title"
                style={{
                  height:
                    "1.4mm",

                  fontSize:
                    "4.4px",

                  fontWeight:
                    700,

                  lineHeight:
                    "1.4mm",

                  margin: 0,

                  padding: 0,
                }}
              >
                MRP
              </div>

              {/* MRP */}

              <div
                className=
                  "label-mrp"
                style={{
                  height:
                    "2.5mm",

                  fontSize:
                    "8.5px",

                  fontWeight:
                    700,

                  lineHeight:
                    "2.5mm",

                  whiteSpace:
                    "nowrap",

                  margin: 0,

                  padding: 0,
                }}
              >
                ₹
                {Number(
                  product.mrp ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}
              </div>

              {/* WHOLESALE */}

              <div
                className=
                  "label-wholesale"
                style={{
                  height:
                    "2.1mm",

                  fontSize:
                    "6.8px",

                  fontWeight:
                    700,

                  lineHeight:
                    "2.1mm",

                  whiteSpace:
                    "nowrap",

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  margin: 0,

                  padding: 0,
                }}
              >
                Wholesale Rs.{" "}
                {Number(
                  product.wholesalePrice ??
                    product.retailPrice ??
                    0
                ).toLocaleString(
                  "en-IN"
                )}
              </div>

            </div>

            {/* QR */}

            <div
              className=
                "label-qr"
              style={{
                width:
                  "6.8mm",

                height:
                  "6.8mm",

                minWidth:
                  "6.8mm",

                minHeight:
                  "6.8mm",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                overflow:
                  "hidden",

                margin: 0,

                padding: 0,
              }}
            >

              <QRCodeSVG
                value={
                  qrData
                }
                size={30}
                level="M"
                includeMargin={
                  false
                }
                style={{
                  width:
                    "6.8mm",

                  height:
                    "6.8mm",

                  display:
                    "block",
                }}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}