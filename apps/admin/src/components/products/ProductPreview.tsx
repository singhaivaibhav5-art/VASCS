"use client";

import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";

import { Product } from "@/types/Product";
import { getProductImageUrl } from "@/services/imageStorage";

import ProductLabelPreview from "./ProductLabelPreview";
import ProductLabelPrint from "./ProductLabelPrint";

/* ============================================================
   PROPS
   ============================================================ */

type ProductPreviewProps = {
  product: Product;
  onClose: () => void;
  onEdit?: (product: Product) => void;
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function ProductPreview({
  product,
  onClose,
  onEdit,
}: ProductPreviewProps) {

  const [imageUrls, setImageUrls] =
    useState<string[]>([]);

  const [activeImage, setActiveImage] =
    useState(0);

  const [zoomImage, setZoomImage] =
    useState<string | null>(null);

  const [showLabelPreview, setShowLabelPreview] =
    useState(false);

  const [showLabelPrint, setShowLabelPrint] =
    useState(false);

  /* ==========================================================
     LOAD PRODUCT IMAGES
     ========================================================== */

  useEffect(() => {

    let cancelled = false;

    let loadedUrls: string[] = [];

    async function loadImages() {

      const imageIds =
        product.images ?? [];

      const urls: string[] = [];

      for (const imageId of imageIds) {

        try {

          const url =
            await getProductImageUrl(imageId);

          if (url) {
            urls.push(url);
          }

        } catch (error) {

          console.error(
            "Failed to load product image:",
            error
          );

        }

      }

      if (cancelled) {

        urls.forEach((url) => {
          try {
            URL.revokeObjectURL(url);
          } catch {
            // Ignore
          }
        });

        return;
      }

      loadedUrls = urls;

      setImageUrls(urls);

      setActiveImage(0);
    }

    loadImages();

    return () => {

      cancelled = true;

      loadedUrls.forEach((url) => {

        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore
        }

      });

    };

  }, [product.images]);

  /* ==========================================================
     IMAGE NAVIGATION
     ========================================================== */

  function handlePrevious() {

    if (imageUrls.length === 0) {
      return;
    }

    setActiveImage((current) =>
      current === 0
        ? imageUrls.length - 1
        : current - 1
    );
  }

  function handleNext() {

    if (imageUrls.length === 0) {
      return;
    }

    setActiveImage((current) =>
      current === imageUrls.length - 1
        ? 0
        : current + 1
    );
  }

  const currentImage =
    imageUrls[activeImage];

  /* ==========================================================
     QR DATA
     ========================================================== */

  const qrData = JSON.stringify({
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    barcode: product.barcode,
    category: product.category,
  });

  /* ==========================================================
     RETURN
     ========================================================== */

  return (
    <>
      {/* ======================================================
          PRODUCT PREVIEW MODAL
          ====================================================== */}

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,

          background:
            "rgba(0,0,0,0.55)",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          padding: "20px",
        }}
      >

        <div
          style={{
            width: "100%",

            maxWidth: "1150px",

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

              justifyContent:
                "space-between",

              alignItems: "center",

              gap: "15px",

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
                📦 Product Details
              </h2>

              <div
                style={{
                  marginTop: "5px",
                  color: "#666",
                  fontSize: "13px",
                }}
              >
                {product.name}
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
              title="Close"
            >
              ×
            </button>

          </div>

          {/* ==================================================
              IMAGE GALLERY
              ================================================== */}

          <div
            style={{
              border:
                "1px solid #e5e7eb",

              borderRadius: "12px",

              padding: "20px",

              marginBottom: "25px",
            }}
          >

            <h3
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: "18px",
              }}
            >
              🖼️ Product Images
            </h3>

            {imageUrls.length > 0 ? (

              <>
                {/* MAIN IMAGE */}

                <div
                  style={{
                    position: "relative",

                    width: "100%",

                    maxWidth: "700px",

                    margin: "0 auto",

                    background: "#f8f9fa",

                    borderRadius: "12px",

                    overflow: "hidden",
                  }}
                >

                  <img
                    src={currentImage}
                    alt={product.name}

                    onClick={() =>
                      setZoomImage(
                        currentImage
                      )
                    }

                    style={{
                      width: "100%",

                      height: "420px",

                      objectFit: "contain",

                      display: "block",

                      cursor: "zoom-in",
                    }}
                  />

                  {/* COUNTER */}

                  <div
                    style={{
                      position: "absolute",

                      bottom: "12px",

                      left: "50%",

                      transform:
                        "translateX(-50%)",

                      background:
                        "rgba(0,0,0,0.65)",

                      color: "#ffffff",

                      padding:
                        "6px 12px",

                      borderRadius:
                        "20px",

                      fontSize: "13px",
                    }}
                  >
                    {activeImage + 1}
                    {" / "}
                    {imageUrls.length}
                  </div>

                  {/* PREVIOUS */}

                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={
                        handlePrevious
                      }
                      style={{
                        position:
                          "absolute",

                        left: "12px",

                        top: "50%",

                        transform:
                          "translateY(-50%)",

                        width: "42px",

                        height: "42px",

                        border: "none",

                        borderRadius:
                          "50%",

                        background:
                          "rgba(0,0,0,0.55)",

                        color: "#ffffff",

                        fontSize: "22px",

                        cursor: "pointer",
                      }}
                    >
                      ‹
                    </button>
                  )}

                  {/* NEXT */}

                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      style={{
                        position:
                          "absolute",

                        right: "12px",

                        top: "50%",

                        transform:
                          "translateY(-50%)",

                        width: "42px",

                        height: "42px",

                        border: "none",

                        borderRadius:
                          "50%",

                        background:
                          "rgba(0,0,0,0.55)",

                        color: "#ffffff",

                        fontSize: "22px",

                        cursor: "pointer",
                      }}
                    >
                      ›
                    </button>
                  )}

                </div>

                {/* THUMBNAILS */}

                {imageUrls.length > 1 && (

                  <div
                    style={{
                      display: "flex",

                      gap: "10px",

                      marginTop: "15px",

                      overflowX: "auto",

                      paddingBottom: "5px",
                    }}
                  >

                    {imageUrls.map(
                      (url, index) => (

                        <button
                          type="button"
                          key={`${url}-${index}`}
                          onClick={() =>
                            setActiveImage(
                              index
                            )
                          }
                          style={{
                            flex:
                              "0 0 auto",

                            width: "80px",

                            height: "80px",

                            padding: "3px",

                            border:
                              activeImage ===
                              index
                                ? "3px solid #7A003C"
                                : "1px solid #d1d5db",

                            borderRadius:
                              "8px",

                            background:
                              "#ffffff",

                            cursor:
                              "pointer",
                          }}
                        >

                          <img
                            src={url}
                            alt={`Thumbnail ${
                              index + 1
                            }`}
                            style={{
                              width:
                                "100%",

                              height:
                                "100%",

                              objectFit:
                                "cover",

                              borderRadius:
                                "5px",

                              display:
                                "block",
                            }}
                          />

                        </button>

                      )
                    )}

                  </div>

                )}

              </>

            ) : (

              <div
                style={{
                  height: "300px",

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background: "#f9fafb",

                  borderRadius: "10px",

                  color: "#777",
                }}
              >
                No Product Images
              </div>

            )}

          </div>

          {/* ==================================================
              PRODUCT INFORMATION
              ================================================== */}

          <div
            style={{
              border:
                "1px solid #e5e7eb",

              borderRadius: "12px",

              padding: "20px",

              marginBottom: "20px",
            }}
          >

            <h3
              style={{
                marginTop: 0,
                marginBottom: "18px",
              }}
            >
              📋 Product Information
            </h3>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",

                gap: "16px",
              }}
            >

              <InfoItem
                label="Product Name"
                value={product.name}
              />

              <InfoItem
                label="SKU"
                value={product.sku}
              />

              <InfoItem
                label="Barcode"
                value={product.barcode}
              />

              <InfoItem
                label="Category"
                value={product.category}
              />

              <InfoItem
                label="Brand"
                value={product.brand}
              />

              <InfoItem
                label="Fabric"
                value={product.fabric}
              />

              <InfoItem
                label="Colour"
                value={product.colour}
              />

              <InfoItem
                label="Size"
                value={product.size}
              />

              <InfoItem
                label="HSN Code"
                value={product.hsn}
              />

              <InfoItem
                label="GST"
                value={`${product.gst}%`}
              />

              <InfoItem
                label="Stock"
                value={String(
                  product.stock
                )}
              />

            </div>

          </div>

          {/* ==================================================
              BARCODE + QR
              ================================================== */}

          <div
            style={{
              border:
                "1px solid #e5e7eb",

              borderRadius: "12px",

              padding: "20px",

              marginBottom: "20px",
            }}
          >

            <h3
              style={{
                marginTop: 0,
                marginBottom: "20px",
                fontSize: "19px",
              }}
            >
              🏷️ Barcode & QR Code
            </h3>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",

                gap: "20px",
              }}
            >

              {/* BARCODE */}

              <div
                style={{
                  border:
                    "1px solid #e5e7eb",

                  borderRadius: "10px",

                  padding: "20px",

                  textAlign: "center",

                  background: "#fafafa",
                }}
              >

                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: "15px",
                  }}
                >
                  🏷️ Product Barcode
                </h4>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",

                    overflowX: "auto",
                  }}
                >

                  <Barcode
                    value={
                      product.barcode ||
                      product.sku ||
                      "NO-BARCODE"
                    }

                    format="CODE128"

                    width={2}

                    height={70}

                    displayValue={true}

                    fontSize={14}

                    margin={10}
                  />

                </div>

                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  Barcode:{" "}
                  <strong>
                    {product.barcode}
                  </strong>
                </div>

              </div>

              {/* QR */}

              <div
                style={{
                  border:
                    "1px solid #e5e7eb",

                  borderRadius: "10px",

                  padding: "20px",

                  textAlign: "center",

                  background: "#fafafa",
                }}
              >

                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: "15px",
                  }}
                >
                  🔳 Product QR Code
                </h4>

                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",
                  }}
                >

                  <QRCodeSVG
                    value={qrData}
                    size={180}
                    level="M"
                    includeMargin={true}
                  />

                </div>

                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  Product information
                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              PRICING
              ================================================== */}

          <div
            style={{
              border:
                "1px solid #e5e7eb",

              borderRadius: "12px",

              padding: "20px",

              marginBottom: "20px",
            }}
          >

            <h3
              style={{
                marginTop: 0,
                marginBottom: "18px",
              }}
            >
              💰 Product Pricing
            </h3>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",

                gap: "16px",
              }}
            >

              <PriceItem
                label="Purchase Price"
                value={
                  product.purchasePrice
                }
              />

              <PriceItem
                label="Wholesale Price"
                value={
                  product.wholesalePrice
                }
              />

              <PriceItem
                label="Retail Price"
                value={
                  product.retailPrice
                }
              />

              <PriceItem
                label="MRP"
                value={product.mrp}
              />

              <InfoItem
                label="Discount"
                value={`${product.discount}%`}
              />

            </div>

          </div>

          {/* ==================================================
              ACTION BUTTONS
              ================================================== */}

          <div
            style={{
              display: "flex",

              justifyContent:
                "flex-end",

              alignItems:
                "center",

              gap: "10px",

              marginTop: "20px",

              flexWrap: "wrap",
            }}
          >

            {/* LABEL PREVIEW */}

            <button
              type="button"
              onClick={() =>
                setShowLabelPreview(
                  true
                )
              }
              style={{
                padding:
                  "10px 18px",

                border: "none",

                background:
                  "#2563EB",

                color:
                  "#ffffff",

                borderRadius:
                  "8px",

                cursor:
                  "pointer",

                fontWeight: 600,
              }}
            >
              🏷️ Label Preview
            </button>

            {/* STICKER PRINT */}

            <button
              type="button"
              onClick={() =>
                setShowLabelPrint(
                  true
                )
              }
              style={{
                padding:
                  "10px 18px",

                border: "none",

                background:
                  "#059669",

                color:
                  "#ffffff",

                borderRadius:
                  "8px",

                cursor:
                  "pointer",

                fontWeight: 600,
              }}
            >
              🖨️ A4 Sticker Print
            </button>

            {/* EDIT */}

            {onEdit && (

              <button
                type="button"

                onClick={() => {
                  onEdit(product);
                  onClose();
                }}

                style={{
                  padding:
                    "10px 18px",

                  border: "none",

                  background:
                    "#7A003C",

                  color:
                    "#ffffff",

                  borderRadius:
                    "8px",

                  cursor:
                    "pointer",

                  fontWeight: 600,
                }}
              >
                ✏️ Edit Product
              </button>

            )}

            {/* CLOSE */}

            <button
              type="button"
              onClick={onClose}
              style={{
                padding:
                  "10px 18px",

                border:
                  "1px solid #d1d5db",

                background:
                  "#ffffff",

                borderRadius:
                  "8px",

                cursor:
                  "pointer",

                fontWeight: 600,
              }}
            >
              Close
            </button>

          </div>

        </div>

      </div>

      {/* ======================================================
          IMAGE ZOOM
          ====================================================== */}

      {zoomImage && (

        <div
          onClick={() =>
            setZoomImage(null)
          }
          style={{
            position: "fixed",

            inset: 0,

            zIndex: 30000,

            background:
              "rgba(0,0,0,0.90)",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            padding: "30px",

            cursor: "zoom-out",
          }}
        >

          <button
            type="button"
            onClick={() =>
              setZoomImage(null)
            }
            style={{
              position:
                "absolute",

              top: "20px",

              right: "25px",

              width: "42px",

              height: "42px",

              border: "none",

              borderRadius:
                "50%",

              background:
                "rgba(255,255,255,0.15)",

              color:
                "#ffffff",

              fontSize: "25px",

              cursor: "pointer",
            }}
          >
            ×
          </button>

          <img
            src={zoomImage}
            alt={product.name}
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              maxWidth: "95vw",

              maxHeight: "90vh",

              objectFit:
                "contain",

              borderRadius: "8px",
            }}
          />

        </div>

      )}

      {/* ======================================================
          LABEL PREVIEW
          ====================================================== */}

      {showLabelPreview && (

        <ProductLabelPreview
          product={product}
          onClose={() =>
            setShowLabelPreview(false)
          }
        />

      )}

      {/* ======================================================
          STICKER PRINT
          ====================================================== */}

      {showLabelPrint && (

        <ProductLabelPrint
          product={product}
          onClose={() =>
            setShowLabelPrint(false)
          }
        />

      )}

    </>
  );
}

/* ============================================================
   INFO ITEM
   ============================================================ */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div
      style={{
        background: "#f9fafb",

        borderRadius: "8px",

        padding: "12px",
      }}
    >

      <div
        style={{
          fontSize: "12px",

          color: "#777",

          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "14px",

          fontWeight: 600,
        }}
      >
        {value || "-"}
      </div>

    </div>
  );
}

/* ============================================================
   PRICE ITEM
   ============================================================ */

function PriceItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {

  return (
    <div
      style={{
        background: "#f9fafb",

        borderRadius: "8px",

        padding: "14px",
      }}
    >

      <div
        style={{
          fontSize: "12px",

          color: "#777",

          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "18px",

          fontWeight: 700,
        }}
      >
        ₹{" "}
        {Number(
          value || 0
        ).toLocaleString("en-IN")}
      </div>

    </div>
  );
}