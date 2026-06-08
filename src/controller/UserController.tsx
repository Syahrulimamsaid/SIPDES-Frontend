import API from "../config/API";
import { User, UserCreate } from "../interface/UserInterface";

class UserController {
  async create(data: UserCreate): Promise<User> {
    try {
      const response = await API.post("/user", data);

      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async update(id: string, data: UserCreate): Promise<User> {
    try {
      const response = await API.patch(`/user/${id}`, data);

      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async get(): Promise<User[]> {
    try {
      const response = await API.get("/user");

      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async destroy(id: string): Promise<boolean> {
    try {
      const response = await API.delete(`/user/${id}`);

      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default UserController;
