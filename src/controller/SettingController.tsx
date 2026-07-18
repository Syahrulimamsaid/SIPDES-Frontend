import API from "../config/API";

class SettingController {

  async get(): Promise<any> {
    try {
      const data = await API.get("/setting");
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async update(in_time: string, out_time: string): Promise<any> {
    try {
      const data = await API.patch("/setting", {
        in_time: in_time,
        out_time: out_time,
      });
      return data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default SettingController;