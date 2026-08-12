"use client";

import { useEffect, useState } from "react";

import { Product } from "@/types/Product";
import { getProductImageUrl } from "@/services/imageStorage";

type ProductDetailProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductDetail({
  product,
  onClose,
}: ProductDetailProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [loadingImages, setLoadingImages] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      setLoadingImages(true);

      const urls: string[] = [];

      /*
       * Product.images contains IndexedDB image IDs.
       *
       * Old products may only have product.image.
       * Therefore we support both.
       */

      const imageIds: string[] = [];

      if (
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        imageIds.push(...product.images);
      } else if (product.image) {
        imageIds.push(product.image);
      }

      /*
       * Remove duplicate IDs
       */
      const uniqueImageIds = [
        ...new Set(
          imageIds.filter(
            (id) =>
              typeof id === "string" &&
              id.trim() !== ""
          )
        ),
      ];

      /*
       * Load images from IndexedDB
       */
      for (const imageId of uniqueImageIds) {
        try {
          const url =
            await getProductImageUrl(imageId);

          if (url) {
            urls.push(url);
          }
        } catch (error) {
          console.error(
            "Failed to load product image:",
            imageId,
            error
          );
        }
      }

      if (cancelled) {
        urls.forEach((url) =>
          URL.revokeObjectURL(url)
        );

        return;
      }

      setImageUrls(urls);

      if (urls.length > 0) {
        setSelectedImage(urls[0]);
      } else {
        setSelectedImage(null);
      }

      setLoadingImages(false);
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [product]);

  /*
   * Cleanup browser object URLs
   */
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.60)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1500px",
          maxHeight: "95vh",
          overflow: "auto",
          background: "#ffffff",
          borderRadius: "22px",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.35)",
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          style={{
            padding: "28px 36px 20px",
            borderBottom:
              "1px solid #e5e7eb",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              📦 Product Details
            </h2>

            <div
              style={{
                marginTop: "10px",
                fontSize: "18px",
                color: "#64748b",
              }}
            >
              SKU:{" "}
              <strong>
                {product.sku || "-"}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "52px",
              height: "52px",
              border: "none",
              borderRadius: "50%",
              background: "#f3f4f6",
              color: "#111827",
              fontSize: "28px",
              cursor: "pointer",
              flexShrink: 0,
            }}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(400px, 1fr) minmax(450px, 1fr)",
            gap: "40px",
            padding: "30px 36px 40px",
          }}
        >
          {/* =================================================
              LEFT - IMAGE GALLERY
          ================================================= */}

          <div>
            {/* MAIN IMAGE */}

            <div
              style={{
                width: "100%",
                height: "620px",
                border:
                  "1px solid #e5e7eb",
                borderRadius: "16px",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {loadingImages ? (
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "18px",
                  }}
                >
                  Loading Product Images...
                </div>
              ) : selectedImage ? (
                <img
                  src={selectedImage}
                  alt={
                    product.name ||
                    "Product Image"
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  <div
                    style={{
                      fontSize: "48px",
                      marginBottom: "10px",
                    }}
                  >
                    🖼️
                  </div>

                  <div
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    No Product Image
                  </div>
                </div>
              )}
            </div>

            {/* THUMBNAILS */}

            {imageUrls.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(90px, 1fr))",
                  gap: "12px",
                  marginTop: "15px",
                }}
              >
                {imageUrls.map(
                  (url, index) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          url
                        )
                      }
                      style={{
                        height: "90px",
                        padding: "4px",
                        border:
                          selectedImage ===
                          url
                            ? "3px solid #7A003C"
                            : "1px solid #e5e7eb",
                        borderRadius: "10px",
                        background:
                          "#ffffff",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={url}
                        alt={`Product ${
                          index + 1
                        }`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit:
                            "cover",
                          borderRadius:
                            "6px",
                        }}
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT - PRODUCT INFORMATION
          ================================================= */}

          <div>
            <h1
              style={{
                margin: "5px 0 15px",
                fontSize: "38px",
                lineHeight: 1.2,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {product.name ||
                "Unnamed Product"}
            </h1>

            {/* STOCK STATUS */}

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding:
                  "8px 15px",
                borderRadius: "30px",
                background:
                  product.stock > 0
                    ? "#dcfce7"
                    : "#fee2e2",
                color:
                  product.stock > 0
                    ? "#166534"
                    : "#b91c1c",
                fontWeight: 700,
                fontSize: "16px",
                marginBottom: "28px",
              }}
            >
              {product.stock > 0
                ? `✓ In Stock (${product.stock})`
                : "× Out of Stock"}
            </div>

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "16px",
              }}
            >
              <InfoBox
                label="Category"
                value={
                  product.category
                }
              />

              <InfoBox
                label="Brand"
                value={
                  product.brand
                }
              />

              <InfoBox
                label="Fabric"
                value={
                  product.fabric
                }
              />

              <InfoBox
                label="Colour"
                value={
                  product.colour
                }
              />

              <InfoBox
                label="Size"
                value={
                  product.size
                }
              />

              <InfoBox
                label="HSN"
                value={
                  product.hsn
                }
              />

              <InfoBox
                label="GST"
                value={
                  product.gst !==
                  undefined
                    ? `${product.gst}%`
                    : "-"
                }
              />

              <InfoBox
                label="Barcode"
                value={
                  product.barcode
                }
              />
            </div>

            {/* =================================================
                PRICING
            ================================================= */}

            <div
              style={{
                marginTop: "28px",
                border:
                  "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
                background:
                  "#fafafa",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 18px",
                  fontSize: "21px",
                  fontWeight: 700,
                }}
              >
                💰 Pricing
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "16px",
                }}
              >
                <PriceBox
                  label="Purchase Price"
                  value={
                    product.purchasePrice
                  }
                />

                <PriceBox
                  label="Wholesale Price"
                  value={
                    product.wholesalePrice
                  }
                />

                <PriceBox
                  label="Retail Price"
                  value={
                    product.retailPrice
                  }
                />

                <PriceBox
                  label="MRP"
                  value={
                    product.mrp
                  }
                  highlight
                />

                <PriceBox
                  label="Discount"
                  value={
                    product.discount
                  }
                  suffix="%"
                />
              </div>
            </div>

            {/* =================================================
                PRODUCT IDS
            ================================================= */}

            <div
              style={{
                marginTop: "20px",
                padding: "18px",
                borderRadius: "14px",
                background:
                  "#f8fafc",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  marginBottom: "6px",
                }}
              >
                Product ID
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  wordBreak:
                    "break-all",
                }}
              >
                {product.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div
      style={{
        border:
          "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        minHeight: "58px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "7px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "17px",
          fontWeight: 600,
          color: "#111827",
          wordBreak:
            "break-word",
        }}
      >
        {value !== undefined &&
        value !== ""
          ? value
          : "-"}
      </div>
    </div>
  );
}

/* ============================================================
   PRICE BOX
============================================================ */

function PriceBox({
  label,
  value,
  suffix = "",
  highlight = false,
}: {
  label: string;
  value?: number;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize:
            highlight
              ? "24px"
              : "18px",
          fontWeight: 700,
          color:
            highlight
              ? "#7A003C"
              : "#111827",
        }}
      >
        {suffix === "%"
          ? `${value ?? 0}%`
          : `₹${Number(
              value ?? 0
            ).toLocaleString(
              "en-IN"
            )}`}
      </div>
    </div>
  );
}