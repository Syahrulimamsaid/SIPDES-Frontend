import API from "../config/API";
import { ReportPresence } from "../interface/ReportInterface";

class ReportController {
  async presence(startDate: Date, endDate: Date, params?: { userId?: string, page?: number, limit?: number }): Promise<ReportPresence[]> {
    try {
      let filter = `?start=${startDate}&end=${endDate}`;
      if (params?.userId) filter += '&userId=' + params.userId;
      if (params?.page) filter += '&page=' + params.page;
      if (params?.limit) filter += '&limit=' + params.limit;
     
      const response = await API.get("/report/presence" + filter);

      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

export default ReportController;
