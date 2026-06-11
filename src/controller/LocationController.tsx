import API from "../config/API";
import { LocationAccess, LocationAccessCreate } from "../interface/LocationAccessInterface";
import { Location } from "../interface/LocationInterface";
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

  async getAccessAll(token: string): Promise<User[]> {
    try {
      const data = await API.get("/location/access/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getByAccess(token: string): Promise<LocationAccess[]> {
    try {
      const data = await API.get("/location/access", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async check(
    token: string,
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
}

export default LocationController;
