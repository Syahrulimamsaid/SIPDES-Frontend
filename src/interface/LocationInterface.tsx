import { Village } from "./VillageInterface";
import { Presence } from "./PresenceInterface";
import { User } from "./UserInterface";

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  villageId: string;

  // relations
  Village?: Village;
  Presences?: Presence[];
  Users?: User[];
}