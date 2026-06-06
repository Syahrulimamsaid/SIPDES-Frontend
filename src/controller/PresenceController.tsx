import API from "../config/API";
import { Notification } from "../interface/NotificationInterface";
import {
  Presence,
  PresenceCreate,
  PresenceResponse,
  PresenceUpdate,
} from "../interface/PresenceInterface";

class PresenceController {
  async get(periode: Date | string, params: { villageId?: string, status?: string, page?:number, limit?:number }): Promise<Presence[]> {
    try {
      let filter = `?periode=${periode}`;
      if (params.villageId) filter += `&villageId=${params.villageId}`;
      if (params.status && params.status !== "all" && params.status !== "") filter += `&status=${params.status}`;
      if (params.page) filter += `&page=${params.page}`;
      if (params.limit) filter += `&limit=${params.limit}`;
      
      const result = await API.get(`/operator/presence${filter}`);
      return result.data.data;
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

  async create(
    data: {
      userId: string;
      in?: string;
      out?: string;
      status: string;
      locationAccessId?: string;
    }
  ): Promise<PresenceResponse> {
    try {
      const result = await API.post(
        "/operator/presence",
        {
          userId: data.userId,
          in: data.in ? new Date(data.in) : null,
          out: data.out ? new Date(data.out) : null,
          status: data.status,
          locationAccessId: data.locationAccessId || null,
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
