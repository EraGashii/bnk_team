const express = require("express");
const db = require("../models");
const router = express.Router();
const { Employee, Contract } = db;

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
  const {Name,Surname } = req.body;
  if (!Name || !Surname ) return res.status(400).json({ error: "Employee name is required" });
  try {
    const newEmployee = await Employee.create({ Name,Surname});
res.json({ message: "Employee added", Employee: newEmployee });

  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Employee/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Surname} = req.body;
  if (!Name || !Surname) return res.status(400).json({ error: "Employee name is required" });

  try {
    const [updated] = await Employee.update({ Name,Surname }, { where: { EmployeeId: id } });
    if (!updated) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Employee/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await Contract.destroy({ where: { EmployeeId: id } });
    const deleted = await Employee.destroy({ where: { EmployeeId: id } });

    if (!deleted) return res.status(404).json({ error: "Employee not found" });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Employee:", error);
    res.status(500).json({ error: error.message || "Failed to delete Employee" });
  }
});



// ✅ PLAYERS
router.get("/Contract", async (_, res) => {
  try {
    const Contracts = await Contract.findAll({ include: Employee });
    res.json(Contracts);
  } catch (error) {
    handleError(res, error);
  }
});




router.post("/Contract", async (req, res) => {
  const { Name,EmployeeId } = req.body;

  if (!Name || !EmployeeId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newContract = await Contract.create({ Name,EmployeeId });
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
  const { Title, EmployeeId } = req.body;

  try {
    await Contract.update({ Title,EmployeeId }, { where: { id } });
    res.json({ message: "Contract updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Contract/:id", async (req, res) => {
  try {
    await Contract.destroy({ where: { id: Number(req.params.id) } });
    if (deleted === 0) return res.status(404).json({ error: "Satelilllte not found" });
    res.json({ message: "Contract deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;