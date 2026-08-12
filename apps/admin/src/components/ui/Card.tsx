import { ReactNode } from "react";
import { theme } from "@/constants/theme";

type CardProps = {
  title?: string;
  children: ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div
      style={{
        background: theme.colors.white,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.card,
        padding: "20px",
      }}
    >
      {title && (
        <h3
          style={{
            marginBottom: "15px",
            color: theme.colors.text,
          }}
        >
          {title}
        </h3>
      )}

      {children}
    </div>
  );
}