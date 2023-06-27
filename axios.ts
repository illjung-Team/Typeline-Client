import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3001/",
  baseURL: "http://18.181.165.223:3000/",
});

export default api;
