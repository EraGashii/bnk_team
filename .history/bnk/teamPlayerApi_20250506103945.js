import axios from "axios";

const API_URL = "http://localhost:4000/api";
///i nreq se i ki perzi me ligjeruesin
const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchTeam = async () => (await api.get("/Teams")).data;
export const addTeam = async (lecturerName,department,email) => api.post("/Teams", { LecturerName: lecturerName,Department:department,Emali:email });
export const updateTeam = async (id, lecturerName,department,email) => api.put(`/Teams/${id}`, { LecturerName: lecturerName,Department:department,Emali:email});
export const deleteTeam = async (id) => api.delete(`/Teams/${id}`);

// 👤 PLAYER
export const fetchLigjeratas = async () => (await api.get("/Ligjeratas")).data;
export const addLigjerata = async (Ligjerata) => api.post("/Ligjeratas", Ligjerata);
export const deleteLigjerata = async (id) => api.delete(`/Ligjeratas/${id}`);
