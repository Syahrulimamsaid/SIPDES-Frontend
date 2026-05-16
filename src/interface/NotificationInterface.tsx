
import { LocationAccess } from "./LocationAccessInterface";

export interface Notification {
  userId: string;
  created_at?: string;
  lat?: number;
  lng?: number;
  type:  "masuk" | "pulang";
  status: "hadir" | "masuk" | "terlambat" | "alpa" | "cuti"| "pulang" | "";
  location_access?: LocationAccess;
}