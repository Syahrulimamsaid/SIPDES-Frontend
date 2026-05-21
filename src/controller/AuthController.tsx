import API from "../config/API";
import { clearCookie } from "../helpers/clearCookie";
class AuthController {
  async login(phone_number: string, password: string, device: string) {
    try {
      const login = await API.post("/auth/sign-in", {
        phone_number: phone_number,
        password: password,
        device: device,
      });

      localStorage.setItem("phone_number", login.data.phone_number);
      localStorage.setItem("fullname", login.data.name);
      localStorage.setItem("role", login.data.role);
      localStorage.setItem("token", login.data.token);
      localStorage.setItem("village", login.data.village.name);
      return login.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async logout() {
    try {
      const logout = await API.get("/auth/sign-out", {});

      localStorage.clear();
      clearCookie("auth");
      return logout.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async logked(token: string) {
    try {
      const logked = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return logked.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default AuthController;
