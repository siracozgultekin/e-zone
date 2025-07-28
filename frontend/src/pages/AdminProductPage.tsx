import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/Product";
import { nanoid } from "nanoid";
import { Pencil, Trash2, Coffee } from "lucide-react";

export function AdminProductPage() {
  const { products, addProduct, updateProduct, removeProduct } = useProducts();
  const [form, setForm] = useState<Product>({ id: "", name: "", price: 0 });
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };
  const handleSubmit = () => {
    if (!form.name || form.price <= 0) return;

    if (editMode) {
      updateProduct(form);
    } else {
      addProduct({ ...form, id: nanoid() });
    }

    setForm({ id: "", name: "", price: 0 });
    setEditMode(false);
  };
  const handleEdit = (p: Product) => {
    setForm(p);
    setEditMode(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Coffee className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Ürün Yönetimi
            </h2>
            <p className="text-gray-400 text-sm">
              Kafe ürünlerinizi ve fiyatlarını yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm border border-zinc-600/50 rounded-2xl p-6 mb-8 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {editMode ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            name="name"
            placeholder="Ürün adı girin..."
            value={form.name}
            onChange={handleChange}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-700/80 border border-zinc-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
          <input
            name="price"
            type="number"
            placeholder="Fiyat"
            value={form.price}
            onChange={handleChange}
            className="w-full sm:w-32 px-4 py-3 rounded-xl bg-zinc-700/80 border border-zinc-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-105"
          >
            {editMode ? "Güncelle" : "Ürün Ekle"}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-gradient-to-br from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm border border-zinc-600/30 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-zinc-500/50"
          >
            {/* Product Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Coffee className="text-white" size={20} />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 hover:text-blue-300 transition-all"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-lg leading-tight">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  ₺{product.price.toFixed(2)}
                </span>
                <div className="text-xs text-gray-400 bg-zinc-700/50 px-2 py-1 rounded-lg">
                  ID: {product.id.slice(-4)}
                </div>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="w-20 h-20 bg-zinc-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Coffee className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-400 text-lg mb-2">Henüz ürün bulunmuyor</p>
            <p className="text-gray-500 text-sm">
              Yukarıdaki formu kullanarak ilk ürününüzü ekleyin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
