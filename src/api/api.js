import axios from "axios";

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
});

// interceptor to attach token
API.interceptors.request.use((req) => {
  const profile = JSON.parse(localStorage.getItem("profile"));

  if (profile?.token) {
    req.headers.Authorization = `Bearer ${profile.token}`;
  }

  return req;
});