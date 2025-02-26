const express = require("express");
const router = express.Router();

// Simulim i të dhënave
let userSettings = {
  email: "user@example.com",
  notifications: true
};

router.get("/", (req, res) => {
  res.json(userSettings);
});

router.put("/email", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  userSettings.email = email;
  res.json({ message: "Email updated successfully" });
});

router.put("/password", (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ error: "Both passwords are required" });
  res.json({ message: "Password updated successfully" });
});

router.delete("/delete", (req, res) => {
  userSettings = { email: "", notifications: false };
  res.json({ message: "Account deleted" });
});

module.exports = router;
