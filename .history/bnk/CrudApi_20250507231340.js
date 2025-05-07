import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchTeam = async () => (await api.get("/Team")).data;
export const addTeam = async (Name,Surname) => api.post("/Team", { Name:Name ,Surname:Surname});
export const updateTeam = async (id,Name,Surname) => api.put(`/Team/${id}`, { Name:Name,Surname:Surname});
export const deleteTeam = async (id) => api.delete(`/Team/${id}`);

// 👤 PLAYER
export const fetchContract = async () => (await api.get("/Contract")).data;
export const addContract = async (Contract) => api.post("/Contract", Contract);
export const deleteContract = async (id) => api.delete(`/Contract/${id}`);
