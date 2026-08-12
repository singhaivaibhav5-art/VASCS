"use client";

type ProductPricingProps = {
  data: {
    purchasePrice: string;
    wholesalePrice: string;
    retailPrice: string;
    mrp: string;
    discount: string;
  };

  onChange: (field: string, value: string) => void;
};

export default function ProductPricing({
  data,
  onChange,
}: ProductPricingProps) {
  const handleChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        background: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <h3
        style={{
          margin: "0 0 20px 0",
          fontSize: "20px",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        💰 Product Pricing
      </h3>

      {/* =====================================================
          PRICING GRID
          ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        {/* PURCHASE PRICE */}

        <PricingField
          label="Purchase Price"
          placeholder="0.00"
          value={data.purchasePrice}
          onChange={handleChange("purchasePrice")}
        />

        {/* WHOLESALE PRICE */}

        <PricingField
          label="Wholesale Price"
          placeholder="0.00"
          value={data.wholesalePrice}
          onChange={handleChange("wholesalePrice")}
        />

        {/* RETAIL PRICE */}

        <PricingField
          label="Retail Price"
          placeholder="0.00"
          value={data.retailPrice}
          onChange={handleChange("retailPrice")}
        />

        {/* MRP */}

        <PricingField
          label="MRP"
          placeholder="0.00"
          value={data.mrp}
          onChange={handleChange("mrp")}
        />

        {/* DISCOUNT */}

        <PricingField
          label="Discount %"
          placeholder="0"
          value={data.discount}
          onChange={handleChange("discount")}
        />
      </div>
    </div>
  );
}

/* ============================================================
   PRICING FIELD
   ============================================================ */

function PricingField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* LABEL */}

      <label
        style={{
          display: "block",
          marginBottom: "7px",
          fontSize: "14px",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        {label}
      </label>

      {/* INPUT */}

      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          width: "100%",
          height: "44px",
          padding: "0 12px",
          border:
            "1px solid #d1d5db",
          borderRadius: "8px",
          background: "#ffffff",
          color: "#111827",
          fontSize: "15px",
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor =
            "#2563eb";
          event.currentTarget.style.boxShadow =
            "0 0 0 3px rgba(37, 99, 235, 0.10)";
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor =
            "#d1d5db";
          event.currentTarget.style.boxShadow =
            "none";
        }}
      />
    </div>
  );
}