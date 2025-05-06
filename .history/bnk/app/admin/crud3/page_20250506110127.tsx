"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
    fetchLigjeratas,
  fetchLigjeruesi,
  addLigjerata,
 deleteLigjerata,
  addLigjeruesi,
  updateLigjeruesi,
 deleteLigjeruesi,
} from "../../../LigjerataApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface Ligjeruesi {
     LecturerId: number;
     LecturerName: string;
     department: string;
    email: string;
 
}

interface Ligjerata {
    Id: number;
    LectureName: string;
   LecturerId: number;
  Ligjeruesi?:Ligjeruesi;
}

const LigjeruesiLigjerataManager: React.FC = () => {
  const [tab, setTab] = useState<"Ligjerata" | "Ligjeruesis">("Ligjerata");
  const [Ligjeruesis, setLigjeruesis] = useState<Ligjeruesi[]>([]);
  const [Ligjerata, setLigjerata] = useState<Ligjerata[]>([]);
  const [LigjerataData, setLigjerataData] = useState({  LectureName: "",  LecturerId: "" });
  const [LecturerName, setLecturerName] = useState<string>("");
  const [ department, setDepartment] = useState<string>("");
  const [ email, setEmail] = useState<string>("");
  const [editLigjeruesi, setEditLigjeruesi] = useState<Ligjeruesi | null>(null);

  useEffect(() => {
    loadLigjeruesis();
    loadLigjerata();
  }, []);

  const loadLigjeruesis = async () => {
    const data = await fetchLigjeruesi();
    setLigjeruesis(data);
  };

  const loadLigjerata = async () => {
    const data = await fetchLigjeratas();
    setLigjerata(data);
  };

  const handleLigjerataInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLigjerataData({ ...LigjerataData, [e.target.name]: e.target.value });
  };

  const handleAddLigjerata = async () => {
    const fixedData = {
      ...LigjerataData,
       LecturerId: Number(LigjerataData. LecturerId), // 🛠 CONVERT to number
    };
  
    await addLigjerata(fixedData);
    setLigjerataData({  LectureName: "",   LecturerId: "" });
    loadLigjerata();
  };
  

  const handleDeleteLigjerata = async (id: number) => {
   await deleteLigjerata(id);
    loadLigjerata();
  };

  const handleAddLigjeruesi = async () => {
    if (!LecturerName.trim()) return alert("Ligjeruesi name is required");
    await addLigjeruesi( LecturerName,department,email);
    setLecturerName("");
    setDepartment("");
    setEmail("");
    loadLigjeruesis();
  };

  const handleUpdateLigjeruesi = async () => {
    if (editLigjeruesi) {
      await updateLigjeruesi(editLigjeruesi.LecturerId,LecturerName,department,email);
      setEditLigjeruesi(null);
      setLecturerName("");
    setDepartment("");
    setEmail("");
      loadLigjeruesis();
    }
  };

  const handleDeleteLigjeruesi = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this Ligjeruesi?")) {
        await  deleteLigjeruesi(id);
      loadLigjeruesis();
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
        <h1 className="text-3xl font-bold mb-6">Ligjeruesi & Ligjerata Management</h1>
        <div className="flex space-x-4 mb-6">
          <button className={`px-4 py-2 rounded ${tab === "Ligjerata" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Ligjerata")}>Ligjerata</button>
          <button className={`px-4 py-2 rounded ${tab === "Ligjeruesis" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Ligjeruesis")}>Ligjeruesis</button>
        </div>

        {tab === "Ligjerata" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ligjerata Management</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" name="LectureName" placeholder="LectureName" value={LigjerataData.LectureName} onChange={handleLigjerataInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <select name="LecturerId" value={LigjerataData. LecturerId} onChange={handleLigjerataInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4">
                <option value="">Select Ligjeruesi</option>
                {Ligjeruesis.map((t) => <option key={t. LecturerId} value={t. LecturerId}>{t.LecturerName}</option>)}
              </select>
              <button onClick={handleAddLigjerata} className="bg-green-500 text-white px-4 rounded">+ Add</button>
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>

                  <th className="p-2 text-left"> LectureName</th>
                  <th className="p-2 text-left">Ligjeruesi</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Ligjerata.map((p, i) => (
                  <tr key={p.Id} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{p.LectureName}</td>
                    <td className="p-2">{p.Ligjeruesi?.LecturerName ||"N/A"}</td>
                    <td className="p-2">{p.Ligjeruesi?.department  ||"N/A"}</td>
                    <td className="p-2">{p.Ligjeruesi?.email ||"N/A"}</td>
                    <td className="p-2 text-center">
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteLigjerata(p.Id)}>
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Ligjeruesis" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ligjeruesis Management</h2>
            <div className="flex mb-4">
              <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
                placeholder="Enter Ligjeruesi name"
                value={LecturerName }
                onChange={(e) => setLecturerName(e.target.value)}
              />
                  <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
                placeholder="Enter Ligjeruesi type"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
                                <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
                placeholder="Enter Ligjeruesi type"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {editLigjeruesi ? (
                <button className="bg-yellow-500 text-white px-4 rounded" onClick={handleUpdateLigjeruesi}>Update</button>
              ) : (
                <button className="bg-green-500 text-white px-4 rounded" onClick={handleAddLigjeruesi}>Add</button>
              )}
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Ligjeruesi Name</th>
                  <th className="p-2 text-left">department</th>
                  <th className="p-2 text-left">email</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Ligjeruesis.map((Ligjeruesi,i) => (
                  <tr key={Ligjeruesi. LecturerId} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{Ligjeruesi.LecturerName}</td>
                    <td className="p-2">{Ligjeruesi.department}</td>
                    <td className="p-2">{Ligjeruesi.email}</td>
                    <td className="p-2 text-center space-x-3">
                      <button className="text-yellow-500 hover:text-yellow-600" onClick={() => { setEditLigjeruesi(Ligjeruesi); setLecturerName(Ligjeruesi.LecturerName);setDepartment(Ligjeruesi.department);setEmail(Ligjeruesi.email);}}>
                        <FiEdit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteLigjeruesi(Ligjeruesi.LecturerId)}>
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

export default LigjeruesiLigjerataManager;
