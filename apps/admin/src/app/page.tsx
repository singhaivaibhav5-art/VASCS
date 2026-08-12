"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppShell from "@/components/layout/AppShell";
import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import ProductDetail from "@/components/products/ProductDetail";

import { Product } from "@/types/Product";

import {
  getProducts,
  saveProduct,
  deleteProduct,
  updateProduct,
} from "@/services/productService";

export default function HomePage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [viewingProduct, setViewingProduct] =
    useState<Product | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [colourFilter, setColourFilter] =
    useState("");

  const [brandFilter, setBrandFilter] =
    useState("");

  const [stockFilter, setStockFilter] =
    useState("");

  /*
  ============================================================
  LOAD PRODUCTS
  ============================================================
  */

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  /*
  ============================================================
  SAVE PRODUCT
  ============================================================
  */

  function handleSave(product: Product) {
    if (editingProduct) {
      updateProduct(product);
    } else {
      saveProduct(product);
    }

    setProducts(getProducts());
    setEditingProduct(null);
  }

  /*
  ============================================================
  DELETE PRODUCT
  ============================================================
  */

  function handleDelete(id: string) {
    deleteProduct(id);

    setProducts(getProducts());

    if (
      editingProduct?.id === id
    ) {
      setEditingProduct(null);
    }

    if (
      viewingProduct?.id === id
    ) {
      setViewingProduct(null);
    }
  }

  /*
  ============================================================
  EDIT PRODUCT
  ============================================================
  */

  function handleEdit(
    product: Product
  ) {
    setEditingProduct(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
  ============================================================
  CANCEL EDIT
  ============================================================
  */

  function handleCancelEdit() {
    setEditingProduct(null);
  }

  /*
  ============================================================
  FILTER OPTIONS
  ============================================================
  */

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.category
            )
            .filter(Boolean)
        )
      ).sort(),
    [products]
  );

  const colours = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.colour
            )
            .filter(Boolean)
        )
      ).sort(),
    [products]
  );

  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.brand
            )
            .filter(Boolean)
        )
      ).sort(),
    [products]
  );

  /*
  ============================================================
  FILTER PRODUCTS
  ============================================================
  */

  const filteredProducts =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const matchesSearch =
            !search ||
            product.name
              .toLowerCase()
              .includes(search) ||
            product.sku
              .toLowerCase()
              .includes(search) ||
            product.barcode
              .toLowerCase()
              .includes(search) ||
            product.category
              .toLowerCase()
              .includes(search) ||
            product.brand
              .toLowerCase()
              .includes(search) ||
            product.colour
              .toLowerCase()
              .includes(search) ||
            product.fabric
              .toLowerCase()
              .includes(search);

          const matchesCategory =
            !categoryFilter ||
            product.category ===
              categoryFilter;

          const matchesColour =
            !colourFilter ||
            product.colour ===
              colourFilter;

          const matchesBrand =
            !brandFilter ||
            product.brand ===
              brandFilter;

          let matchesStock = true;

          if (
            stockFilter ===
            "in-stock"
          ) {
            matchesStock =
              product.stock > 0;
          }

          if (
            stockFilter ===
            "out-of-stock"
          ) {
            matchesStock =
              product.stock <= 0;
          }

          return (
            matchesSearch &&
            matchesCategory &&
            matchesColour &&
            matchesBrand &&
            matchesStock
          );
        }
      );
    }, [
      products,
      searchTerm,
      categoryFilter,
      colourFilter,
      brandFilter,
      stockFilter,
    ]);

  /*
  ============================================================
  CLEAR FILTERS
  ============================================================
  */

  function clearFilters() {
    setSearchTerm("");
    setCategoryFilter("");
    setColourFilter("");
    setBrandFilter("");
    setStockFilter("");
  }

  const filtersActive =
    Boolean(
      searchTerm ||
      categoryFilter ||
      colourFilter ||
      brandFilter ||
      stockFilter
    );

  /*
  ============================================================
  UI
  ============================================================
  */

  return (
    <AppShell>

      {/* PRODUCT DETAIL */}

      {viewingProduct && (
        <ProductDetail
          product={
            viewingProduct
          }
          onClose={() =>
            setViewingProduct(
              null
            )
          }
          onEdit={handleEdit}
        />
      )}

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        📦 Product Master
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
        }}
      >
        Enterprise Product Management
      </p>

      {/* PRODUCT FORM */}

      <ProductForm
        onSave={handleSave}
        editingProduct={
          editingProduct
        }
        onCancelEdit={
          handleCancelEdit
        }
      />

      {/* SEARCH */}

      <div
        style={{
          marginTop: "35px",
          marginBottom: "25px",
          padding: "22px",
          border:
            "1px solid #e5e7eb",
          borderRadius: "14px",
          background: "#ffffff",
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: "18px",
            fontSize: "21px",
            fontWeight: 700,
          }}
        >
          🔎 Search & Filter Products
        </h2>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
          placeholder="Search Product Name, SKU, Barcode, Category, Brand, Colour or Fabric..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding:
              "14px 16px",
            border:
              "1px solid #d1d5db",
            borderRadius: "9px",
            fontSize: "15px",
            outline: "none",
            marginBottom: "18px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <select
            value={
              categoryFilter
            }
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            style={filterStyle}
          >
            <option value="">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          <select
            value={colourFilter}
            onChange={(event) =>
              setColourFilter(
                event.target.value
              )
            }
            style={filterStyle}
          >
            <option value="">
              All Colours
            </option>

            {colours.map(
              (colour) => (
                <option
                  key={colour}
                  value={colour}
                >
                  {colour}
                </option>
              )
            )}
          </select>

          <select
            value={brandFilter}
            onChange={(event) =>
              setBrandFilter(
                event.target.value
              )
            }
            style={filterStyle}
          >
            <option value="">
              All Brands
            </option>

            {brands.map(
              (brand) => (
                <option
                  key={brand}
                  value={brand}
                >
                  {brand}
                </option>
              )
            )}
          </select>

          <select
            value={stockFilter}
            onChange={(event) =>
              setStockFilter(
                event.target.value
              )
            }
            style={filterStyle}
          >
            <option value="">
              All Stock
            </option>

            <option value="in-stock">
              ✅ In Stock
            </option>

            <option value="out-of-stock">
              ❌ Out of Stock
            </option>
          </select>
        </div>

        <div
          style={{
            marginTop: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Showing{" "}
            <strong>
              {
                filteredProducts.length
              }
            </strong>{" "}
            of{" "}
            <strong>
              {products.length}
            </strong>{" "}
            products
          </div>

          {filtersActive && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              style={{
                background:
                  "#6b7280",
                color:
                  "#ffffff",
                border: "none",
                borderRadius:
                  "8px",
                padding:
                  "10px 18px",
                cursor:
                  "pointer",
                fontWeight: 600,
              }}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT LIST */}

      <ProductList
        products={
          filteredProducts
        }
        onDelete={
          handleDelete
        }
        onEdit={
          handleEdit
        }
        onView={(product) =>
          setViewingProduct(
            product
          )
        }
      />

    </AppShell>
  );
}

/*
============================================================
FILTER STYLE
============================================================
*/

const filterStyle: React.CSSProperties =
  {
    width: "100%",
    padding:
      "12px 14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    cursor: "pointer",
  };