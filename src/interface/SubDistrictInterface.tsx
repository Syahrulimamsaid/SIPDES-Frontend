import { Village } from "./VillageInterface";

export interface SubDistrict {
  id: string;
  name: string;

  // relations
  villages?: Village[];
}