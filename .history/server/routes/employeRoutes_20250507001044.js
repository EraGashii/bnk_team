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

router.post("/planets", async (req, res) => {
  const {Name,Type } = req.body;
  if (!Name || !Type ) return res.status(400).json({ error: "Employee name is required" });
  try {
    const newEmployee = await Employee.create({ Name,Type });
res.json({ message: "Employee added", Employee: newEmployee });

  } catch (error) {
    handleError(res, error);
  }
});

router.put("/planets/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Type } = req.body;
  if (!Name || !Type) return res.status(400).json({ error: "Employee name is required" });

  try {
    const [updated] = await Employee.update({ Name,Type }, { where: { EmployeeId: id } });
    if (!updated) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/planets/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await Satelite.destroy({ where: { EmployeeId: id } });
    const deleted = await Employee.destroy({ where: { EmployeeId: id } });

    if (!deleted) return res.status(404).json({ error: "Employee not found" });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Employee:", error);
    res.status(500).json({ error: error.message || "Failed to delete Employee" });
  }
});



// ✅ PLAYERS
router.get("/satelites", async (_, res) => {
  try {
    const Satelites = await Satelite.findAll({ include: Employee });
    res.json(Satelites);
  } catch (error) {
    handleError(res, error);
  }
});




router.post("/satelites", async (req, res) => {
  const { Name,EmployeeId } = req.body;

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


router.put("/satelites/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, EmployeeId } = req.body;

  try {
    await Satelite.update({ Name,EmployeeId }, { where: { id } });
    res.json({ message: "Satelite updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/satelites/:id", async (req, res) => {
  try {
    await Satelite.destroy({ where: { id: Number(req.params.id) } });
    if (deleted === 0) return res.status(404).json({ error: "Satelilllte not found" });
    res.json({ message: "Satelite deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;