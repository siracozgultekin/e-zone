// components/TableConfigModal.tsx
import { useState } from "react";
import { X } from "lucide-react";
import type { PSModel, ControllerCount, GamingConfig } from "../types/Gaming";
import { usePricing } from "../hooks/usePricing";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: GamingConfig) => void;
}

export function TableConfigModal({ isOpen, onClose, onConfirm }: Props) {
  const { getHourlyRate } = usePricing();
  const [psModel, setPsModel] = useState<PSModel>("ps4");
  const [controllerCount, setControllerCount] = useState<ControllerCount>(2);

  const currentRate = getHourlyRate(psModel, controllerCount);

  const handleConfirm = () => {
    const config: GamingConfig = {
      psModel,
      controllerCount,
      hourlyRate: currentRate,
    };
    onConfirm(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg w-96 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Masa Konfigürasyonu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              PlayStation Modeli
            </label>
            <select
              value={psModel}
              onChange={(e) => setPsModel(e.target.value as PSModel)}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
            >
              <option value="ps3">PlayStation 3</option>
              <option value="ps4">PlayStation 4</option>
              <option value="ps5">PlayStation 5</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kol Sayısı</label>
            <select
              value={controllerCount}
              onChange={(e) =>
                setControllerCount(Number(e.target.value) as ControllerCount)
              }
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
            >
              <option value={2}>2 Kol</option>
              <option value={4}>4 Kol</option>
            </select>
          </div>

          <div className="bg-zinc-700 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Saatlik Ücret:</span>
              <span className="text-lg font-bold text-green-400">
                {currentRate} ₺/saat
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
          >
            İptal
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Başlat
          </button>
        </div>
      </div>
    </div>
  );
}
