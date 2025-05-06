"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  fetchPlayers,
  fetchteams,
  addPlayer,
  deletePlayer,
  addTeam,
  updateTeam,
  deleteTeam,
} from "../../../teamPlayerApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface Team {
  TeamId: number;
  Name: string;
}

interface Player {
  id: number;
  Name: string;
  Number: number;
  BirthYear: number;
  TeamId: number;
  Team?: Team;
}

const TeamPlayerManager: React.FC = () => {
  const [tab, setTab] = useState<"players" | "teams">("players");
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerData, setPlayerData] = useState({ Name: "", Number:0 , BirthYear: 0, TeamId: 0 });
  const [teamName, setTeamName] = useState<string>("");
  const [editTeam, setEditTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadTeams();
    loadPlayers();
  }, []);

  const loadTeams = async () => {
    const data = await fetchteams();
    setTeams(data);
  };

  const loadPlayers = async () => {
    const data = await fetchLigjeruesi();
    setPlayers(data);
  };

  const handlePlayerInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPlayerData({ ...playerData, [e.target.name]: e.target.value });
  };

  const handleAddPlayer = async () => {
    await addPlayer(playerData);
    setPlayerData({ Name: "", Number:0, BirthYear: 0, TeamId: 0 });
    loadPlayers();
  };

  const handleDeletePlayer = async (id: number) => {
    await deletePlayer(id);
    loadPlayers();
  };

  const handleAddTeam = async () => {
    if (!teamName.trim()) return alert("Team name is required");
    await addTeam(teamName);
    setTeamName("");
    loadTeams();
  };

  const handleUpdateTeam = async () => {
    if (editTeam) {
      await updateTeam(editTeam.TeamId, teamName);
      setEditTeam(null);
      setTeamName("");
      loadTeams();
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      await deleteTeam(id);
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
          <Link href="/crud" className="block hover:text-green-400">Crud</Link>
          <Link href="/crud2" className="block hover:text-green-400">Crud</Link>
        </nav>
        <div className="mt-auto">
          <button className="text-sm hover:text-red-500">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Team & Player Management</h1>
        <div className="flex space-x-4 mb-6">
          <button className={`px-4 py-2 rounded ${tab === "players" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("players")}>Players</button>
          <button className={`px-4 py-2 rounded ${tab === "teams" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("teams")}>Teams</button>
        </div>

        {tab === "players" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Players Management</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" name="Name" placeholder="Name" value={playerData.Name} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />
              <input type="number" name="Number" placeholder="Number" value={playerData.Number} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />
              <input type="number" name="BirthYear" placeholder="Birth Year" value={playerData.BirthYear} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />
              <select name="TeamId" value={playerData.TeamId} onChange={handlePlayerInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4">
                <option value="">Select Team</option>
                {teams.map((t) => <option key={t.TeamId} value={t.TeamId}>{t.Name}</option>)}
              </select>
              <button onClick={handleAddPlayer} className="bg-green-500 text-white px-4 rounded">+ Add</button>
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Number</th>
                  <th className="p-2 text-left">BirthYear</th>
                  <th className="p-2 text-left">Team</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {players.map((p, i) => (
                  <tr key={p.id} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{p.Name}</td>
                    <td className="p-2">{p.Number}</td>
                    <td className="p-2">{p.BirthYear}</td>
                    <td className="p-2">{p.Team?.Name || "N/A"}</td>
                    <td className="p-2 text-center">
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeletePlayer(p.id)}>
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "teams" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Teams Management</h2>
            <div className="flex mb-4">
              <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
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
                {teams.map((team, i) => (
                  <tr key={team.TeamId} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{team.Name}</td>
                    <td className="p-2 text-center space-x-3">
                      <button className="text-yellow-500 hover:text-yellow-600" onClick={() => { setEditTeam(team); setTeamName(team.Name); }}>
                        <FiEdit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteTeam(team.TeamId)}>
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
