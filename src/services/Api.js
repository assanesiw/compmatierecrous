import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://qwertyuiop.crousz.app',
    timeout: 3000,
  });
