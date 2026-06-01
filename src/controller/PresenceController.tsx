import API from "../config/API";
import { Notification } from "../interface/NotificationInterface";
import {
  Presence,
  PresenceCreate,
  PresenceResponse,
  PresenceUpdate,
} from "../interface/PresenceInterface";

class PresenceController {
  async get(periode: Date | string, villageId: string, status: string): Promise<Presence[]> {
    try {
      let filter = `?periode=${periode}`;
      if (villageId) filter += `&villageId=${villageId}`;
      if (status !== "all" && status !== "") filter += `&status=${status}`;

      const result = await API.get(`/operator/presence${filter}`);
      return result.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getByUser(periode: Date, token: string): Promise<Presence[]> {
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

  async update(
    data: PresenceUpdate,
  ): Promise<PresenceResponse> {
    try {
      const result = await API.patch(
        "/operator/presence",
        {
          id: data.id,
          in: new Date(data.in),
          out: new Date(data.out),
          status: data.status,
        },
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async destory(id: string) {
    try {
      const result = await API.delete(`/operator/presence/${id}`);
      return result.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default PresenceController;
