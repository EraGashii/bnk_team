const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../models"); // ✅ Ensure database is imported

// 📌 Get User Settings
router.get("/", (req, res) => {
    const userId = req.user?.id; // Use authenticated user ID
    if (!userId) {
        console.error("Error: userId is undefined!");
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("User ID:", userId);
    db.query("SELECT email, notifications FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(results[0]);
    });
});

// 📌 Update Email
router.put("/email", (req, res) => {
    const { email } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!email) return res.status(400).json({ error: "Email is required" });

    db.query("UPDATE users SET email = ? WHERE id = ?", [email, userId], (err) => {
        if (err) {
            console.error("Email update error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Email updated successfully" });
    });
});

// 📌 Update Password
router.put("/password", async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!oldPassword || !newPassword) return res.status(400).json({ error: "Both passwords are required" });

    db.query("SELECT password FROM users WHERE id = ?", [userId], async (err, results) => {
        if (err || results.length === 0) return res.status(500).json({ error: "User not found or database error" });

        const isMatch = await bcrypt.compare(oldPassword, results[0].password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId], (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Password updated successfully" });
        });
    });
});

// 📌 Toggle Notifications
router.put("/notifications", (req, res) => {
    const { notifications } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    db.query("UPDATE users SET notifications = ? WHERE id = ?", [notifications, userId], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Notifications updated!" });
    });
});

// 📌 Delete Account
router.delete("/delete", (req, res) => {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Account deleted!" });
    });
});

module.exports = router;
