import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchEmployee = async () => (await api.get("/Employee")).data;
export const addEmployee = async (Name,Surname) => api.post("/Employee", { Name:Name ,Type:Type});
export const updateEmployee = async (id,Name,Type) => api.put(`/Employee/${id}`, { Name:Name,Type:Type});
export const deleteEmployee = async (id) => api.delete(`/Employee/${id}`);

// 👤 PLAYER
export const fetchContract = async () => (await api.get("/Contract")).data;
export const addContract = async (Contract) => api.post("/Contract", Contract);
export const deleteContract = async (id) => api.delete(`/Contract/${id}`);
