import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchTeam = async () => (await api.get("/Team")).data;
export const addTeam = async (Name,Surname) => api.post("/Team", { Name:Name ,Surname:Surname});
export const updateTeam = async (id,Name,Surname) => api.put(`/Team/${id}`, { Name:Name,Surname:Surname});
export const deleteTeam = async (id) => api.delete(`/Team/${id}`);

// 👤 PLAYER
export const fetchPlayer = async () => (await api.get("/Player")).data;
export const addPlayer = async (Player) => api.post("/Player", Player);
export const deletePlayer = async (id) => api.delete(`/Player/${id}`);
