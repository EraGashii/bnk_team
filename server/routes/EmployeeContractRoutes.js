const express = require("express");
const db = require("../models");
const router = express.Router();
const { Employee, Contract } = db;

const handleError = (res, error, msg = "Internal Server Error") => {
  console.error(msg, error);
  res.status(500).json({ error: msg });
};

// ✅ GET all Employees
router.get("/Employee", async (_, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ POST new Employee
router.post("/Employee", async (req, res) => {
  const { Name, Surname } = req.body;
  if (!Name || !Surname)
    return res.status(400).json({ error: "Name and Surname are required" });

  try {
    const newEmployee = await Employee.create({ Name, Surname });
    res.json({ message: "Employee added", employee: newEmployee });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ PUT update Employee
router.put("/Employee/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Surname } = req.body;

  if (!Name && !Surname)
    return res.status(400).json({ error: "At least one field is required" });

  try {
    const [updated] = await Employee.update(
      { Name, Surname },
      { where: { EmployeeId: id } }
    );
    if (!updated)
      return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee updated" });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ DELETE Employee
router.delete("/Employee/:id", async (req, res) => {
  try {
    const deleted = await Employee.destroy({
      where: { EmployeeId: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ GET all Contracts
router.get("/Contract", async (_, res) => {
  try {
    const contracts = await Contract.findAll({ include: Employee });
    res.json(contracts);
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ POST new Contract
router.post("/Contract", async (req, res) => {
  const { Name, Title, Description, EmployeeId } = req.body;
  if (!Name || !Title || !Description || !EmployeeId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newContract = await Contract.create({
      Name,
      Title,
      Description,
      EmployeeId,
    });
    res.json({ message: "Contract added", contract: newContract });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ PUT update Contract
router.put("/Contract/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Title, Description, EmployeeId } = req.body;

  try {
    await Contract.update(
      { Name, Title, Description, EmployeeId },
      { where: { id } }
    );
    res.json({ message: "Contract updated" });
  } catch (error) {
    handleError(res, error);
  }
});

// ✅ DELETE Contract
router.delete("/Contract/:id", async (req, res) => {
  try {
    await Contract.destroy({ where: { id: req.params.id } });
    res.json({ message: "Contract deleted" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
