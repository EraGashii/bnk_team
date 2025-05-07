const express = require("express");
const db = require("../models");
const router = express.Router();
const { Planet, Satelite } = db;

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
  const {Name,Type } = req.body;
  if (!Name || !Type) return res.status(400).json({ error: "Planet name is required" });
  try {
    const newPlanet = await Planet.create({ Name});
res.json({ message: "Planet added", Planet: newPlanet });

  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Planet/:id", async (req, res) => {
  const { id } = req.params;
  const { Name} = req.body;
  if (!Name|| !Type ) return res.status(400).json({ error: "Planet name is required" });

  try {
    const [updated] = await Planet.update({ Name,Type}, { where: { PlanetId:id } });
    if (!updated) return res.status(404).json({ error: "Planet not found" });
    res.json({ message: "Planet updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Planet/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await Satelite.destroy({ where: { PlanetId:id } });
    const deleted = await Planet.destroy({ where: { PlanetId: id } });

    if (!deleted) return res.status(404).json({ error: "Planet not found" });

    res.json({ message: "Planet deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Planet:", error);
    res.status(500).json({ error: error.message || "Failed to delete Planet" });
  }
});



// ✅ PLAYERS
router.get("/Satelite", async (_, res) => {
  try {
    const Satelites = await Satelite.findAll({ include:Planet });
    res.json(Satelites);
  } catch (error) {
    handleError(res, error);
  }
});



router.post("/Satelite", async (req, res) => {
  const { Name, Number, BirthYear,PlanetId } = req.body;

  if (!Name || !PlanetId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newSatelite = await Satelite.create({ Name,PlanetId });
    return res.json({ message: "Satelite added", Satelite: newSatelite }); // ✅ return added
  } catch (error) {
    if (!res.headersSent) {
      console.error("Error adding Satelite:", error);
      return res.status(500).json({ error: "Something went wrong while adding Satelite" });
    }
  }
});


router.put("/Satelite/:id", async (req, res) => {
  const { id } = req.params;
  const {  Name, PlanetId } = req.body;

  try {
    await Satelite.update({  Name, PlanetId }, { where: {Id:id } });
    res.json({ message: "Satelite updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Satelite/:id", async (req, res) => {
  try {
    const deleted = await Satelite.destroy({ where: { id: Number(req.params.id) } });

    if (deleted === 0) {
      return res.status(404).json({ error: "Satelite not found" });
    }

    res.json({ message: "Satelite deleted" });
  } catch (error) {
    console.error("Error deleting Satelite:", error);
    res.status(500).json({ error: "Failed to delete contract" });
  }
});



module.exports = router;