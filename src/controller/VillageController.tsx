import API from "../config/API";
import { Village } from "../interface/VillageInterface";

class VillageController {
  async get(): Promise<Village[]> {
    try {
      const response = await API.get("/village");
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async create(data: Omit<Village, "id">): Promise<Village> {
    console.log(data);
    try {
      const response = await API.post("/village", data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async update(id: string, data: Omit<Village, "id">): Promise<Village> {
    try {
      const response = await API.patch(`/village/${id}`, data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async destroy(id: string): Promise<boolean> {
    try {
      const response = await API.delete(`/village/${id}`);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default VillageController;
