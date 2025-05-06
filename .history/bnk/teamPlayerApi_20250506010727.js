import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchLigjeruesi = async () => (await api.get("/Ligjeruesis")).data;
export const addLigjeruesi = async (name) => api.post("/Ligjeruesis", { Name: name });
export const updateLigjeruesi = async (id, name) => api.put(`/Ligjeruesis/${id}`, { Name: name });
export const deleteLigjeruesi = async (id) => api.delete(`/teams/${id}`);

// 👤 PLAYER
export const fetchPlayers = async () => (await api.get("/players")).data;
export const addPlayer = async (player) => api.post("/players", player);
export const deletePlayer = async (id) => api.delete(`/players/${id}`);
