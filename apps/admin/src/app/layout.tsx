import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VASCS Enterprise",
  description: "Veeransh AI Saree Catalogue Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f5f6fa",
          fontFamily: "Segoe UI, Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}