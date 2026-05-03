import { User } from "./UserInterface";
import { Location } from "./LocationInterface";

export interface Presence {
  id: string;
  userId: string;
  locationId: string;

  in?: string;
  out?: string;

  in_lat?: number;
  in_long?: number;
  out_lat?: number;
  out_long?: number;
  status: "hadir" | "masuk" | "terlambat" | "alpa" | "cuti"| "";

  User?: User;
  Location?: Location;
}

export interface PresenceCreate {
  lat?: number;
  lng?: number;
  locationId: string;
}
