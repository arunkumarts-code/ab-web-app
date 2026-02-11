import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
   headers: {"Content-Type": "application/json"},
});

// Request interceptor to attach Firebase token (if logged in)
api.interceptors.request.use(async (config) => {
   const user = auth.currentUser;

   if (user) {
      const token = await user.getIdToken(true);
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
   }
   
   return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle errors globally
api.interceptors.response.use(
   (response) => response,
   (error) => {
      console.error("API Error:", error.response?.data || error.message);
      return Promise.reject(error);
   }
);

export default api;
