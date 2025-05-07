import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchEmployee = async () => (await api.get("/Employee")).data;
export const addEmployee = async (Name, Surname) => api.post("/Employee", { Name:Name,Surname:Surname });
export const updateEmployee = async (id,Name,Surname) => api.put(`/Employee/${id}`, { Name:Name, Surname:Surname});
export const deleteEmployee = async (id) => api.delete(`/Employee/${id}`);

// 👤 PLAYER
export const fetchPlayer = async () => (await api.get("/Player")).data;
export const addPlayer = async (Player) => api.post("/Player", Player);
export const deletePlayer = async (id) => api.delete(`/Player/${id}`);
