import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchLigjeruesi = async () => (await api.get("/Ligjeruesis")).data;
export const addLigjeruesi = async (name) => api.post("/Ligjeruesis", { Name: name });
export const updateLigjeruesi = async (id, name) => api.put(`/Ligjeruesis/${id}`, { Name: name });
export const deleteLigjeruesi = async (id) => api.delete(`/Ligjeruesis/${id}`);

// 👤 PLAYER
export const fetchLigjeratas = async () => (await api.get("/Ligjeratas")).data;
export const addLigjerata = async (Ligjerata) => api.post("/Ligjeratas", player);
export const deleteLigjerata = async (id) => api.delete(`/Ligjeratas/${id}`);
