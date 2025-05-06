import axios from "axios";

const API_URL = "http://localhost:4000/api";
///i nreq se i ki perzi me ligjeruesin
const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchLigjeruesi = async () => (await api.get("/Ligjeruesis")).data;
export const addLigjeruesi = async (LecturerName,department,email) => api.post("/Ligjeruesis", { LecturerName: LecturerName,department:department,email:email });
export const updateLigjeruesi = async (id, LecturerName,department,email) => api.put(`/Ligjeruesis/${id}`, { LecturerName: LecturerName,department:department,emali:email});
export const deleteLigjeruesi = async (id) => api.delete(`/Ligjeruesis/${id}`);

// 👤 PLAYER
export const fetchLigjeratas = async () => (await api.get("/Ligjeratas")).data;
export const addLigjerata = async (Ligjerata) => api.post("/Ligjeratas", Ligjerata);
export const deleteLigjerata = async (id) => api.delete(`/Ligjeratas/${id}`);
