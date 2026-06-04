import API from "../config/API";
import { User } from "../interface/UserInterface";

class UserController {
  async get():Promise<User[]> {
    try {
      const response = await API.get("/user");

      return response.data;
    } catch (e) {
      console.error(e); 
      throw e;
    }
  }
}

export default UserController;
