const express = require("express");
const db = require("../models");
const router = express.Router();
const { Ligjeruesi, Ligjerata } = db;

// 🚀 Helper function
const handleError = (res, error, msg = "Internal Server Error") => {
  console.error(msg, error);
  res.status(500).json({ error: msg });
};

// ✅ TEAMS
router.get("/Ligjeruesis", async (_, res) => {
  try {
    const Ligjeruesis = await Ligjeruesi.findAll();
    res.json(Ligjeruesis);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/Ligjeruesis", async (req, res) => {
  const {  LecturerName  } = req.body;
  if (LecturerName ) return res.status(400).json({ error: "Ligjeruesi name is required" });
  try {
    const Ligjeruesi = await Ligjeruesi.create({  LecturerName });
    res.json({ message: "Ligjeruesi added", Ligjeruesi });
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Ligjeruesis/:id", async (req, res) => {
  const { id } = req.params;
  const {  LecturerName } = req.body;
  if (!LecturerName) return res.status(400).json({ error: "Ligjeruesi name is required" });
  try {
    const [updated] = await Ligjeruesi.update({ LecturerName }, { where: {LecturerId:id } });
    if (!updated) return res.status(404).json({ error: "Ligjeruesi not found" });
    res.json({ message: "Ligjeruesi updated" });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/Ligjeruesis/:id", async (req, res) => {
  const LecturerId = Number(req.params.id); // ✅ this line fixes the error

  try {
    // Optional if you don't have ON DELETE CASCADE
    await Ligjerata.destroy({ where: { LecturerId: LecturerId } });

    const deleted = await Ligjeruesi.destroy({ where: { LecturerId: LecturerId } });

    if (!deleted) return res.status(404).json({ error: "Ligjeruesi not found" });

    res.json({ message: "Ligjeruesi deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Ligjeruesi:", error);
    res.status(500).json({ error: error.message || "Failed to delete Ligjeruesi" });
  }
});


// ✅ PLAYERS
router.get("/Ligjeratas", async (_, res) => {
  try {
    const Ligjeratas = await Ligjerata.findAll({ include: Ligjeruesi });
    res.json(Ligjeratas);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/Ligjeratas", async (req, res) => {
  const { LectureName, Number, BirthYear, LecturerId } = req.body;
  if (!Name || !Number || !BirthYear || !LecturerId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const Ligjerata = await Ligjerata.create({ Name, Number, BirthYear, LecturerId });
    res.json({ message: "Ligjerata added", Ligjerata });
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Ligjeratas/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Number, BirthYear, LecturerId } = req.body;
  try {
    await Ligjerata.update({ Name, Number, BirthYear, LecturerId }, { where: { id } });
    res.json({ message: "Ligjerata updated" });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/Ligjeratas/:id", async (req, res) => {
  try {
    await Ligjerata.destroy({ where: { id: req.params.id } });
    res.json({ message: "Ligjerata deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;