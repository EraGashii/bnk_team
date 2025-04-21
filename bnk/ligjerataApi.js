import axios from "axios";

const API_URL = "http://localhost:4000/api"; // ✅ Make sure backend is running here

const api = axios.create({ baseURL: API_URL });

// 🧠 Ligjeruesi
export const fetchLigjeruesi = async () => (await api.get("/Ligjeruesi")).data;

export const addLigjeruesi = async ( lecturerName,departament,email) =>
  api.post("/Ligjeruesi", {  LecturerName:  lecturerName,Departament:departament,Email:email });

export const updateLigjeruesi = async (LecturerId, lecturerName,departament,email) =>
  api.put(`/Ligjeruesi/${LecturerId}`, { LecturerName: lecturerName,Departament:departament,Email:email});

export const deleteLigjeruesi = async (LecturerId) =>
  api.delete(`/Ligjeruesi/${LecturerId}`);

// 👤 Ligjerata
export const fetchLigjerata = async () => (await api.get("/Ligjerata")).data;

export const addLigjerata = async (LigjerataData) =>
  api.post("/Ligjerata", LigjerataData);

export const deleteLigjerata = async (id) =>
  api.delete(`/Ligjerata/${id}`);
