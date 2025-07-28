// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#1e1e1e",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        borderBottom: "1px solid #444",
      }}
    >
      <Link
        to="/"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        Ana Sayfa
      </Link>
      <Link
        to="/products"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        Ürünleri Yönet
      </Link>
    </nav>
  );
}
