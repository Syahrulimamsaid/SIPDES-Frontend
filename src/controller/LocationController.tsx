import API from "../config/API";
import { LocationAccess } from "../interface/LocationAccessInterface";

class LocationController {
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
  ): Promise<LocationAccess[]> {
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
}

export default LocationController;
