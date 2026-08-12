import { navigationItems } from "./Navigation";
import { theme } from "@/constants/theme";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "270px",
        background: theme.colors.primary,
        color: theme.colors.white,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "24px",
          }}
        >
          🟣 VASCS
        </h2>

        <p
          style={{
            marginTop: "8px",
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          Enterprise Edition
        </p>
      </div>

      {/* Navigation */}
      <nav
        style={{
          padding: "20px 12px",
          flex: 1,
        }}
      >
        {navigationItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              marginBottom: "8px",
              borderRadius: theme.radius.md,
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            <span style={{ fontSize: "22px" }}>
              {item.icon}
            </span>

            <span>{item.title}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          fontSize: "13px",
          opacity: 0.8,
        }}
      >
        Version 1.0
      </div>
    </aside>
  );
}