"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
    fetchPlayer,
  fetchTeam,
  addPlayer,
 deletePlayer,
  addTeam,
  updateTeam,
 deleteTeam,
} from "../../../CrudApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface Team {
    TeamId: number;
     Name: string;
}

interface Player {
    Id: number;
    Name: string;
   Number:number;
    BirthYear:number;
   TeamId: number;
  Team?:Team;
}

const TeamPlayerManager: React.FC = () => {
  const [tab, setTab] = useState<"Player" | "Teams">("Player");
  const [Teams, setTeams] = useState<Team[]>([]);
  const [Player, setPlayer] = useState<Player[]>([]);
  const [PlayerData, setPlayerData] = useState({  Name:"",Number:0, BirthYear:0, TeamId: "" });
  const [Name, setName] = useState<string>("");


  const [editTeam, setEditTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadTeams();
    loadPlayer();
  }, []);

  const loadTeams = async () => {
    const data = await fetchTeam();
    setTeams(data);
  };

  const loadPlayer = async () => {
    const data = await fetchPlayer();
    setPlayer(data);
  };

  const handlePlayerInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPlayerData({ ...PlayerData, [e.target.name]: e.target.value });
  };

  const handleAddPlayer = async () => {
    const fixedData = {
        ...PlayerData,
        TeamId:Number(PlayerData.TeamId), // convert to number
      };
    await addPlayer(fixedData);
    setPlayerData({ Name:"",Number:0, BirthYear:0, TeamId: ""  });
    loadPlayer();
  };
  

  const handleDeletePlayer = async(id:number) => {
   await deletePlayer(id);
    loadPlayer();
  };

  const handleAddTeam = async () => {
    if (!Name.trim()) return alert("Team name is required");
    await addTeam( Name);
    setName("");  

    loadTeams();
  };

  const handleUpdateTeam = async () => {
    if (editTeam) {
      await updateTeam(editTeam.TeamId,Name);
      setEditTeam(null);
      setName("");

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
        </nav>
        <div className="mt-auto">
          <button className="text-sm hover:text-red-500">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Team & Player Management</h1>
        <div className="flex space-x-4 mb-6">
          <button className={`px-4 py-2 rounded ${tab === "Player" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Player")}>Player</button>
          <button className={`px-4 py-2 rounded ${tab === "Teams" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Teams")}>Teams</button>
        </div>

        {tab === "Player" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Player Management</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" name="Name" placeholder="Name" value={PlayerData.Name} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <input type="text" name="BirthYear" placeholder="BirthYear" value={PlayerData.BirthYear} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <input type="text" name=" Number" placeholder=" Number" value={PlayerData. Number} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <select name="TeamId" value={PlayerData.TeamId} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4">
                <option value="">Select Team</option>
                {Teams.map((t) => <option key={t.TeamId} value={t.TeamId}>{t.Name}</option>)}
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
                  <th className="p-2 text-left">Team</th>
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

                    <td className="p-2">{p.Team?.Name ||"N/A"}</td>
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

                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Teams.map((Team,i) => (
                  <tr key={Team.TeamId} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{Team.Name}</td>
         

                    <td className="p-2 text-center space-x-3">
                      <button className="text-yellow-500 hover:text-yellow-600" onClick={() => { setEditTeam(Team);setName(Team.Name);
    setSurname(Team.Surname);}}>
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

export default TeamPlayerManager;
