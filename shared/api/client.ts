import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GREEN_API_URL ?? "https://api.green-api.com",
  headers: {
    "Content-Type": "application/json",
  },
});
