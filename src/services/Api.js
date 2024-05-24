import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_COMP,
    timeout: 3000,
  });
