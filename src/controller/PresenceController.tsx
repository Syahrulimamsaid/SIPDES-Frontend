import API from "../config/API";
import { Presence, PresenceCreate } from "../interface/PresenceInterface";

class PresenceController {
  async get(token: string): Promise<Presence[]> {
    try {
      const result = await API.get(
        "/presence",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async presence(token: string, data: PresenceCreate): Promise<Presence[]> {
    try {
      const result = await API.post(
        "/presence",
        {
          lat: Number(data.lat),
          lng: Number(data.lng),
          locationId: data.locationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default PresenceController;
