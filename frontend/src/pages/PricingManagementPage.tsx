// pages/PricingManagementPage.tsx
import { useState } from "react";
import { usePricing } from "../hooks/usePricing";
import { Gamepad2, Users, Edit3, DollarSign, Clock, Info } from "lucide-react";
import type { PricingRule } from "../types/Gaming";

export function PricingManagementPage() {
  const { pricingRules, updatePricing } = usePricing();
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [tempRate, setTempRate] = useState<number>(0);

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setTempRate(rule.hourlyRate);
  };

  const handleSave = () => {
    if (editingRule && tempRate > 0) {
      updatePricing({ ...editingRule, hourlyRate: tempRate });
      setEditingRule(null);
      setTempRate(0);
    }
  };

  const handleCancel = () => {
    setEditingRule(null);
    setTempRate(0);
  };

  const getPSModelName = (model: string) => {
    switch (model) {
      case "ps3":
        return "PlayStation 3";
      case "ps4":
        return "PlayStation 4";
      case "ps5":
        return "PlayStation 5";
      default:
        return model;
    }
  };

  const getPSModelBgColor = (model: string) => {
    switch (model) {
      case "ps3":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "ps4":
        return "bg-gradient-to-br from-purple-500 to-purple-600";
      case "ps5":
        return "bg-gradient-to-br from-indigo-500 to-indigo-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Fiyatlandırma Yönetimi
            </h2>
            <p className="text-gray-400 text-sm">
              PlayStation modellerine ve kol sayısına göre saatlik ücretleri
              yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {pricingRules.map((rule) => (
          <div
            key={rule.id}
            className="group relative bg-gradient-to-br from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm border border-zinc-600/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-zinc-500/50"
          >
            {/* PS Model Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${getPSModelBgColor(
                    rule.psModel
                  )} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Gamepad2 className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {getPSModelName(rule.psModel)}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Users size={14} />
                    <span>{rule.controllerCount} Kol</span>
                  </div>
                </div>
              </div>
            </div>

            {editingRule?.id === rule.id ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="bg-zinc-700/50 rounded-xl p-4 border border-zinc-600/50">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Saatlik Ücret (₺)
                  </label>
                  <input
                    type="number"
                    value={tempRate}
                    onChange={(e) => setTempRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-zinc-600/50 border border-zinc-500/50 rounded-xl text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                    min="0"
                    step="5"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-105"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              /* Display Mode */
              <div className="space-y-4">
                <div className="text-center bg-gradient-to-br from-zinc-700/30 to-zinc-800/30 rounded-xl p-4 border border-zinc-600/20">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-1">
                    ₺{rule.hourlyRate}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                    <Clock size={14} />
                    saatlik ücret
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(rule)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Düzenle
                </button>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm border border-zinc-600/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Info className="text-white" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Fiyatlandırma Bilgileri
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-blue-400" size={16} />
              <span className="font-medium text-gray-300">
                Saat Bazlı Hesaplama
              </span>
            </div>
            <p className="text-gray-400">
              Fiyatlar saat bazında hesaplanır ve dakika hesaplaması otomatik
              yapılır
            </p>
          </div>

          <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-400" size={16} />
              <span className="font-medium text-gray-300">Ürün Fiyatları</span>
            </div>
            <p className="text-gray-400">
              Kafe ürünlerinin fiyatları oyun ücretine ayrıca eklenir
            </p>
          </div>

          <div className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/20">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="text-purple-400" size={16} />
              <span className="font-medium text-gray-300">Model Bazlı</span>
            </div>
            <p className="text-gray-400">
              Her PlayStation modeli ve kol sayısı için farklı fiyat
              belirleyebilirsiniz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
