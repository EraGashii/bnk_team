import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchPlanet = async () => (await api.get("/Planets")).data;
export const addPlanet = async (Name,department,email) => api.post("/Planets", { Name:Name,department:department,email:email });
export const updatePlanet = async (id,LecturerName,department,email) => api.put(`/Planets/${id}`, { LecturerName: LecturerName,department:department,email:email});
export const deletePlanet = async (id) => api.delete(`/Planets/${id}`);

// 👤 PLAYER
export const fetchSatelite = async () => (await api.get("/Satelite")).data;
export const addSatelite = async (Satelite) => api.post("/Satelite", Satelite);
export const deleteSatelite = async (id) => api.delete(`/Satelite/${id}`);
