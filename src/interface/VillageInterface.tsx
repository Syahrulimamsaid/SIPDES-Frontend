import { User } from "./UserInterface";
import { Location } from "./LocationInterface";
import { SubDistrict } from "./SubDistrictInterface";

export interface Village {
  id: string;
  name: string;
  address?: string;
  subDistrictId?: string;

  // relations
  users?: User[];
  locations?: Location[];
  subDistrict?: SubDistrict;

  user_count? :number;
  location_count? :number;
} 