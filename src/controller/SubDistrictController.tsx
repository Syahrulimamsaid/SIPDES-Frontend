import API from "../config/API";
import { SubDistrict } from "../interface/SubDistrictInterface";

class SubDistrictController {
  async get(): Promise<SubDistrict[]> {
    try {
      const response = await API.get("/sub-district");
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async create(data: Omit<SubDistrict, "id">): Promise<SubDistrict> {
    try {
      const response = await API.post("/sub-district", data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async update(id: string, data: Omit<SubDistrict, "id">): Promise<SubDistrict> {
    try {
      const response = await API.patch(`/sub-district/${id}`, data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async destroy(id: string): Promise<boolean> {
    try {
      const response = await API.delete(`/sub-district/${id}`);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default SubDistrictController;
