
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8081/api",
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    console.error("Error parsing user from storage:", err);
  }

  return config;
});

export default apiClient;
