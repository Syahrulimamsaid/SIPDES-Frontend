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

  async statsPresence(start?:Date, end?:Date) {
    try {
      let filter = "";
      if (start && end) filter = `?start=${start}&end=${end}`;

      const data = await API.get("/global/stats/presence" + filter);
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default GlobalController;  
