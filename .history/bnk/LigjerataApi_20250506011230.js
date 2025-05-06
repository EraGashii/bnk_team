import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchLigjeruesi = async () => (await api.get("/Ligjeruesi")).data;
export const addLigjeruesi = async (Name,Surname) => api.post("/Ligjeruesi", {Name: Name ,Surname:Surname});
export const updateLigjeruesi = async (id, Name,Surname) => api.put(`/Ligjeruesi/${id}`, { Name: Name ,Surname:Surname});
export const deleteLigjeruesi = async (id) => api.delete(`/Ligjeruesi/${id}`);

// 👤 PLAYER
export const fetchLigjerata = async () => (await api.get("/Ligjerata")).data;
export const addLigjerata = async (Ligjerata) => api.post("/Ligjerata", Contract);
export const deleteLigjerata = async (id) => api.delete(`/Ligjerata/${id}`);
