import API from "../config/API";
import { Notification } from "../interface/NotificationInterface";
import {
  Presence,
  PresenceCreate,
  PresenceResponse,
} from "../interface/PresenceInterface";

class PresenceController {
  async get(periode:Date, token: string): Promise<Presence[]> {
    try {
      const result = await API.get(`/presence/${periode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getById(id: string, token: string): Promise<Presence> {
    try {
      const result = await API.get(`/presence/id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async getByProcess(): Promise<Notification[]> {
    try {
      const result = await API.get(`/presence/process`);
      return result.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async presence(
    token: string,
    data: PresenceCreate,
  ): Promise<PresenceResponse> {
    try {
      const result = await API.post(
        "/presence",
        {
          lat: Number(data.lat),
          lng: Number(data.lng),
          locationAccessId: data.locationAccessId,
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
