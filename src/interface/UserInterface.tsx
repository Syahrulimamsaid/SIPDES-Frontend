import { Presence } from "./PresenceInterface";
import { Village } from "./VillageInterface";
import { Location } from "./LocationInterface";

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
  locations?: Location[];
}