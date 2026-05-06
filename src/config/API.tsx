import Axios from "axios";
import Config from "../config/Config";

const API = Axios.create({
  baseURL: Config.API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

export default API;
