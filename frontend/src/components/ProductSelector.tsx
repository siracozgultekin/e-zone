// components/ProductSelector.tsx
import { useState } from "react";
import type { Product } from "../types/Product";
import { defaultProducts } from "../data/products";

interface Props {
  onAddProduct: (product: Product) => void;
}

export function ProductSelector({ onAddProduct }: Props) {
  const [selectedId, setSelectedId] = useState<string>(
    defaultProducts[0]?.id || ""
  );

  const handleAdd = () => {
    const selected = defaultProducts.find((p) => p.id === selectedId);
    if (selected) {
      onAddProduct(selected);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{ marginRight: 8 }}
      >
        {defaultProducts.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} - {p.price} ₺
          </option>
        ))}
      </select>
      <button onClick={handleAdd}>Ekle</button>
    </div>
  );
}
