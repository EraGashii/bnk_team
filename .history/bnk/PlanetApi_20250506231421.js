import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchLigjeruesi = async () => (await api.get("/Ligjeruesis")).data;
export const addLigjeruesi = async (LecturerName,department,email) => api.post("/Ligjeruesis", { LecturerName: LecturerName,department:department,email:email });
export const updateLigjeruesi = async (id,LecturerName,department,email) => api.put(`/Ligjeruesis/${id}`, { LecturerName: LecturerName,department:department,email:email});
export const deleteLigjeruesi = async (id) => api.delete(`/Ligjeruesis/${id}`);

// 👤 PLAYER
export const fetchSatelite = async () => (await api.get("/Satelite")).data;
export const addLigjerata = async (Ligjerata) => api.post("/Satelite", Ligjerata);
export const deleteLigjerata = async (id) => api.delete(`/Satelite/${id}`);
