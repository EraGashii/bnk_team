import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchLigjeruesi = async () => (await api.get("/Ligjeruesi")).data;
export const addLigjeruesi = async (Name,Surname) => api.post("/Ligjeruesi", {Name: Name ,Surname:Surname});
export const updateLigjeruesi = async (id, Name,Surname) => api.put(`/Ligjeruesi/${id}`, { Name: Name ,Surname:Surname});
export const deleteLigjeruesi = async (id) => api.delete(`/Ligjeruesi/${id}`);

// 👤 PLAYER
export const fetchLigjerata = async () => (await api.get("/Contract")).data;
export const addContract = async (Contract) => api.post("/Contract", Contract);
export const deleteContract = async (id) => api.delete(`/Contract/${id}`);
