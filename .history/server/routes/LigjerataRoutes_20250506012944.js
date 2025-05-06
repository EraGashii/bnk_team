const express = require("express");
const db = require("../models");
const router = express.Router();
const { Ligjeuesi, Ligjerata } = db;

// 🚀 Helper function
const handleError = (res, error, msg = "Internal Server Error") => {
  console.error(msg, error);
  res.status(500).json({ error: msg });
};

// ✅ TEAMS
router.get("/Ligjeuesis", async (_, res) => {
  try {
    const Ligjeuesis = await Ligjeuesi.findAll();
    res.json(Ligjeuesis);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/Ligjeuesis", async (req, res) => {
  const { Name } = req.body;
  if (!Name) return res.status(400).json({ error: "Ligjeuesi name is required" });
  try {
    const Ligjeuesi = await Ligjeuesi.create({ Name });
    res.json({ message: "Ligjeuesi added", Ligjeuesi });
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Ligjeuesis/:id", async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;
  if (!Name) return res.status(400).json({ error: "Ligjeuesi name is required" });
  try {
    const [updated] = await Ligjeuesi.update({ Name }, { where: {LigjeuesiId:id } });
    if (!updated) return res.status(404).json({ error: "Ligjeuesi not found" });
    res.json({ message: "Ligjeuesi updated" });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/Ligjeuesis/:id", async (req, res) => {
  const LigjeuesiId = Number(req.params.id); // ✅ this line fixes the error

  try {
    // Optional if you don't have ON DELETE CASCADE
    await Ligjerata.destroy({ where: { LigjeuesiId: LigjeuesiId } });

    const deleted = await Ligjeuesi.destroy({ where: { LigjeuesiId: LigjeuesiId } });

    if (!deleted) return res.status(404).json({ error: "Ligjeuesi not found" });

    res.json({ message: "Ligjeuesi deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Ligjeuesi:", error);
    res.status(500).json({ error: error.message || "Failed to delete Ligjeuesi" });
  }
});


// ✅ PLAYERS
router.get("/players", async (_, res) => {
  try {
    const players = await Ligjerata.findAll({ include: Ligjeuesi });
    res.json(players);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/players", async (req, res) => {
  const { Name, Number, BirthYear, LigjeuesiId } = req.body;
  if (!Name || !Number || !BirthYear || !LigjeuesiId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const player = await Ligjerata.create({ Name, Number, BirthYear, LigjeuesiId });
    res.json({ message: "Ligjerata added", player });
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/players/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Number, BirthYear, LigjeuesiId } = req.body;
  try {
    await Ligjerata.update({ Name, Number, BirthYear, LigjeuesiId }, { where: { id } });
    res.json({ message: "Ligjerata updated" });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/players/:id", async (req, res) => {
  try {
    await Ligjerata.destroy({ where: { id: req.params.id } });
    res.json({ message: "Ligjerata deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;