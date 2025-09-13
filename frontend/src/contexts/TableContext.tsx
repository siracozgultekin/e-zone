// contexts/TableContext.tsx
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { TableSession } from "../types/Table";
import type { GamingConfig } from "../types/Gaming";
import type { Product } from "../types/Product";

interface TableContextType {
  tables: TableSession[];
  configureTable: (tableId: string) => void;
  startWithConfig: (tableId: string, config: GamingConfig) => void;
  stopTable: (tableId: string) => void;
  pauseTable: (tableId: string) => void;
  resumeTable: (tableId: string) => void;
  resetTable: (tableId: string) => void;
  addProduct: (tableId: string, product: Product) => void;
  removeProduct: (tableId: string, productId: string) => void;
  addTable: () => void;
  deleteTable: (tableId: string) => void;
  updateTableName: (tableId: string, name: string) => void;
  transferTable: (fromTableId: string, toTableId: string) => void;
  configModal: {
    isOpen: boolean;
    tableId: string;
  };
  setConfigModal: (modal: { isOpen: boolean; tableId: string }) => void;
}

type TableAction =
  | { type: "CONFIGURE_TABLE"; payload: string }
  | {
      type: "START_WITH_CONFIG";
      payload: { tableId: string; config: GamingConfig };
    }
  | { type: "STOP_TABLE"; payload: string }
  | { type: "PAUSE_TABLE"; payload: string }
  | { type: "RESUME_TABLE"; payload: string }
  | { type: "RESET_TABLE"; payload: string }
  | { type: "ADD_PRODUCT"; payload: { tableId: string; product: Product } }
  | { type: "REMOVE_PRODUCT"; payload: { tableId: string; productId: string } }
  | { type: "ADD_TABLE" }
  | { type: "DELETE_TABLE"; payload: string }
  | { type: "UPDATE_TABLE_NAME"; payload: { tableId: string; name: string } }
  | { type: "SET_CONFIG_MODAL"; payload: { isOpen: boolean; tableId: string } }
  | {
      type: "TRANSFER_TABLE";
      payload: { fromTableId: string; toTableId: string };
    }
  | { type: "LOAD_TABLES"; payload: TableSession[] };

const TableContext = createContext<TableContextType | undefined>(undefined);

const STORAGE_KEY = "gaming_tables_data";

// Varsayılan masa listesini oluştur
function getInitialTables(): TableSession[] {
  return [
    {
      id: "1",
      status: "idle",
      orderedProducts: [],
      totalPrice: 0,
    },
    {
      id: "2",
      status: "idle",
      orderedProducts: [],
      totalPrice: 0,
    },
    {
      id: "3",
      status: "idle",
      orderedProducts: [],
      totalPrice: 0,
    },
    {
      id: "4",
      status: "idle",
      orderedProducts: [],
      totalPrice: 0,
    },
    {
      id: "5",
      status: "idle",
      orderedProducts: [],
      totalPrice: 0,
    },
    {
      id: "6",
      status: "idle",
      orderedProducts: [],
      totalPrice: 0,
    },
    {
      id: "7",
      status: "idle",
      orderedProducts: [],
      totalPrice: 0,
    },
    {
      id: "8",
      status: "idle",
      orderedProducts: [],
      totalPrice: 0,
    },
  ];
}

