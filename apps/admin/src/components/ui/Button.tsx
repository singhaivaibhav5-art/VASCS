type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: "#7A003C",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 18px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "14px",
      }}
    >
      {children}
    </button>
  );
}