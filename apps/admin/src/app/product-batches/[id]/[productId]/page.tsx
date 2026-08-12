"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { Product } from "@/types/Product";
import {
  getProductById,
  updateProduct,
} from "@/services/productService";

/* ============================================================
   PRODUCT FORM
============================================================ */

type ProductForm = {
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  fabric: string;
  colour: string;
  size: string;
  hsn: string;
  gst: string;
  purchasePrice: string;
  wholesalePrice: string;
  retailPrice: string;
  mrp: string;
  discount: string;
  stock: string;
  image: string;
  images: string[];
};

/* ============================================================
   EMPTY FORM
============================================================ */

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  barcode: "",
  category: "",
  brand: "",
  fabric: "",
  colour: "",
  size: "",
  hsn: "",
  gst: "5",
  purchasePrice: "0",
  wholesalePrice: "0",
  retailPrice: "0",
  mrp: "0",
  discount: "0",
  stock: "0",
  image: "",
  images: [],
};

/* ============================================================
   PAGE
============================================================ */

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();

  /*
   * Route:
   * /product-batches/[id]/edit
   *
   * Here [id] is treated as PRODUCT ID.
   */

  const productId =
    Array.isArray(params?.id)
      ? params.id[0]
      : String(params?.id || "");

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* ============================================================
     LOAD PRODUCT
  ============================================================ */

  useEffect(() => {
    if (!productId) {
      setMessage("Product ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const product =
        getProductById(productId);

      if (!product) {
        setMessage("Product not found.");
        setLoading(false);
        return;
      }

      const existingImages =
        Array.isArray(product.images)
          ? product.images
          : product.image
            ? [product.image]
            : [];

      setForm({
        name: product.name || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        category: product.category || "",
        brand: product.brand || "",
        fabric: product.fabric || "",
        colour: product.colour || "",
        size: product.size || "",
        hsn: product.hsn || "",
        gst: String(product.gst ?? 0),
        purchasePrice: String(
          product.purchasePrice ?? 0
        ),
        wholesalePrice: String(
          product.wholesalePrice ?? 0
        ),
        retailPrice: String(
          product.retailPrice ?? 0
        ),
        mrp: String(product.mrp ?? 0),
        discount: String(
          product.discount ?? 0
        ),
        stock: String(
          product.stock ?? 0
        ),
        image: product.image || "",
        images: Array.from(
          new Set(existingImages)
        ),
      });
    } catch (error) {
      console.error(
        "Failed to load product:",
        error
      );

      setMessage(
        "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  /* ============================================================
     FIELD CHANGE
  ============================================================ */

  const handleChange = (
    field: keyof ProductForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setMessage("");
  };

  /* ============================================================
     PRIMARY IMAGE
  ============================================================ */

  const handlePrimaryImage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const result =
        String(reader.result || "");

      if (!result) {
        return;
      }

      setForm((previous) => ({
        ...previous,

        image: result,

        images: Array.from(
          new Set([
            result,
            ...previous.images,
          ])
        ),
      }));

      setMessage(
        "Primary image selected."
      );
    };

    reader.onerror = () => {
      setMessage(
        "Failed to read image."
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  /* ============================================================
     MULTIPLE IMAGES
  ============================================================ */

  const handleMultipleImages = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      Array.from(
        event.target.files || []
      );

    if (files.length === 0) {
      return;
    }

    let completed = 0;

    const newImages: string[] = [];

    files.forEach((file) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const result =
          String(reader.result || "");

        if (result) {
          newImages.push(result);
        }

        completed++;

        if (
          completed === files.length
        ) {
          setForm((previous) => {
            const merged = [
              ...previous.images,
              ...newImages,
            ];

            const uniqueImages =
              Array.from(
                new Set(merged)
              );

            return {
              ...previous,

              image:
                previous.image ||
                uniqueImages[0] ||
                "",

              images:
                uniqueImages,
            };
          });

          setMessage("");
        }
      };

      reader.onerror = () => {
        completed++;

        if (
          completed === files.length
        ) {
          setMessage(
            "One or more images could not be loaded."
          );
        }
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  /* ============================================================
     SET PRIMARY
  ============================================================ */

  const setAsPrimary = (
    image: string
  ) => {
    setForm((previous) => ({
      ...previous,
      image,
    }));

    setMessage(
      "Primary image selected."
    );
  };

  /* ============================================================
     REMOVE IMAGE
  ============================================================ */

  const removeImage = (
    image: string
  ) => {
    setForm((previous) => {
      const remaining =
        previous.images.filter(
          (item) => item !== image
        );

      let newPrimary =
        previous.image;

      if (
        previous.image === image
      ) {
        newPrimary =
          remaining[0] || "";
      }

      return {
        ...previous,
        image: newPrimary,
        images: remaining,
      };
    });

    setMessage("");
  };

  /* ============================================================
     SAVE / UPDATE
  ============================================================ */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");

    if (!form.name.trim()) {
      setMessage(
        "Please enter Product Name."
      );
      return;
    }

    if (!form.sku.trim()) {
      setMessage(
        "Please enter SKU."
      );
      return;
    }

    if (!form.barcode.trim()) {
      setMessage(
        "Please enter Barcode."
      );
      return;
    }

    try {
      setSaving(true);

      const oldProduct =
        getProductById(productId);

      if (!oldProduct) {
        setMessage(
          "Product not found."
        );
        setSaving(false);
        return;
      }

      /*
       * IMPORTANT:
       * Keep the original product ID.
       */

      const updatedProduct: Product = {
        id: oldProduct.id,

        name: form.name.trim(),

        sku: form.sku.trim(),

        barcode:
          form.barcode.trim(),

        category:
          form.category.trim(),

        brand:
          form.brand.trim(),

        fabric:
          form.fabric.trim(),

        colour:
          form.colour.trim(),

        size:
          form.size.trim(),

        hsn:
          form.hsn.trim(),

        gst:
          Number(form.gst) || 0,

        purchasePrice:
          Number(
            form.purchasePrice
          ) || 0,

        wholesalePrice:
          Number(
            form.wholesalePrice
          ) || 0,

        retailPrice:
          Number(
            form.retailPrice
          ) || 0,

        mrp:
          Number(form.mrp) || 0,

        discount:
          Number(form.discount) || 0,

        stock:
          Number(form.stock) || 0,

        image:
          form.image || "",

        images:
          Array.from(
            new Set(form.images)
          ),

        /*
         * Created date MUST NOT change
         * during editing.
         */

        createdAt:
          oldProduct.createdAt,
      };

      updateProduct(
        updatedProduct
      );

      setMessage(
        "Product updated successfully."
      );

      /*
       * Go back to Product Detail
       * after successful update.
       */

      setTimeout(() => {
        router.push(
          `/product-batches/${productId}`
        );
      }, 700);
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      setMessage(
        "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <div
            style={{
              textAlign: "center",
              padding: "80px",
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

            <h1>
              Loading Product...
            </h1>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Please wait...
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* ============================================================
     PRODUCT NOT FOUND
  ============================================================ */

  if (!form.name && message === "Product not found.") {
    return (
      <main style={pageStyle}>
        <section
          style={{
            ...cardStyle,
            padding: "70px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "65px",
              marginBottom: "20px",
            }}
          >
            🔍
          </div>

          <h1>
            Product not found.
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "17px",
            }}
          >
            Product ID:
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "12px 18px",
              background: "#f8fafc",
              border:
                "1px solid #e2e8f0",
              borderRadius: "10px",
              fontFamily: "monospace",
            }}
          >
            {productId}
          </div>

          <div
            style={{
              marginTop: "30px",
            }}
          >
            <Link
              href="/product-batches"
              style={primaryButtonStyle}
            >
              📦 All Product Batches
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* ============================================================
     MAIN PAGE
  ============================================================ */

  return (
    <main style={pageStyle}>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section style={headerStyle}>

        <Link
          href="/product-batches"
          style={backLinkStyle}
        >
          ← Back to Product Batches
        </Link>

        <div
          style={{
            marginTop: "25px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
            }}
          >
            🛍️
          </div>

          <h1
            style={{
              margin: "10px 0 0",
              fontSize: "38px",
              fontWeight: 800,
            }}
          >
            Edit Product
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "18px",
              marginTop: "10px",
            }}
          >
            Update product information and images
          </p>
        </div>
      </section>

      {/* ======================================================
          MESSAGE
      ====================================================== */}

      {message && (
        <div
          style={{
            ...cardStyle,
            padding: "18px 25px",
            marginBottom: "25px",
            background:
              message.includes(
                "successfully"
              )
                ? "#f0fdf4"
                : "#fff7ed",
            border:
              message.includes(
                "successfully"
              )
                ? "1px solid #86efac"
                : "1px solid #fed7aa",
            color:
              message.includes(
                "successfully"
              )
                ? "#166534"
                : "#9a3412",
            fontWeight: 700,
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
      >

        {/* ====================================================
            BASIC INFORMATION
        ==================================================== */}

        <section style={sectionStyle}>

          <h2 style={sectionTitle}>
            📋 Basic Product Information
          </h2>

          <div style={gridStyle}>

            <Input
              label="Product Name"
              value={form.name}
              onChange={(value) =>
                handleChange(
                  "name",
                  value
                )
              }
              required
            />

            <Input
              label="SKU"
              value={form.sku}
              onChange={(value) =>
                handleChange(
                  "sku",
                  value
                )
              }
              required
            />

            <Input
              label="Barcode"
              value={form.barcode}
              onChange={(value) =>
                handleChange(
                  "barcode",
                  value
                )
              }
              required
            />

            <Input
              label="Brand"
              value={form.brand}
              onChange={(value) =>
                handleChange(
                  "brand",
                  value
                )
              }
            />

            <Input
              label="Category"
              value={form.category}
              onChange={(value) =>
                handleChange(
                  "category",
                  value
                )
              }
            />

            <Input
              label="Fabric"
              value={form.fabric}
              onChange={(value) =>
                handleChange(
                  "fabric",
                  value
                )
              }
            />

            <Input
              label="Colour"
              value={form.colour}
              onChange={(value) =>
                handleChange(
                  "colour",
                  value
                )
              }
            />

            <Input
              label="Size"
              value={form.size}
              onChange={(value) =>
                handleChange(
                  "size",
                  value
                )
              }
            />

            <Input
              label="HSN"
              value={form.hsn}
              onChange={(value) =>
                handleChange(
                  "hsn",
                  value
                )
              }
            />

            <Input
              label="GST %"
              type="number"
              value={form.gst}
              onChange={(value) =>
                handleChange(
                  "gst",
                  value
                )
              }
            />

            <Input
              label="Discount %"
              type="number"
              value={form.discount}
              onChange={(value) =>
                handleChange(
                  "discount",
                  value
                )
              }
            />

            <Input
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(value) =>
                handleChange(
                  "stock",
                  value
                )
              }
            />

          </div>
        </section>

        {/* ====================================================
            PRICING
        ==================================================== */}

        <section style={sectionStyle}>

          <h2 style={sectionTitle}>
            💰 Pricing
          </h2>

          <div style={gridStyle}>

            <Input
              label="Purchase Price"
              type="number"
              value={
                form.purchasePrice
              }
              onChange={(value) =>
                handleChange(
                  "purchasePrice",
                  value
                )
              }
            />

            <Input
              label="Wholesale Price"
              type="number"
              value={
                form.wholesalePrice
              }
              onChange={(value) =>
                handleChange(
                  "wholesalePrice",
                  value
                )
              }
            />

            <Input
              label="Retail Price"
              type="number"
              value={
                form.retailPrice
              }
              onChange={(value) =>
                handleChange(
                  "retailPrice",
                  value
                )
              }
            />

            <Input
              label="MRP"
              type="number"
              value={form.mrp}
              onChange={(value) =>
                handleChange(
                  "mrp",
                  value
                )
              }
            />

          </div>
        </section>

        {/* ====================================================
            PRIMARY IMAGE
        ==================================================== */}

        <section style={sectionStyle}>

          <h2 style={sectionTitle}>
            🖼️ Primary Product Image
          </h2>

          <p
            style={{
              color: "#64748b",
              marginBottom: "20px",
            }}
          >
            This image will be used as
            the main product image.
          </p>

          <label
            style={uploadBoxStyle}
          >

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handlePrimaryImage
              }
              style={{
                display: "none",
              }}
            />

            <div
              style={{
                fontSize: "45px",
                marginBottom: "10px",
              }}
            >
              📷
            </div>

            <strong>
              Choose Primary Image
            </strong>

            <div
              style={{
                marginTop: "6px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              JPG, PNG, WEBP
            </div>

          </label>

          {form.image && (
            <div
              style={{
                marginTop: "25px",
                maxWidth: "450px",
              }}
            >

              <img
                src={form.image}
                alt="Primary product"
                style={{
                  width: "100%",
                  height: "330px",
                  objectFit: "contain",
                  background:
                    "#f8fafc",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "16px",
                }}
              />

              <div
                style={{
                  marginTop: "10px",
                  color: "#97004d",
                  fontWeight: 800,
                }}
              >
                ⭐ Primary Product Image
              </div>

            </div>
          )}

        </section>

        {/* ====================================================
            IMAGE GALLERY
        ==================================================== */}

        <section style={sectionStyle}>

          <h2 style={sectionTitle}>
            🖼️ Product Image Gallery
          </h2>

          <p
            style={{
              color: "#64748b",
              marginBottom: "20px",
            }}
          >
            Upload multiple images for
            this product.
          </p>

          <label
            style={uploadBoxStyle}
          >

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={
                handleMultipleImages
              }
              style={{
                display: "none",
              }}
            />

            <div
              style={{
                fontSize: "45px",
                marginBottom: "10px",
              }}
            >
              🖼️
            </div>

            <strong>
              Add Multiple Images
            </strong>

            <div
              style={{
                marginTop: "6px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Select one or more product
              images
            </div>

          </label>

          {form.images.length > 0 ? (

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
                marginTop: "30px",
              }}
            >

              {form.images.map(
                (image, index) => (

                  <div
                    key={`${image}-${index}`}
                    style={{
                      border:
                        "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "12px",
                      background:
                        "#ffffff",
                    }}
                  >

                    <img
                      src={image}
                      alt={`Product image ${
                        index + 1
                      }`}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "contain",
                        background:
                          "#f8fafc",
                        borderRadius:
                          "12px",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "12px",
                        flexWrap: "wrap",
                      }}
                    >

                      {form.image ===
                        image ? (

                        <span
                          style={{
                            background:
                              "#fde7f3",
                            color:
                              "#97004d",
                            padding:
                              "7px 10px",
                            borderRadius:
                              "8px",
                            fontSize:
                              "12px",
                            fontWeight:
                              800,
                          }}
                        >
                          ⭐ Primary
                        </span>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            setAsPrimary(
                              image
                            )
                          }
                          style={
                            secondaryButtonStyle
                          }
                        >
                          ⭐ Set Primary
                        </button>

                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            image
                          )
                        }
                        style={
                          deleteButtonStyle
                        }
                      >
                        🗑️ Remove
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div
              style={{
                marginTop: "25px",
                padding: "35px",
                textAlign: "center",
                background:
                  "#f8fafc",
                border:
                  "1px dashed #cbd5e1",
                borderRadius: "16px",
                color: "#64748b",
              }}
            >
              No product images
              uploaded yet.
            </div>

          )}

        </section>

        {/* ====================================================
            SAVE
        ==================================================== */}

        <section
          style={{
            ...sectionStyle,
            marginBottom: "50px",
          }}
        >

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >

            <button
              type="submit"
              disabled={saving}
              style={{
                background:
                  saving
                    ? "#94a3b8"
                    : "#97004d",
                color: "#ffffff",
                border: "none",
                padding:
                  "15px 30px",
                borderRadius:
                  "10px",
                fontSize: "17px",
                fontWeight: 800,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? "⏳ Updating..."
                : "💾 Update Product"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/product-batches/${productId}`
                )
              }
              style={{
                background:
                  "#2563eb",
                color: "#ffffff",
                border: "none",
                padding:
                  "15px 30px",
                borderRadius:
                  "10px",
                fontSize: "17px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              ← Cancel
            </button>

          </div>

        </section>

      </form>

    </main>
  );
}

/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >

      <span
        style={{
          color: "#475569",
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        {label}

        {required && (
          <span
            style={{
              color: "#dc2626",
              marginLeft: "4px",
            }}
          >
            *
          </span>
        )}

      </span>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px 15px",
          border:
            "1px solid #cbd5e1",
          borderRadius: "10px",
          fontSize: "16px",
          outline: "none",
          background: "#ffffff",
          color: "#111827",
        }}
      />

    </label>
  );
}

/* ============================================================
   STYLES
============================================================ */

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f5f6fa",
  padding: "45px",
  color: "#111827",
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "20px",
  border:
    "1px solid #e2e5eb",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.03)",
};

const headerStyle: React.CSSProperties = {
  ...cardStyle,
  padding: "35px",
  marginBottom: "25px",
};

const sectionStyle: React.CSSProperties = {
  ...cardStyle,
  padding: "35px",
  marginBottom: "25px",
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "28px",
  fontWeight: 800,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "25px",
};

const backLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#97004d",
  fontSize: "18px",
  fontWeight: 800,
};

const uploadBoxStyle: React.CSSProperties = {
  display: "block",
  padding: "35px",
  textAlign: "center",
  background: "#f8fafc",
  border:
    "2px dashed #cbd5e1",
  borderRadius: "16px",
  cursor: "pointer",
  color: "#334155",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#97004d",
  color: "#ffffff",
  textDecoration: "none",
  padding: "14px 24px",
  borderRadius: "10px",
  fontWeight: 800,
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  padding: "8px 10px",
  borderRadius: "8px",
  fontWeight: 700,
  cursor: "pointer",
};

const deleteButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "8px 10px",
  borderRadius: "8px",
  fontWeight: 700,
  cursor: "pointer",
};