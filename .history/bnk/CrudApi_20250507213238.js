import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchPlanet = async () => (await api.get("/Planet")).data;
export const addPlanet = async (Name) => api.post("/Planet", { Name:Name });
export const updatePlanet = async (id,Name) => api.put(`/Planet/${id}`, { Name:Name});
export const deletePlanet = async (id) => api.delete(`/Planet/${id}`);

// 👤 PLAYER
export const fetchPlayer = async () => (await api.get("/Player")).data;
export const addPlayer = async (Player) => api.post("/Player", Player);
export const deletePlayer = async (id) => api.delete(`/Player/${id}`);
