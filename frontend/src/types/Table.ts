//types/Table.ts
import type { GamingConfig } from "./Gaming";
import type { Product } from "./Product";

 

export type TableStatus = 'idle' | 'active' | 'paused' | 'done';

// types/Table.ts
// types/Table.ts - TableSession interface'ini güncelleyin

export interface TableSession {
  id: string;
  name?: string; // Özelleştirilebilir masa ismi
  status: "idle" | "active" | "paused" | "done";
  startTime?: number;
  endTime?: number;
  pausedAt?: number;        // Duraklatıldığı zaman
  pausedDuration?: number;  // Toplam duraklatma süresi
  totalMinutes?: number;
  totalPrice?: number;
  totalDuration?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  gamingConfig?: GamingConfig;
  orderedProducts?: Product[];
  // Toplam olarak başka masalardan aktarılan ücretleri tutar
  transferredAmount?: number;
}
