import { theme } from "@/constants/theme";

export default function Header() {
  return (
    <header
      style={{
        height: "72px",
        background: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
      }}
    >
      {/* Left Side */}
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "24px",
            color: theme.colors.text,
          }}
        >
          Enterprise Dashboard
        </h2>

        <small
          style={{
            color: "#777",
          }}
        >
          Veeransh AI Saree Catalogue Studio
        </small>
      </div>

      {/* Right Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          style={{
            padding: "10px 15px",
            width: "220px",
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            outline: "none",
          }}
        />

        <span style={{ fontSize: "22px", cursor: "pointer" }}>
          🔔
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: theme.colors.primary,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            V
          </div>

          <div>
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              Vaibhav
            </div>

            <small
              style={{
                color: "#777",
              }}
            >
              Administrator
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}