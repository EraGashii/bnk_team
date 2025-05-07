"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
    fetchContract,
  fetchTeam,
  addContract,
 deleteContract,
  addTeam,
  updateTeam,
 deleteTeam,
} from "../../../PlanetApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface Team {
    TeamId: number;
     Name: string;
    Surname: string;
 
}

interface Contract {
    Id: number;
    Title:string;
    Description:string;
   TeamId: number;
  Team?:Team;
}

const TeamContractManager: React.FC = () => {
  const [tab, setTab] = useState<"Contract" | "Teams">("Contract");
  const [Teams, setTeams] = useState<Team[]>([]);
  const [Contract, setContract] = useState<Contract[]>([]);
  const [ContractData, setContractData] = useState({  Title: "",Description:"", TeamId: "" });
  const [Name, setName] = useState<string>("");
  const [ Surname, setSurname] = useState<string>("");

  const [editTeam, setEditTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadTeams();
    loadContract();
  }, []);

  const loadTeams = async () => {
    const data = await fetchTeam();
    setTeams(data);
  };

  const loadContract = async () => {
    const data = await fetchContract();
    setContract(data);
  };

  const handleContractInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setContractData({ ...ContractData, [e.target.name]: e.target.value });
  };

  const handleAddContract = async () => {
    const fixedData = {
        ...ContractData,
        TeamId:Number(ContractData.TeamId), // convert to number
      };
    await addContract(fixedData);
    setContractData({ Title:"" ,Description:"", TeamId:"" });
    loadContract();
  };
  

  const handleDeleteContract = async(id:number) => {
   await deleteContract(id);
    loadContract();
  };

  const handleAddTeam = async () => {
    if (!Name.trim()) return alert("Team name is required");
    await addTeam( Name,Surname);
    setName("");
    setSurname("");
    loadTeams();
  };

  const handleUpdateTeam = async () => {
    if (editTeam) {
      await updateTeam(editTeam.TeamId,Name,Surname);
      setEditTeam(null);
      setName("");
    setSurname("");
      loadTeams();
    }
  };

  const handleDeleteTeam = async (id:number) => {
    if (window.confirm("Are you sure you want to delete this Team?")) {
        await  deleteTeam(id);
      loadTeams();
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
        <h1 className="text-3xl font-bold mb-6">Team & Contract Management</h1>
        <div className="flex space-x-4 mb-6">
          <button className={`px-4 py-2 rounded ${tab === "Contract" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Contract")}>Contract</button>
          <button className={`px-4 py-2 rounded ${tab === "Teams" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Teams")}>Teams</button>
        </div>

        {tab === "Contract" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Contract Management</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" name="Title" placeholder="Title" value={ContractData.Title} onChange={handleContractInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <input type="text" name="Description" placeholder="Description" value={ContractData.Description} onChange={handleContractInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <select name="TeamId" value={ContractData.TeamId} onChange={handleContractInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4">
                <option value="">Select Team</option>
                {Teams.map((t) => <option key={t.TeamId} value={t.TeamId}>{t.Name}</option>)}
              </select>
              <button onClick={handleAddContract} className="bg-green-500 text-white px-4 rounded">+ Add</button>
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>

                  <th className="p-2 text-left"> Title</th>
                  <th className="p-2 text-left"> Descriptrion</th>
                  <th className="p-2 text-left">Team</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Contract.map((p, i) => (
                  <tr key={p.Id} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{p.Title}</td>
                    <td className="p-2">{p.Description}</td>
                    <td className="p-2">{p.Team?.Name ||"N/A"}</td>
                    <td className="p-2">{p.Team?.Surname  ||"N/A"}</td>
                    <td className="p-2 text-center">
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteContract(p.Id)}>
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Teams" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Teams Management</h2>
            <div className="flex mb-4">
              <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
                placeholder="Enter Team name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
                  <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
               placeholder="Enter surname"
                value={Surname}
                onChange={(e) => setSurname(e.target.value)}
              />
                              

              {editTeam ? (
                <button className="bg-yellow-500 text-white px-4 rounded" onClick={handleUpdateTeam}>Update</button>
              ) : (
                <button className="bg-green-500 text-white px-4 rounded" onClick={handleAddTeam}>Add</button>
              )}
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Team Name</th>
                  <th className="p-2 text-left">surname</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Teams.map((Team,i) => (
                  <tr key={Team.TeamId} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{Team.Name}</td>
                    <td className="p-2">{Team.Surname}</td>

                    <td className="p-2 text-center space-x-3">
                      <button className="text-yellow-500 hover:text-yellow-600" onClick={() => { setEditTeam(Team); setName(Team.Name);setSurname(Team.Surname);}}>
                        <FiEdit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteTeam(Team.TeamId)}>
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

export default TeamContractManager;
