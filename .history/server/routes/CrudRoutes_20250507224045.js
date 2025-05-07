const express = require("express");
const db = require("../models");
const router = express.Router();
const { Employee, Satelite } = db;

// 🚀 Helper function
const handleError = (res, error, msg = "Internal Server Error") => {
  console.error(msg, error);
  res.status(500).json({ error: msg });
};

// ✅ TEAMS
router.get("/Employee", async (_, res) => {
  try {
    const Employees = await Employee.findAll();
    res.json(Employees);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/Employee", async (req, res) => {
  const {Name,Type } = req.body;
  if (!Name || !Type) return res.status(400).json({ error: "Employee name is required" });
  try {
    const newEmployee = await Employee.create({ Name,Type});
res.json({ message: "Employee added", Employee: newEmployee });

  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Employee/:id", async (req, res) => {
  const { name } = req.params;
  const { Type} = req.body;
  if ( !Type ) return res.status(400).json({ error: "Employee name is required" });

  try {
    const [updated] = await Employee.update({ Type}, { where: {  Name: name } });
    if (!updated) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Employee/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await Satelite.destroy({ where: { EmployeeId:id } });
    const deleted = await Employee.destroy({ where: { EmployeeId: id } });

    if (!deleted) return res.status(404).json({ error: "Employee not found" });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Employee:", error);
    res.status(500).json({ error: error.message || "Failed to delete Employee" });
  }
});
router.get("/Satelite/byEmployeeName/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const planet = await Employee.findOne({ where: { Name: name } });
    if (!planet) return res.status(404).json({ error: "Employee not found" });

    const satelites = await Satelite.findAll({
      where: { EmployeeId: planet.EmployeeId, isDeleted: false },
      include: Employee
    });

    res.json(satelites);
  } catch (error) {
    handleError(res, error);
  }
});



// ✅ PLAYERS
router.get("/Satelite", async (_, res) => {
  try {
    const Satelites = await Satelite.findAll({ include:Employee });
    res.json(Satelites);
  } catch (error) {
    handleError(res, error);
  }
});



router.post("/Satelite", async (req, res) => {
  const { Name, Number, BirthYear,EmployeeId } = req.body;

  if (!Name || !EmployeeId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newSatelite = await Satelite.create({ Name,EmployeeId });
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
  const {  Name, EmployeeId } = req.body;

  try {
    await Satelite.update({  Name, EmployeeId }, { where: {Id:id } });
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