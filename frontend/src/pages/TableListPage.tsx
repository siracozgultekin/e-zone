// pages/TableListPage.tsx
import { TableCard } from "../components/TableCard";
import { TableConfigModal } from "../components/TableConfigModal";
import { useTable } from "../contexts/TableContext";
import type { GamingConfig } from "../types/Gaming";
import { LayoutDashboard, Plus } from "lucide-react";

export function TableListPage() {
  const {
    tables,
    configureTable,
    startWithConfig,
    stopTable,
    pauseTable,
    resumeTable,
    resetTable,
    addProduct,
    removeProduct,
    addTable,
    deleteTable,
    updateTableName,
    configModal,
    setConfigModal,
  } = useTable();

  const onStartWithConfig = (config: GamingConfig) => {
    startWithConfig(configModal.tableId, config);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Gaming Masaları
              </h1>
              <p className="text-gray-400 text-sm">
                PlayStation konsollarınızı yönetin ve oyun seanslarını takip
                edin
              </p>
            </div>
          </div>

          {/* Masa Yönetim Butonları */}
          <div className="flex gap-3">
            <button
              onClick={addTable}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Masa Ekle
            </button>

            {/* Debug: localStorage temizleme butonu */}
            <button
              onClick={() => {
                localStorage.removeItem("gaming_tables_data");
                window.location.reload();
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-xs"
            >
              🗑️ Reset
            </button>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onStart={onStartWithConfig}
            onStop={stopTable}
            onPause={pauseTable}
            onResume={resumeTable}
            onReset={resetTable}
            onAddProduct={addProduct}
            onRemoveProduct={removeProduct}
            onConfigureTable={configureTable}
            onDeleteTable={deleteTable}
            onUpdateTableName={updateTableName}
          />
        ))}
      </div>

      <TableConfigModal
        isOpen={configModal.isOpen}
        onClose={() => setConfigModal({ isOpen: false, tableId: "" })}
        onConfirm={onStartWithConfig}
      />
    </div>
  );
}
