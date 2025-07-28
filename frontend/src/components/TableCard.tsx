// components/TableCard.tsx
import { useEffect, useState } from "react";
import {
  Trash2,
  Gamepad2,
  Users,
  Play,
  Square,
  RotateCcw,
  Pause,
  ChevronDown,
} from "lucide-react";
import type { TableSession } from "../types/Table";
import type { Product } from "../types/Product";
import type { GamingConfig } from "../types/Gaming";
import { useProducts } from "../hooks/useProducts";

interface Props {
  table: TableSession;
  onStart: (config: GamingConfig) => void;
  onStop: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onReset: (id: string) => void;
  onAddProduct: (tableId: string, product: Product) => void;
  onRemoveProduct: (tableId: string, productId: string) => void;
  onConfigureTable: (tableId: string) => void;
  onDeleteTable: (tableId: string) => void;
  onUpdateTableName: (tableId: string, name: string) => void;
}

export function TableCard({
  table,
  onStop,
  onPause,
  onResume,
  onReset,
  onAddProduct,
  onRemoveProduct,
  onConfigureTable,
  onDeleteTable,
  onUpdateTableName,
}: Props) {
  const { products } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id || ""
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [liveTime, setLiveTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [livePrice, setLivePrice] = useState<number>(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    if (table.status === "active" && table.startTime && table.gamingConfig) {
      const interval = setInterval(() => {
        const now = Date.now();
        const currentSessionTime = now - table.startTime!;
        const totalElapsed = (table.pausedDuration || 0) + currentSessionTime;
        const totalSeconds = Math.floor(totalElapsed / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setLiveTime({ hours, minutes, seconds });

        const timePrice = Math.round(
          (totalElapsed / (1000 * 60 * 60)) * table.gamingConfig!.hourlyRate
        );
        const productTotal = (table.orderedProducts ?? []).reduce(
          (sum, p) => sum + p.price,
          0
        );
        setLivePrice(timePrice + productTotal);
      }, 1000);

      return () => clearInterval(interval);
    } else if (table.status === "paused" && table.pausedDuration) {
      const totalSeconds = Math.floor(table.pausedDuration / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setLiveTime({ hours, minutes, seconds });

      const timePrice = Math.round(
        (table.pausedDuration / (1000 * 60 * 60)) *
          (table.gamingConfig?.hourlyRate || 0)
      );
      const productTotal = (table.orderedProducts ?? []).reduce(
        (sum, p) => sum + p.price,
        0
      );
      setLivePrice(timePrice + productTotal);
    } else if (table.status === "done" && table.totalDuration) {
      setLiveTime(table.totalDuration);
      setLivePrice(table.totalPrice ?? 0);
    } else {
      setLiveTime({ hours: 0, minutes: 0, seconds: 0 });
      setLivePrice(table.totalPrice ?? 0);
    }
  }, [
    table.status,
    table.startTime,
    table.pausedDuration,
    table.orderedProducts,
    table.totalPrice,
    table.totalDuration,
    table.gamingConfig,
  ]);

  const groupedProducts = (table.orderedProducts || []).reduce(
    (acc: Record<string, { product: Product; count: number }>, p) => {
      if (acc[p.id]) {
        acc[p.id].count += 1;
      } else {
        acc[p.id] = { product: p, count: 1 };
      }
      return acc;
    },
    {}
  );

  const statusColor =
    table.status === "active"
      ? "text-green-400 border-green-400"
      : table.status === "paused"
      ? "text-orange-400 border-orange-400"
      : table.status === "done"
      ? "text-yellow-400 border-yellow-400"
      : "text-gray-300 border-gray-600";

  const getPSModelName = (model: string) => {
    switch (model) {
      case "ps3":
        return "PS3";
      case "ps4":
        return "PS4";
      case "ps5":
        return "PS5";
      default:
        return model;
    }
  };

  const getPSModelColor = (model: string) => {
    switch (model) {
      case "ps3":
        return "text-blue-400";
      case "ps4":
        return "text-purple-400";
      case "ps5":
        return "text-indigo-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "idle":
        return "Boşta";
      case "active":
        return "Aktif";
      case "paused":
        return "Duraklatıldı";
      case "done":
        return "Bitti";
      default:
        return status;
    }
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
    setEditingName(table.name || `Masa-${table.id}`);
  };

  const handleNameSave = () => {
    if (editingName.trim()) {
      onUpdateTableName(table.id, editingName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    setEditingName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      handleNameCancel();
    }
  };

  return (
    <div
      className={`bg-zinc-800 p-4 rounded-lg text-white w-[320px] shadow-md border-2 ${statusColor}`}
    >
      <div className="flex justify-between items-center mb-3">
        {isEditingName ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleNameSave}
            className="text-lg font-bold bg-zinc-700 text-white px-2 py-1 rounded border-none outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <h2
            className="text-lg font-bold cursor-pointer hover:text-blue-400 transition-colors"
            onDoubleClick={handleNameEdit}
            title="Çift tıklayarak düzenleyin"
          >
            {table.name || `Masa-${table.id}`}
          </h2>
        )}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full bg-zinc-700 uppercase ${
              table.status === "active"
                ? "text-green-400"
                : table.status === "paused"
                ? "text-orange-400"
                : table.status === "done"
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            {getStatusText(table.status)}
          </span>
          {table.status === "idle" && (
            <button
              onClick={() => onDeleteTable(table.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 rounded transition-colors"
              title="Masayı Sil"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Gaming Configuration Display */}
      {table.gamingConfig && (
        <div className="mb-3 p-2 bg-zinc-700 rounded text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2
                className={getPSModelColor(table.gamingConfig.psModel)}
                size={16}
              />
              <span className="font-medium">
                {getPSModelName(table.gamingConfig.psModel)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Users size={14} />
              <span>{table.gamingConfig.controllerCount} Kol</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {table.gamingConfig.hourlyRate} ₺/saat
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {table.status === "idle" && (
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 w-full rounded flex items-center justify-center gap-2 mb-2"
          onClick={() => onConfigureTable(table.id)}
        >
          <Play size={16} />
          Oturumu Başlat
        </button>
      )}

      {table.status === "active" && (
        <div className="flex gap-2 mb-3">
          <button
            className="bg-red-700 hover:bg-red-800 text-white flex-1 py-2 rounded flex items-center justify-center gap-1"
            onClick={() => onStop(table.id)}
          >
            <Square size={16} />
            Bitir
          </button>
          <button
            className="bg-orange-600 hover:bg-orange-700 text-white flex-1 py-2 rounded flex items-center justify-center gap-1"
            onClick={() => onPause(table.id)}
          >
            <Pause size={16} />
            Duraklat
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 py-2 rounded"
            onClick={() => {
              const selected = products.find((p) => p.id === selectedProductId);
              if (selected) onAddProduct(table.id, selected);
            }}
          >
            + Ürün
          </button>
        </div>
      )}

      {table.status === "paused" && (
        <div className="flex gap-2 mb-3">
          <button
            className="bg-green-600 hover:bg-green-700 text-white flex-1 py-2 rounded flex items-center justify-center gap-1"
            onClick={() => onResume(table.id)}
          >
            <Play size={16} />
            Devam Et
          </button>
          <button
            className="bg-red-700 hover:bg-red-800 text-white flex-1 py-2 rounded flex items-center justify-center gap-1"
            onClick={() => onStop(table.id)}
          >
            <Square size={16} />
            Bitir
          </button>
        </div>
      )}

      {table.status === "done" && (
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 w-full rounded mb-3 flex items-center justify-center gap-2"
          onClick={() => onReset(table.id)}
        >
          <RotateCcw size={16} />
          Yeni Müşteri
        </button>
      )}

      {/* Product Selection for Active Tables */}
      {table.status === "active" && products.length > 0 && (
        <div className="mb-3 relative">
          {/* Custom Dropdown Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm flex justify-between items-center hover:bg-zinc-600 transition-colors"
          >
            <span>
              {products.find((p) => p.id === selectedProductId)?.name ||
                "Ürün Seçin"}{" "}
              - {products.find((p) => p.id === selectedProductId)?.price || 0} ₺
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-zinc-700 border border-zinc-600 rounded shadow-lg max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 text-sm hover:bg-zinc-600 transition-colors ${
                    selectedProductId === product.id
                      ? "bg-zinc-600 text-blue-400"
                      : "text-white"
                  }`}
                >
                  {product.name} - {product.price} ₺
                </button>
              ))}
            </div>
          )}

          {/* Backdrop to close dropdown */}
          {isDropdownOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}
        </div>
      )}

      {/* Time and Price Display */}
      {table.startTime && (
        <div className="text-xs text-gray-300 mb-3 space-y-1">
          <p>Başlangıç: {new Date(table.startTime).toLocaleTimeString()}</p>
          <p>
            Süre: {liveTime.hours > 0 && `${liveTime.hours}h `}
            {liveTime.minutes}m {liveTime.seconds}s
            {table.status === "paused" && (
              <span className="text-orange-400 ml-2">(Duraklatıldı)</span>
            )}
          </p>
          <p className="font-semibold text-green-400">Toplam: {livePrice} ₺</p>
        </div>
      )}

      {/* Orders List */}
      {table.status !== "idle" && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
            🧾 Siparişler
          </h3>
          <div className="bg-zinc-700 rounded p-2 text-sm">
            {Object.keys(groupedProducts).length === 0 ? (
              <p className="text-gray-400 text-center py-2">
                Henüz sipariş yok
              </p>
            ) : (
              <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-400 scroll-smooth">
                <div className="space-y-1 pr-1">
                  {Object.values(groupedProducts).map(({ product, count }) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center py-1 px-1 hover:bg-zinc-600 rounded transition-colors"
                    >
                      <span className="text-xs">
                        {count}x {product.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-semibold text-xs">
                          {product.price * count} ₺
                        </span>
                        <button
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-900/20 transition-colors"
                          onClick={() => onRemoveProduct(table.id, product.id)}
                          title="Ürünü sil"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
