"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

import {
  fetchLigjerata,
  fetchLigjeruesi,
  addLigjerata,
  deleteLigjerata,
  addLigjeruesi,
  updateLigjeruesi,
  deleteLigjeruesi,
} from "../../ligjerataApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Ligjeruesi {
LecturerId: number;
LecturerName: string;
  Departament: string;
  Email: string;
}

interface Ligjerata {
   LectureId: number;
   LectureName:string;
  Ligjeruesi?: Ligjeruesi;
}

const LigjeruesiLigjerataManager: React.FC = () => {
  const [tab, setTab] = useState<"Ligjerata" | "Ligjeruesi">("Ligjerata");
  const [Ligjeruesi, setLigjeruesi] = useState<Ligjeruesi[]>([]);
  const [Ligjerata, setLigjerata] = useState<Ligjerata[]>([]);
  const [LigjerataData, setLigjerataData] = useState({ LectureName: "", LecturerId: ""  });
  const [LecturerName, setLecturerName] = useState<string>("");
  const [Departament, setDepartament] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [editLigjeruesi, setEditLigjeruesi] = useState<Ligjeruesi | null>(null);

  useEffect(() => {
    loadLigjeruesi();
    loadLigjerata();
  }, []);

  const loadLigjeruesi = async () => {
    const data = await fetchLigjeruesi();
    setLigjeruesi(data);
  };

  const loadLigjerata = async () => {
    const data = await fetchLigjerata();
    setLigjerata(data);
  };

  const handleLigjerataInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLigjerataData({ ...LigjerataData, [e.target.name]: e.target.value });
  };

  const handleAddLigjerata = async () => {
    await addLigjerata(LigjerataData);
    setLigjerataData({ LectureName: "", LecturerId: "" });
    loadLigjerata();
  };

  const handleDeleteLigjerata = async (LectureId: number) => {
    await deleteLigjerata(LectureId);
    loadLigjerata();
  };

  const handleAddLigjeruesi = async () => {
    if (!LecturerName.trim() || !Departament.trim()) {
      return alert("Both name and Departament are required");
    }
  
    await addLigjeruesi(LecturerName,Departament,Email); // pass both
    setLecturerName("");
    setDepartament("");
    loadLigjeruesi();
  };

  const handleUpdateLigjeruesi = async () => {
    if (editLigjeruesi) {
      await updateLigjeruesi(editLigjeruesi.LecturerId,LecturerName,Departament,Email);
      setEditLigjeruesi(null);
      setLecturerName("");
      setDepartament("");
      setEmail("");
      loadLigjeruesi();
    }
  };

  const handleDeleteLigjeruesi = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this Ligjeruesi?")) {
      await deleteLigjeruesi(id);
      loadLigjeruesi();
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "Ligjerata" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("Ligjerata")}
        >
          Ligjerata
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "Ligjeruesi" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("Ligjeruesi")}
        >
          Ligjeruesi
        </button>
      </div>

      {tab === "Ligjerata" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-black">Ligjerata Management</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" name="LectureName" placeholder="LectureName" value={LigjerataData.LectureName} onChange={handleLigjerataInput} className="border px-3 py-2 w-1/4" />
            <select name="LecturerId" value={LigjerataData.LecturerId} onChange={handleLigjerataInput} className="border px-3 py-2 w-1/4">
              <option value="">Select Ligjeruesi</option>
              {Ligjeruesi.map((t) => <option key={t.LecturerId} value={t.LecturerId}>{t.LecturerName}</option>)}
            </select>
            <button onClick={handleAddLigjerata} className="bg-blue-500 text-white px-4 rounded">+ Add</button>
          </div>

          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left text-black">#</th>
                <th className="p-2 text-left text-black">LectureName</th>
                <th className="p-2 text-left text-black">Ligjeruesi</th>
                <th className="p-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Ligjerata.map((p, i) => (
                <tr key={p. LectureId} className="border-t text-black">
                  <td className="p-2 ">{i + 1}</td>
                  <td className="p-2 text-black">{p.LectureName}</td>
                  <td className="p-2 text-black">{p.Ligjeruesi?.LecturerName || "N/A"}</td>
                  <td className="p-2 text-center">
                    <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteLigjerata(p. LectureId)}>
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Ligjeruesi" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-black">Ligjeruesi Management</h2>
          <div className="flex mb-4">
            <input
              type="text"
              className="border px-3 py-2 mr-2 w-full"
              placeholder="Enter Ligjeruesi name"
              value={LecturerName}
              onChange={(e) => setLecturerName(e.target.value)}
            />
            <input
  type="text"
  className="border px-3 py-2 mr-2 w-full"
  placeholder="Enter Ligjeruesi Departament"
  value={Departament}
  onChange={(e) => setDepartament(e.target.value)}
/>
<input
  type="text"
  className="border px-3 py-2 mr-2 w-full"
  placeholder="Enter Ligjeruesi Email"
  value={Email}
  onChange={(e) => setEmail(e.target.value)}
/>

            {editLigjeruesi ? (
              <button className="bg-yellow-500 text-white px-4 rounded" onClick={handleUpdateLigjeruesi}>Update</button>
            ) : (
              <button className="bg-green-500 text-white px-4 rounded" onClick={handleAddLigjeruesi}>Add</button>
            )}
          </div>

          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left text-black">#</th>
                <th className="p-2 text-left text-black" >Ligjeruesi Name</th>
                <th className="p-2 text-left text-black" >Ligjeruesi Departament</th>
                <th className="p-2 text-left text-black" >Ligjeruesi Email</th>
                <th className="p-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Ligjeruesi.map((Ligjeruesi, i) => (
                <tr key={Ligjeruesi.LecturerId} className="border-t text-black">
                  <td className="p-2 text-black">{i + 1}</td>
                  <td className="p-2 text-black">{Ligjeruesi.LecturerName}</td>
                  <td className="p-2 text-black">{Ligjeruesi.Departament}</td>
                  <td className="p-2 text-black">{Ligjeruesi.Email}</td>
                  <td className="p-2 text-center space-x-3">
                    <button
                      className="text-yellow-500 hover:text-yellow-600"
                      onClick={() => {
                        setEditLigjeruesi(Ligjeruesi);
                        setLecturerName(Ligjeruesi.LecturerName);
                        setDepartament(Ligjeruesi.Departament);
                        setEmail(Ligjeruesi.Email);
                      }}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteLigjeruesi(Ligjeruesi.LecturerId)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LigjeruesiLigjerataManager;
