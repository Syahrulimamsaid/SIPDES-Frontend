import { Village } from "./VillageInterface";

export interface District {
  id: string;
  name: string;

  // relations
  Villages?: Village[];
}