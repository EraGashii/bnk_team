"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

import {
  fetchPlayers,
  fetchTeams,
  addPlayer,
  deletePlayer,
  addTeam,
  updateTeam,
  deleteTeam,
} from "../../teamPlayerApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Team {
  id: number;
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
  const [playerData, setPlayerData] = useState({ Name: "", Number: "", BirthYear: "", TeamId: "" });
  const [teamName, setTeamName] = useState<string>("");
  const [editTeam, setEditTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadTeams();
    loadPlayers();
  }, []);

  const loadTeams = async () => {
    const data = await fetchTeams();
    setTeams(data);
  };

  const loadPlayers = async () => {
    const data = await fetchPlayers();
    setPlayers(data);
  };

  const handlePlayerInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPlayerData({ ...playerData, [e.target.name]: e.target.value });
  };

  const handleAddPlayer = async () => {
    await addPlayer(playerData);
    setPlayerData({ Name: "", Number: "", BirthYear: "", TeamId: "" });
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
      await updateTeam(editTeam.id, teamName);
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
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "players" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("players")}
        >
          Players
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "teams" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("teams")}
        >
          Teams
        </button>
      </div>

      {tab === "players" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-black">Players Management</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" name="Name" placeholder="Name" value={playerData.Name} onChange={handlePlayerInput} className="border px-3 py-2 w-1/4" />
            <input type="number" name="Number" placeholder="Number" value={playerData.Number} onChange={handlePlayerInput} className="border px-3 py-2 w-1/4" />
            <input type="number" name="BirthYear" placeholder="Birth Year" value={playerData.BirthYear} onChange={handlePlayerInput} className="border px-3 py-2 w-1/4" />
            <select name="TeamId" value={playerData.TeamId} onChange={handlePlayerInput} className="border px-3 py-2 w-1/4">
              <option value="">Select Team</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.Name}</option>)}
            </select>
            <button onClick={handleAddPlayer} className="bg-blue-500 text-white px-4 rounded">+ Add</button>
          </div>

          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left text-black">#</th>
                <th className="p-2 text-left text-black">Name</th>
                <th className="p-2 text-left text-black">Number</th>
                <th className="p-2 text-left text-black">BirthYear</th>
                <th className="p-2 text-left text-black">Team</th>
                <th className="p-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id} className="border-t text-black">
                  <td className="p-2 ">{i + 1}</td>
                  <td className="p-2 text-black">{p.Name}</td>
                  <td className="p-2 text-black">{p.Number}</td>
                  <td className="p-2 text-black">{p.BirthYear}</td>
                  <td className="p-2 text-black">{p.Team?.Name || "N/A"}</td>
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
          <h2 className="text-lg font-bold mb-4 text-black">Teams Management</h2>
          <div className="flex mb-4">
            <input
              type="text"
              className="border px-3 py-2 mr-2 w-full"
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

          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left text-black">#</th>
                <th className="p-2 text-left text-black" >Team Name</th>
                <th className="p-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => (
                <tr key={team.id} className="border-t text-black">
                  <td className="p-2 text-black">{i + 1}</td>
                  <td className="p-2 text-black">{team.Name}</td>
                  <td className="p-2 text-center space-x-3">
                    <button
                      className="text-yellow-500 hover:text-yellow-600"
                      onClick={() => {
                        setEditTeam(team);
                        setTeamName(team.Name);
                      }}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteTeam(team.id)}
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

export default TeamPlayerManager;
