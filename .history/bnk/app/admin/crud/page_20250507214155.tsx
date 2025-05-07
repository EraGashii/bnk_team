"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
    fetchSatelit,
  fetchPlanet,
  addSatelit,
 deleteSatelit,
  addPlanet,
  updatePlanet,
 deletePlanet,
} from "../../../CrudApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface Planet {
    PlanetId: number;
     Name: string;
}

interface Satelit {
    Id: number;
    Name:string;
    Number:number;
    BirthYear:number;
   PlanetId: number;
  Planet?:Planet;
}

const PlanetSatelitManager: React.FC = () => {
  const [tab, setTab] = useState<"Satelit" | "Planets">("Satelit");
  const [Planets, setPlanets] = useState<Planet[]>([]);
  const [Satelit, setSatelit] = useState<Satelit[]>([]);
  const [SatelitData, setSatelitData] = useState({  Name:"",  Number:"", BirthYear:"", PlanetId: "" });
  const [Name, setName] = useState<string>("");

  const [editPlanet, setEditPlanet] = useState<Planet | null>(null);

  useEffect(() => {
    loadPlanets();
    loadSatelit();
  }, []);

  const loadPlanets = async () => {
    const data = await fetchPlanet();
    setPlanets(data);
  };

  const loadSatelit = async () => {
    const data = await fetchSatelit();
    setSatelit(data);
  };

  const handleSatelitInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSatelitData({ ...SatelitData, [e.target.name]: e.target.value });
  };

  const handleAddSatelit = async () => {
    const fixedData = {
        ...SatelitData,
        PlanetId:Number(SatelitData.PlanetId), // convert to number
      };
    await addSatelit(fixedData);
    setSatelitData({ Name:"",  Number:"", BirthYear:"", PlanetId: "" });
    loadSatelit();
  };
  

  const handleDeleteSatelit = async(id:number) => {
   await deleteSatelit(id);
    loadSatelit();
  };

  const handleAddPlanet = async () => {
    if (!Name.trim()) return alert("Planet name is required");
    await addPlanet( Name);
    setName("");
    loadPlanets();
  };

  const handleUpdatePlanet = async () => {
    if (editPlanet) {
      await updatePlanet(editPlanet.PlanetId, Name);
      setEditPlanet(null);
      setName("");
      loadPlanets();
    }
  };

  const handleDeletePlanet = async (id:number) => {
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
        </nav>
        <div className="mt-auto">
          <button className="text-sm hover:text-red-500">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Planet & Satelit Management</h1>
        <div className="flex space-x-4 mb-6">
          <button className={`px-4 py-2 rounded ${tab === "Satelit" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Satelit")}>Player</button>
          <button className={`px-4 py-2 rounded ${tab === "Planets" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Planets")}>Planets</button>
        </div>

        {tab === "Player" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Player Management</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" name="Name" placeholder="Name" value={PlayerData.Name} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <input type="number" name="Number" placeholder="Number" value={PlayerData.Number} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <input type="number" name="BirthYear" placeholder="BirthYear" value={PlayerData.BirthYear} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <select name="PlanetId" value={PlayerData.PlanetId} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4">
                <option value="">Select Planet</option>
                {Planets.map((t) => <option key={t.PlanetId} value={t.PlanetId}>{t.Name}</option>)}
              </select>
              <button onClick={handleAddPlayer} className="bg-green-500 text-white px-4 rounded">+ Add</button>
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>

                  <th className="p-2 text-left"> Name</th>
                  <th className="p-2 text-left"> Number</th>
                  <th className="p-2 text-left"> BirthYear</th>
                  <th className="p-2 text-left">Planet</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Player.map((p, i) => (
                  <tr key={p.Id} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{p.Name}</td>
                    <td className="p-2">{p.Number}</td>
                    <td className="p-2">{p.BirthYear}</td>
                    <td className="p-2">{p.Planet?.Name ||"N/A"}</td>
                    <td className="p-2 text-center">
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeletePlayer(p.Id)}>
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
                value={Name}
                onChange={(e) => setName(e.target.value)}
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
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Planets.map((Planet,i) => (
                  <tr key={Planet.PlanetId} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{Planet.Name}</td>

                    <td className="p-2 text-center space-x-3">
                      <button className="text-yellow-500 hover:text-yellow-600" onClick={() => { setEditPlanet(Planet);}}>
                        <FiEdit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeletePlanet(Planet.PlanetId)}>
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

export default PlanetSatelitManager;
