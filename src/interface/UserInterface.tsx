import { Presence } from "./PresenceInterface";
import { Village } from "./VillageInterface";
import { LocationAccess } from "./LocationAccessInterface";

export interface User {
  id: string;
  phone_number: string;
  password?: string;
  fullname: string;
  role:string;
  villageId?: string;
  device?: string;

  village?: Village;
  presences?: Presence[];
  location_access?: LocationAccess[];
}

export interface UserCreate {
  id?: string;
  phone_number: string;
  password?: string;
  fullname: string;
  role:string;
  villageId?: string;
}