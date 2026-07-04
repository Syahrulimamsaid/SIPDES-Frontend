import API from "../config/API";
import { LocationAccess, LocationAccessCreate } from "../interface/LocationAccessInterface";
import { Location, LocationCreate, LocationUpdate } from "../interface/LocationInterface";
import { User } from "../interface/UserInterface";

class LocationController {
  async get(): Promise<Location[]> {
    try {
      const data = await API.get("/location");
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAccessAll(): Promise<User[]> {
    try {
      const data = await API.get("/location/access/all");
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getByAccess(): Promise<LocationAccess[]> {
    try {
      const data = await API.get("/location/access");
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async check(
    lat: number,
    lng: number,
    locationId: string,
  ): Promise<LocationAccess> {
    try {
      const data = await API.post(
        "/location/check",
        {
          lat: lat,
          lng: lng,
          locationId: locationId,
        },
      );
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getByAccessUser(userId: string): Promise<LocationAccess[]> {
    try {
      const data = await API.post("/location/access/user", {
        userId: userId
      });
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createAccess(
    data: LocationAccessCreate
  ): Promise<LocationAccess> {
    try {
      const response = await API.post("/location/access", data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deleteAccess(id: string): Promise<any> {
    try {
      const data = await API.delete(`/location/access/${id}`,
      );
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async create(data: LocationCreate): Promise<Location> {
    try {
      const response = await API.post("/location", data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async update(data: LocationUpdate): Promise<Location> {
    try {
      const response = await API.patch(`/location/${data.id}`, {
        name: data.name,
        lat: Number(data.lat),
        lng: Number(data.lng),
        radius: Number(data.radius),
        villageId: data.villageId,
      });
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const data = await API.delete(`/location/${id}`);
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default LocationController;
