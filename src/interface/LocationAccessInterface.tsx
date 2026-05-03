import { User } from "./UserInterface";
import { Location } from "./LocationInterface";
import { Presence } from "./PresenceInterface";

export interface LocationAccess {
  id: string;
  userId?: string;
  locationId: string;
  description?: string;
  isInside?: boolean;
  
  // relations
  user?: User;
  location?: Location;
  presence?: Presence;
}
