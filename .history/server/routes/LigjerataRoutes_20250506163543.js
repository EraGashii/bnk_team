const express = require("express");
const router = express.Router();
const db = require("../models");
const { Ligjerata, Ligjeruesi } = db; // ✅ destructure BEFORE using

function handleError(res, error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
  

// router.get("/Ligjeratas", async (_, res) => {
//   try {
//     const Ligjeratas = await Ligjerata.findAll({
//       include: Ligjeruesi,
//     });
//     res.json(Ligjeratas);
//   } catch (error) {
//     console.error("❌ Error fetching Ligjeratas:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.get("/Ligjeruesis", async (req, res) => {
    try {
      const all = await Ligjeruesi.findAll();
      res.json(all);
    } catch (error) {
      console.error("❌ Error fetching Ligjeruesis:", error);
      res.status(500).json({ error: "Failed to fetch Ligjeruesis" });
    }
  });
  

  router.post("/Ligjeruesis", async (req, res) => {
    const { LecturerName, department, email } = req.body;
    if (!LecturerName || !department || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const newLecturer = await Ligjeruesi.create({ LecturerName, department, email });
      res.json({ message: "Ligjeruesi added", Ligjeruesi: newLecturer });
    } catch (error) {
      console.error("❌ Error in POST /Ligjeruesiss:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });
  

router.put("/Ligjeruesis/:id", async (req, res) => {
  const { id } = req.params;
  const {  LecturerName,department,email } = req.body;
  if (!LecturerName || !department || !email) return res.status(400).json({ error: "Ligjeruesi name is required" });
  try {
    const [updated] = await Ligjeruesi.update({ LecturerName,department,email }, { where: {LecturerId:id } });
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
  const { LectureName, LecturerId } = req.body;
  if (!LectureName  || !LecturerId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newLecture = await Ligjerata.create({ LectureName, LecturerId });
    res.json({ message: "Ligjerata added", Ligjerata: newLecture });
    
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Ligjeratas/:id", async (req, res) => {
  const { id } = req.params;
  const {LectureName, LecturerId } = req.body;
  try {
    await Ligjerata.update({LectureName, LecturerId }, { where: { id } });
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