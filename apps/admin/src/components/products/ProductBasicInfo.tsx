"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

type ProductBasicInfoProps = {
  data: {
    name: string;
    sku: string;
    barcode: string;
    category: string;
    brand: string;
    fabric: string;
    colour: string;
    size: string;
    gst: string;
    hsn: string;
  };

  onChange: (field: string, value: string) => void;
};

export default function ProductBasicInfo({
  data,
  onChange,
}: ProductBasicInfoProps) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        background: "#ffffff",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "20px",
          fontSize: "20px",
          fontWeight: 700,
        }}
      >
        📦 Product Information
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {/* PRODUCT NAME */}

        <Input
          label="Product Name"
          placeholder="Enter Product Name"
          value={data.name}
          onChange={(value) =>
            onChange("name", value)
          }
        />

        {/* SKU */}

        <Input
          label="SKU"
          placeholder="Auto Generated"
          value={data.sku}
          onChange={(value) =>
            onChange("sku", value)
          }
        />

        {/* BARCODE */}

        <Input
          label="Barcode"
          placeholder="Auto Generated"
          value={data.barcode}
          onChange={(value) =>
            onChange("barcode", value)
          }
        />

        {/* CATEGORY */}

        <Select
          label="Category"
          value={data.category}
          options={[
            "Banarasi",
            "Kanjivaram",
            "Chanderi",
            "Chiffon",
            "Georgette",
            "Cotton",
            "Silk",
          ]}
          onChange={(value) =>
            onChange("category", value)
          }
        />

        {/* BRAND */}

        <Input
          label="Brand"
          placeholder="Enter Brand"
          value={data.brand}
          onChange={(value) =>
            onChange("brand", value)
          }
        />

        {/* FABRIC */}

        <Select
          label="Fabric"
          value={data.fabric}
          options={[
            "Pure Silk",
            "Art Silk",
            "Cotton",
            "Georgette",
            "Chiffon",
            "Crepe",
            "Organza",
          ]}
          onChange={(value) =>
            onChange("fabric", value)
          }
        />

        {/* COLOUR */}

        <Select
          label="Colour"
          value={data.colour}
          options={[
            "Red",
            "Maroon",
            "Pink",
            "Blue",
            "Green",
            "Yellow",
            "Black",
            "White",
            "Golden",
          ]}
          onChange={(value) =>
            onChange("colour", value)
          }
        />

        {/* SIZE */}

        <Select
          label="Size"
          value={data.size}
          options={[
            "5.5 Meter",
            "6 Meter",
            "6.3 Meter",
            "8 Meter",
            "9 Meter",
          ]}
          onChange={(value) =>
            onChange("size", value)
          }
        />

        {/* GST */}

        <Select
          label="GST %"
          value={data.gst}
          options={[
            "0%",
            "5%",
            "12%",
            "18%",
            "28%",
          ]}
          onChange={(value) =>
            onChange("gst", value)
          }
        />

        {/* HSN */}

        <Input
          label="HSN Code"
          placeholder="Enter HSN Code"
          value={data.hsn}
          onChange={(value) =>
            onChange("hsn", value)
          }
        />
      </div>
    </div>
  );
}