const express = require("express");
const db = require("../models");
const router = express.Router();
const { Planet, Contract } = db;

// 🚀 Helper function
const handleError = (res, error, msg = "Internal Server Error") => {
  console.error(msg, error);
  res.status(500).json({ error: msg });
};

// ✅ TEAMS
router.get("/Planet", async (_, res) => {
  try {
    const Planets = await Planet.findAll();
    res.json(Planets);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/Planet", async (req, res) => {
  const {Name,Surname } = req.body;
  if (!Name || !Surname ) return res.status(400).json({ error: "Planet name is required" });
  try {
    const newPlanet = await Planet.create({ Name,Surname });
res.json({ message: "Planet added", Planet: newPlanet });

  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Planet/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Surname } = req.body;
  if (!Name || !Surname) return res.status(400).json({ error: "Planet name is required" });

  try {
    const [updated] = await Planet.update({ Name, Surname }, { where: { PlanetId: id } });
    if (!updated) return res.status(404).json({ error: "Planet not found" });
    res.json({ message: "Planet updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Planet/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await Contract.destroy({ where: { PlanetId: id } });
    const deleted = await Planet.destroy({ where: { PlanetId: id } });

    if (!deleted) return res.status(404).json({ error: "Planet not found" });

    res.json({ message: "Planet deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Planet:", error);
    res.status(500).json({ error: error.message || "Failed to delete Planet" });
  }
});



// ✅ PLAYERS
router.get("/Contract", async (_, res) => {
  try {
    const Contracts = await Contract.findAll({ include: Planet });
    res.json(Contracts);
  } catch (error) {
    handleError(res, error);
  }
});




router.post("/Contract", async (req, res) => {
  const { Title,Description, PlanetId } = req.body;

  if ( !Title|| !Description || !PlanetId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newContract = await Contract.create({ Title,Description,PlanetId });
    return res.json({ message: "Contract added", Contract: newContract }); // ✅ return added
  } catch (error) {
    if (!res.headersSent) {
      console.error("Error adding Contract:", error);
      return res.status(500).json({ error: "Something went wrong while adding Contract" });
    }
  }
});


router.put("/Contract/:id", async (req, res) => {
  const { id } = req.params;
  const { Title, Description, PlanetId } = req.body;

  try {
    await Contract.update({ Title, Description, PlanetId }, { where: { Id: id } });
    res.json({ message: "Contract updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Contract/:id", async (req, res) => {
  try {
    await Contract.destroy({ where: { id: req.params.id } });
    res.json({ message: "Contract deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;