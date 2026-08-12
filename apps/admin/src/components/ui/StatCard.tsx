import Card from "./Card";

type StatCardProps = {
  icon: string;
  title: string;
  value: string;
  change?: string;
};

export default function StatCard({
  icon,
  title,
  value,
  change,
}: StatCardProps) {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <div
          style={{
            fontSize: "40px",
          }}
        >
          {icon}
        </div>

        <div>
          <div
            style={{
              fontSize: "14px",
              color: "#666",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {value}
          </div>
          {change && (
  <div
    style={{
      color: "#16A34A",
      fontSize: "13px",
      marginTop: "6px",
    }}
  >
    {change}
  </div>
)}
        </div>
      </div>
    </Card>
  );
}