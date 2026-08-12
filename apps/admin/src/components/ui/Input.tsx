import { theme } from "@/constants/theme";

type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function Input({
  label,
  placeholder,
  type = "text",
  value = "",
  onChange,
}: InputProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <label
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: theme.colors.text,
        }}
      >
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px",
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.border}`,
          outline: "none",
          fontSize: "14px",
        }}
      />
    </div>
  );
}