const express = require("express");
const db = require("../models");
const router = express.Router();
const { Team, Player } = db;

// 🚀 Helper function
const handleError = (res, error, msg = "Internal Server Error") => {
  console.error(msg, error);
  res.status(500).json({ error: msg });
};

// ✅ TEAMS
router.get("/teams", async (_, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/teams", async (req, res) => {
  const { Name } = req.body;
  if (!Name) return res.status(400).json({ error: "Team name is required" });
  try {
    const team = await Team.create({ Name });
    res.json({ message: "Team added", team });
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/teams/:id", async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;
  if (!Name) return res.status(400).json({ error: "Team name is required" });
  try {
    const [updated] = await Team.update({ Name }, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Team not found" });
    res.json({ message: "Team updated" });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/teams/:id", async (req, res) => {
  try {
    const deleted = await Team.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Team not found" });
    res.json({ message: "Team deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ PLAYERS
router.get("/players", async (_, res) => {
  try {
    const players = await Player.findAll({ include: Team });
    res.json(players);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/players", async (req, res) => {
  const { Name, Number, BirthYear, TeamId } = req.body;
  if (!Name || !Number || !BirthYear || !TeamId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const player = await Player.create({ Name, Number, BirthYear, TeamId });
    res.json({ message: "Player added", player });
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/players/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Number, BirthYear, TeamId } = req.body;
  try {
    await Player.update({ Name, Number, BirthYear, TeamId }, { where: { id } });
    res.json({ message: "Player updated" });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/players/:id", async (req, res) => {
  try {
    await Player.destroy({ where: { id: req.params.id } });
    res.json({ message: "Player deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;