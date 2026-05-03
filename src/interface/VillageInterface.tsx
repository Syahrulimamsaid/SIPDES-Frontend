import { User } from "./UserInterface";
import { Location } from "./LocationInterface";
import { District } from "./DistrictInterface";

export interface Village {
  id: string;
  name: string;
  address?: string;
  districtId?: string;

  // relations
  users?: User[];
  locations?: Location[];
  district?: District;
}