function tableReducer(
  state: TableSession[],
  action: TableAction
): TableSession[] {
  switch (action.type) {
    case "LOAD_TABLES":
      return action.payload;

    case "START_WITH_CONFIG":
      return state.map((table) =>
        table.id === action.payload.tableId
          ? {
              ...table,
              status: "active",
              startTime: Date.now(),
              gamingConfig: action.payload.config,
              pausedAt: undefined,
              pausedDuration: undefined,
              totalDuration: undefined,
              totalPrice: 0,
              orderedProducts: [],
              // Clear any previously transferred amount so a new session doesn't
              // start with an existing balance from a previous transfer.
              transferredAmount: undefined,
            }
          : table
      );

    case "PAUSE_TABLE":
      return state.map((t) => {
        if (t.id === action.payload && t.status === "active" && t.startTime) {
          const currentTime = Date.now();
          const currentSessionTime = currentTime - t.startTime;
          const totalPausedTime = (t.pausedDuration || 0) + currentSessionTime;

          return {
            ...t,
            status: "paused",
            pausedAt: currentTime,
            pausedDuration: totalPausedTime,
          };
        }
        return t;
      });

    case "RESUME_TABLE":
      return state.map((t) => {
        if (t.id === action.payload && t.status === "paused" && t.pausedAt) {
          return {
            ...t,
            status: "active",
            startTime: Date.now(),
            pausedAt: undefined,
          };
        }
        return t;
      });

    case "STOP_TABLE":
      return state.map((t) => {
        if (t.id === action.payload && t.startTime && t.gamingConfig) {
          const endTime = Date.now();
          let totalDurationMs;

          if (t.status === "paused") {
            // Eğer masa duraklatılmış durumda bitiriliyor ise, sadece pausedDuration kullan
            totalDurationMs = t.pausedDuration || 0;
          } else {
            // Eğer masa aktif durumda bitiriliyor ise, pausedDuration + current session
            totalDurationMs = (t.pausedDuration || 0) + (endTime - t.startTime);
          }

          const totalSeconds = Math.floor(totalDurationMs / 1000);

          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          const durationMin = Math.floor(totalDurationMs / 60000);
          const durationHour = totalDurationMs / (1000 * 60 * 60);
          const timePrice = Math.round(
            durationHour * t.gamingConfig.hourlyRate
          );

          const productTotal = (t.orderedProducts ?? []).reduce(
            (sum, p) => sum + p.price,
            0
          );

          return {
            ...t,
            status: "done",
            endTime,
            totalMinutes: durationMin,
            totalPrice: productTotal + timePrice,
            totalDuration: { hours, minutes, seconds },
          };
        }
        return t;
      });

    case "TRANSFER_TABLE":
      // Transfer the entire current total (timePrice + productTotal + any previous transferredAmount)
      // First, compute the finalized source table
      const now = Date.now();
      const updated = state.map((t) => {
        if (t.id === action.payload.fromTableId) {
          let totalDurationMs = 0;
          if (t.status === "paused") {
            totalDurationMs = t.pausedDuration || 0;
          } else if (t.startTime) {
            totalDurationMs = (t.pausedDuration || 0) + (now - t.startTime);
          }

          const totalSeconds = Math.floor(totalDurationMs / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          const durationHour = totalDurationMs / (1000 * 60 * 60);
          const hourlyRate = t.gamingConfig?.hourlyRate || 0;
          const timePrice = Math.round(durationHour * hourlyRate);

          const productTotal = (t.orderedProducts ?? []).reduce(
            (sum, p) => sum + p.price,
            0
          );

          const existingTransferred = t.transferredAmount || 0;
          const finalTotal = timePrice + productTotal + existingTransferred;

          return {
            ...t,
            status: "done" as const,
            endTime: now,
            totalMinutes: Math.floor(totalDurationMs / 60000),
            totalPrice: finalTotal,
            totalDuration: { hours, minutes, seconds },
            // After transferring this table's balance to another table, clear
            // the transferredAmount on the source so it doesn't remain and
            // cause duplicate/leftover charges later.
            transferredAmount: undefined,
          } as TableSession;
        }
        return t;
      });

      // Then, add that total to destination's transferredAmount
      const fromTableFinal = updated.find(
        (s) => s.id === action.payload.fromTableId
      );
      const amountToTransfer = fromTableFinal?.totalPrice ?? 0;
      console.debug("TRANSFER_TABLE: computed amountToTransfer", {
        from: action.payload.fromTableId,
        to: action.payload.toTableId,
        amountToTransfer,
        fromTableFinal,
      });

      const finalState = updated.map((t) => {
        if (t.id === action.payload.toTableId) {
          return {
            ...t,
            transferredAmount: (t.transferredAmount || 0) + amountToTransfer,
          } as TableSession;
        }
        return t;
      });

      return finalState as TableSession[];

    case "RESET_TABLE":
      return state.map((t) =>
        t.id === action.payload
          ? {
              ...t,
              status: "idle",
              startTime: undefined,
              endTime: undefined,
              pausedAt: undefined,
              pausedDuration: undefined,
              totalMinutes: 0,
              totalPrice: 0,
              totalDuration: undefined,
              orderedProducts: [],
              gamingConfig: undefined,
              // Ensure any transferred balance is cleared when resetting the table
              transferredAmount: undefined,
            }
          : t
      );

    case "ADD_PRODUCT":
      return state.map((t) => {
        if (t.id === action.payload.tableId) {
          const updatedProducts = [
            ...(t.orderedProducts || []),
            action.payload.product,
          ];
          const productTotal = updatedProducts.reduce(
            (sum, p) => sum + p.price,
            0
          );
          const hourlyRate = t.gamingConfig?.hourlyRate || 100;
          const timePrice =
            t.startTime && t.endTime
              ? Math.round(
                  ((t.endTime - t.startTime) / (1000 * 60 * 60)) * hourlyRate
                )
              : 0;

          return {
            ...t,
            orderedProducts: updatedProducts,
            totalPrice: timePrice + productTotal,
          };
        }
        return t;
      });

    case "REMOVE_PRODUCT":
      return state.map((t) => {
        if (t.id === action.payload.tableId) {
          // Sadece 1 adet silme mantığı - ilk bulunan ürünü sil
          const updatedProducts = [...(t.orderedProducts ?? [])];
          const productIndex = updatedProducts.findIndex(
            (p) => p.id === action.payload.productId
          );

          if (productIndex !== -1) {
            updatedProducts.splice(productIndex, 1);
          }

          const productTotal = updatedProducts.reduce(
            (sum, p) => sum + p.price,
            0
          );
          const now = Date.now();
          const effectiveEndTime = t.endTime ?? now;
          const hourlyRate = t.gamingConfig?.hourlyRate || 100;
          const timePrice = t.startTime
            ? Math.round(
                ((effectiveEndTime - t.startTime) / (1000 * 60 * 60)) *
                  hourlyRate
              )
            : 0;

          return {
            ...t,
            orderedProducts: updatedProducts,
            totalPrice: timePrice + productTotal,
          };
        }
        return t;
      });

    case "ADD_TABLE":
      // Mevcut masalardan en büyük ID'yi bul, yoksa 0'dan başla
      const existingIds = state
        .map((t) => parseInt(t.id))
        .filter((id) => !isNaN(id));
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
      const newTableId = String(maxId + 1);

      const newTable: TableSession = {
        id: newTableId,
        status: "idle",
        orderedProducts: [],
        totalPrice: 0,
      };
      return [...state, newTable];

    case "DELETE_TABLE":
      return state.filter((t) => t.id !== action.payload);

    case "UPDATE_TABLE_NAME":
      return state.map((t) =>
        t.id === action.payload.tableId
          ? { ...t, name: action.payload.name }
          : t
      );

    default:
      return state;
  }
}

export function TableProvider({ children }: { children: ReactNode }) {
  const [tables, dispatch] = useReducer(tableReducer, []);
  const [configModal, setConfigModalState] = useState<{
    isOpen: boolean;
    tableId: string;
  }>({
    isOpen: false,
    tableId: "",
  });

  // localStorage'dan veri yükle
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    console.log("Loading from localStorage:", savedData);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Parsed data:", parsedData);
        dispatch({ type: "LOAD_TABLES", payload: parsedData });
      } catch (error) {
        console.error("Error loading table data:", error);
        // Hata durumunda varsayılan tabloları yükle
        const initialTables = getInitialTables();
        console.log("Loading initial tables due to error:", initialTables);
        dispatch({ type: "LOAD_TABLES", payload: initialTables });
      }
    } else {
      // localStorage boşsa varsayılan tabloları yükle
      const initialTables = getInitialTables();
      console.log(
        "Loading initial tables (localStorage empty):",
        initialTables
      );
      dispatch({ type: "LOAD_TABLES", payload: initialTables });
    }
  }, []);

  // Her değişiklikte localStorage'a kaydet (sadece tables yüklendikten sonra)
  useEffect(() => {
    // İlk yüklemede boş array kaydetmeyi önle
    if (tables.length > 0) {
      console.log("Saving tables to localStorage:", tables);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
    }
  }, [tables]);

  const configureTable = (tableId: string) => {
    setConfigModalState({ isOpen: true, tableId });
  };

  const startWithConfig = (tableId: string, config: GamingConfig) => {
    dispatch({ type: "START_WITH_CONFIG", payload: { tableId, config } });
    setConfigModalState({ isOpen: false, tableId: "" });
  };

  const pauseTable = (tableId: string) => {
    dispatch({ type: "PAUSE_TABLE", payload: tableId });
  };

  const resumeTable = (tableId: string) => {
    dispatch({ type: "RESUME_TABLE", payload: tableId });
  };

  const stopTable = (tableId: string) => {
    dispatch({ type: "STOP_TABLE", payload: tableId });
  };

  const resetTable = (tableId: string) => {
    dispatch({ type: "RESET_TABLE", payload: tableId });
  };

  const addProduct = (tableId: string, product: Product) => {
    dispatch({ type: "ADD_PRODUCT", payload: { tableId, product } });
  };

  const removeProduct = (tableId: string, productId: string) => {
    dispatch({ type: "REMOVE_PRODUCT", payload: { tableId, productId } });
  };

  const addTable = () => {
    dispatch({ type: "ADD_TABLE" });
  };

  const deleteTable = (tableId: string) => {
    dispatch({ type: "DELETE_TABLE", payload: tableId });
  };

  const updateTableName = (tableId: string, name: string) => {
    dispatch({ type: "UPDATE_TABLE_NAME", payload: { tableId, name } });
  };

  const transferTable = (fromTableId: string, toTableId: string) => {
    if (fromTableId === toTableId) return;
    console.debug("transferTable called", { fromTableId, toTableId });
    dispatch({ type: "TRANSFER_TABLE", payload: { fromTableId, toTableId } });
  };

  const setConfigModal = (modal: { isOpen: boolean; tableId: string }) => {
    setConfigModalState(modal);
  };

  return (
    <TableContext.Provider
      value={{
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
        transferTable,
        configModal,
        setConfigModal,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
}
