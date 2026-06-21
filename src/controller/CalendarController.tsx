import API from "../config/API";
import { Calendar } from "../interface/CalendarInterface";

class CalendarController {
  async get(): Promise<Calendar[]> {
    try {
      const response = await API.get("/calendar");
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async create(data: Omit<Calendar, "id">): Promise<Calendar> {
    try {
      const response = await API.post("/calendar", data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async update(id: string, data: Omit<Calendar, "id">): Promise<Calendar> {
    try {
      const response = await API.patch(`/calendar/${id}`, data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async destroy(id: string): Promise<boolean> {
    try {
      const response = await API.delete(`/calendar/${id}`);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default CalendarController;
