import { User } from "./UserInterface";
import { LocationAccess } from "./LocationAccessInterface";

export interface Presence {
  id: string;
  userId: string;
  locationId: string;

  date?: string;
  in?: string;
  out?: string;

  in_lat?: number;
  in_long?: number;
  out_lat?: number;
  out_long?: number;
  status: "hadir" | "masuk" | "terlambat" | "alpa" | "cuti" | "pulang" | "libur" | "";

  user?: User;
  location_access?: LocationAccess;
}

export interface PresenceCreate {
  lat?: number;
  lng?: number;
  locationAccessId: string;
}

export interface PresenceUpdate {
  id: string;
  in: string;
  out: string;
  status: "hadir" | "masuk" | "terlambat" | "alpa" | "cuti" | "pulang" | "";
}

export interface PresenceResponse {
  userId: string;
  lat: number;
  lng: number;
  location_access: {
    id: string;
    description: string;
    location: {
      name: string;
    };
  };
  type: "masuk" | "pulang";
  status: "masuk" | "pulang";
  created_at: Date;
}
