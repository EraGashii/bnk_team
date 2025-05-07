import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchPlanet = async () => (await api.get("/Planet")).data;
export const addPlanet = async (Name,Type) => api.post("/Planet", { Name:Name ,Type:Type});
export const updatePlanet = async (id,Name,Type) => api.put(`/Planet/${id}`, { Name:Name,Type:Type});
export const deletePlanet = async (id) => api.delete(`/Planet/${id}`);

// 👤 PLAYER
export const fetchContract = async () => (await api.get("/Contract")).data;
export const addContract = async (Contract) => api.post("/Contract", Contract);
export const deleteContract = async (id) => api.delete(`/Contract/${id}`);
