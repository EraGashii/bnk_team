import axios from "axios";

const API_URL = "http://localhost:4000/api";
///i nreq se i ki perzi me ligjeruesin
const api = axios.create({ baseURL: API_URL });

// 🧠 TEAM
export const fetchTeam = async () => (await api.get("/Teams")).data;
export const addTeam = async (Name) => api.post("/Teams", { Name: lecturerName,Department:department,Emali:email });
export const updateTeam = async (id, lecturerName,department,email) => api.put(`/Teams/${id}`, { LecturerName: lecturerName,Department:department,Emali:email});
export const deleteTeam = async (id) => api.delete(`/Teams/${id}`);

// 👤 PLAYER
export const fetchPlayer = async () => (await api.get("/Player")).data;
export const addLigjerata = async (Ligjerata) => api.post("/Player", Ligjerata);
export const deleteLigjerata = async (id) => api.delete(`/Player/${id}`);
