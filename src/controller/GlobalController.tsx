import API from "../config/API";

class GlobalController {
  async stats() {
    try {
      const data = await API.get("/global/stats");
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async statsPresence() {
    try {
      const data = await API.get("/global/stats/presence");
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default GlobalController;  
