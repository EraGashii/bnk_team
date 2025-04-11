import axios from "axios";

const API_URL = "http://localhost:4000/api"; // ✅ Make sure backend is running here

const api = axios.create({ baseURL: API_URL });

// 🧠 Employee
export const fetchEmployee = async () => (await api.get("/Employee")).data;

export const addEmployee = async (name,surname) =>
  api.post("/Employee", { Name: name,Surname:surname });

export const updateEmployee = async (EmployeeId, name,surname) =>
  api.put(`/Employee/${EmployeeId}`, { Name: name,Surname:surname});

export const deleteEmployee = async (EmployeeId) =>
  api.delete(`/Employee/${EmployeeId}`);

// 👤 Contract
export const fetchContract = async () => (await api.get("/Contract")).data;

export const addContract = async (contractData) =>
  api.post("/Contract", contractData);

export const deleteContract = async (id) =>
  api.delete(`/Contract/${id}`);
