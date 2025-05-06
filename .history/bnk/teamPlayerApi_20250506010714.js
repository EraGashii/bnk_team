import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchLigjeruesi = async () => (await api.get("/teams")).data;
export const addLigjeruesi = async (name) => api.post("/teams", { Name: name });
export const updateTeam = async (id, name) => api.put(`/teams/${id}`, { Name: name });
export const deleteTeam = async (id) => api.delete(`/teams/${id}`);

// 👤 PLAYER
export const fetchPlayers = async () => (await api.get("/players")).data;
export const addPlayer = async (player) => api.post("/players", player);
export const deletePlayer = async (id) => api.delete(`/players/${id}`);
