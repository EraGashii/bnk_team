const express = require("express");
const db = require("../models");
const router = express.Router();
const { Ligjeruesi, Ligjerata } = db;

const handleError = (res, error, msg = "Internal Server Error") => {
  console.error(msg, error);
  res.status(500).json({ error: msg });
};

// ✅ GET all Ligjeruesis
router.get("/Ligjeruesi", async (_, res) => {
  try {
    const Ligjeruesis = await Ligjeruesi.findAll();
    res.json(Ligjeruesis);
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ POST new Ligjeruesi
router.post("/Ligjeruesi", async (req, res) => {
  const {  LecturerName, Departament, Email} = req.body;
  if (! LecturerName || !Departament || ! Email)
    return res.status(400).json({ error: " LecturerName, Email and Departament are required" });

  try {
    const newLigjeruesi = await Ligjeruesi.create({  LecturerName, Departament, Email});
    res.json({ message: "Ligjeruesi added", Ligjeruesi: newLigjeruesi });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ PUT update Ligjeruesi
router.put("/Ligjeruesi/:id", async (req, res) => {
  const { id } = req.params;
  const {  LecturerName,Departament, Email } = req.body;

  if (! LecturerName && ! Email &&!Departament)
    return res.status(400).json({ error: "At least one field is required" });

  try {
    const [updated] = await Ligjeruesi.update(
      {LecturerName, Departament, Email },
      { where: {  LecturerId: id } }
    );
    if (!updated)
      return res.status(404).json({ error: "Ligjeruesi not found" });
    res.json({ message: "Ligjeruesi updated" });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ DELETE Ligjeruesi
router.delete("/Ligjeruesi/:id", async (req, res) => {
  try {
    const deleted = await Ligjeruesi.destroy({
      where: {  LecturerId: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Ligjeruesi not found" });
    res.json({ message: "Ligjeruesi deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ GET all Ligjeratas
router.get("/Ligjerata", async (_, res) => {
  try {
    const Ligjeratas = await Ligjerata.findAll({ include: Ligjeruesi });
    res.json(Ligjeratas);
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ POST new Ligjerata
router.post("/Ligjerata", async (req, res) => {
  const {  LectureName,  LecturerId } = req.body;
  if (! LectureName  || ! LecturerId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newLigjerata = await Ligjerata.create({
        LectureName,
       LecturerId,
    });
    res.json({ message: "Ligjerata added", Ligjerata: newLigjerata });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ PUT update Ligjerata
router.put("/Ligjerata/:id", async (req, res) => {
  const { id } = req.params;
  const { LectureName,  LecturerId } = req.body;

  try {
    await Ligjerata.update(
      {  LectureName,  LecturerId },
      { where: { id } }
    );
    res.json({ message: "Ligjerata updated" });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ DELETE Ligjerata
router.delete("/Ligjerata/:id", async (req, res) => {
  try {
    await Ligjerata.destroy({ where: {LectureId: req.params.id } });
    res.json({ message: "Ligjerata deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
