import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchTeams = async () => (await api.get("/Teams")).data;
export const addTeams = async (Name) => api.post("/Teams", { Name: Name });
export const updateTeams= async (id, Name) => api.put(`/Teams/${id}`, { Name: Name});
export const deleteTeams = async (id) => api.delete(`/Teams/${id}`);

// 👤 PLAYER
export const fetchPlayer = async () => (await api.get("/Player")).data;
export const addPlayer = async (Player) => api.post("/Player", Player);
export const deletePlayers = async (id) => api.delete(`/Player/${id}`);
