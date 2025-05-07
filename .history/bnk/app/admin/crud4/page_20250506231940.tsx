"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
    fetchSatelite,
  fetchPlanet,
  addSatelite,
 deleteSatelite,
  addPlanet,
  updatePlanet,
 deletePlanet,
} from "../../../PlanetApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface Planet {
    PlanetId: number;
     Name: string;
     Type: string;
 
}

interface Satelite {
    Id: number;
    LectureName: string;
   LecturerId: number;
  Planet?:Planet;
}

const PlanetSateliteManager: React.FC = () => {
  const [tab, setTab] = useState<"Satelite" | "Planets">("Satelite");
  const [Planets, setPlanets] = useState<Planet[]>([]);
  const [Satelite, setSatelite] = useState<Satelite[]>([]);
  const [SateliteData, setSateliteData] = useState({  LectureName: "",  LecturerId: "" });
  const [Name, setName] = useState<string>("");
  const [ Type, setType] = useState<string>("");

  const [editPlanet, setEditPlanet] = useState<Planet | null>(null);

  useEffect(() => {
    loadPlanets();
    loadSatelite();
  }, []);

  const loadPlanets = async () => {
    const data = await fetchPlanet();
    setPlanets(data);
  };

  const loadSatelite = async () => {
    const data = await fetchSatelite();
    setSatelite(data);
  };

  const handleSateliteInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSateliteData({ ...SateliteData, [e.target.name]: e.target.value });
  };

  const handleAddSatelite = async () => {
    const fixedData = {
        ...SateliteData,
        LecturerId: Number(SateliteData.LecturerId), // convert to number
      };
    await addSatelite(fixedData);
    setSateliteData({  LectureName: "", LecturerId: "" });
    loadSatelite();
  };
  

  const handleDeleteSatelite = async (id: number) => {
   await deleteSatelite(id);
    loadSatelite();
  };

  const handleAddPlanet = async () => {
    if (!Name.trim()) return alert("Planet name is required");
    await addPlanet( Name,Type);
    setName("");
    setType("");
    loadPlanets();
  };

  const handleUpdatePlanet = async () => {
    if (editPlanet) {
      await updatePlanet(editPlanet.LecturerId,Name,Type);
      setEditPlanet(null);
      setName("");
    setType("");
      loadPlanets();
    }
  };

  const handleDeletePlanet = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this Planet?")) {
        await  deletePlanet(id);
      loadPlanets();
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] text-white p-6 space-y-8">
        <h2 className="text-2xl font-bold text-green-500">BankkApp Admin</h2>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block hover:text-green-400">Dashboard</Link>
          <Link href="/users" className="block hover:text-green-400">Users</Link>
          <Link href="/transactions" className="block hover:text-green-400">Transactions</Link>
          <Link href="/tax-payments" className="block hover:text-green-400">Tax Payments</Link>
          <Link href="/admin/crud" className="block hover:text-green-400">Crud</Link>
          <Link href="/admin/crud2" className="block hover:text-green-400">Crud2</Link>
          <Link href="/admin/crud3" className="block hover:text-green-400">Crud3</Link>
        </nav>
        <div className="mt-auto">
          <button className="text-sm hover:text-red-500">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Planet & Satelite Management</h1>
        <div className="flex space-x-4 mb-6">
          <button className={`px-4 py-2 rounded ${tab === "Satelite" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Satelite")}>Satelite</button>
          <button className={`px-4 py-2 rounded ${tab === "Planets" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Planets")}>Planets</button>
        </div>

        {tab === "Satelite" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Satelite Management</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" name="LectureName" placeholder="LectureName" value={SateliteData.LectureName} onChange={handleSateliteInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <select name="LecturerId" value={SateliteData. LecturerId} onChange={handleSateliteInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4">
                <option value="">Select Planet</option>
                {Planets.map((t) => <option key={t.LecturerId} value={t.LecturerId}>{t.LecturerName}</option>)}
              </select>
              <button onClick={handleAddSatelite} className="bg-green-500 text-white px-4 rounded">+ Add</button>
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>

                  <th className="p-2 text-left"> LectureName</th>
                  <th className="p-2 text-left">Planet</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Satelite.map((p, i) => (
                  <tr key={p.Id} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{p.LectureName}</td>
                    <td className="p-2">{p.Planet?.Name ||"N/A"}</td>
                    <td className="p-2">{p.Planet?.department  ||"N/A"}</td>
                    <td className="p-2">{p.Planet?.email ||"N/A"}</td>
                    <td className="p-2 text-center">
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteSatelite(p.Id)}>
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Planets" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Planets Management</h2>
            <div className="flex mb-4">
              <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
                placeholder="Enter Planet name"
                value={LecturerName }
                onChange={(e) => setLecturerName(e.target.value)}
              />
                  <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
               placeholder="Enter department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
                                <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
               placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {editPlanet ? (
                <button className="bg-yellow-500 text-white px-4 rounded" onClick={handleUpdatePlanet}>Update</button>
              ) : (
                <button className="bg-green-500 text-white px-4 rounded" onClick={handleAddPlanet}>Add</button>
              )}
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Planet Name</th>
                  <th className="p-2 text-left">department</th>
                  <th className="p-2 text-left">email</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Planets.map((Planet,i) => (
                  <tr key={Planet. LecturerId} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{Planet.LecturerName}</td>
                    <td className="p-2">{Planet.department}</td>
                    <td className="p-2">{Planet.email}</td>
                    <td className="p-2 text-center space-x-3">
                      <button className="text-yellow-500 hover:text-yellow-600" onClick={() => { setEditPlanet(Planet); setLecturerName(Planet.LecturerName);setDepartment(Planet.department);setEmail(Planet.email);}}>
                        <FiEdit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeletePlanet(Planet.LecturerId)}>
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlanetSateliteManager;
