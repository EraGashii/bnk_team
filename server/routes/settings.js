const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/database"); // Import database connection


// 📌 Merr të dhënat e përdoruesit nga MySQL
router.get("/", (req, res) => {
    const userId = req.user?.id || 1; // Siguro që ka një userId të vlefshëm
    if (!userId) {
        console.error("Error: userId is undefined!");
        return res.status(400).json({ error: "User ID is required" });
    }

    console.log("User ID:", userId);
    db.query("SELECT email, notifications FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(results[0]); // Kthen të dhënat e përdoruesit
    });
});

// 📌 Ndryshimi i fjalëkalimit
router.put("/password", async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = 1;

    // Gjej fjalëkalimin aktual të përdoruesit nga databaza
    db.query("SELECT password FROM users WHERE id = ?", [userId], async (err, results) => {
        if (err) return res.status(500).send(err);

        const isMatch = await bcrypt.compare(oldPassword, results[0].password);
        if (!isMatch) return res.status(400).send("Incorrect password");

        // Enkripto fjalëkalimin e ri dhe përditësoje
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId], (err) => {
            if (err) return res.status(500).send(err);
            res.send("Password updated!");
        });
    });
});

// 📌 Ndryshimi i email-it
router.put("/email", (req, res) => {
    const { email } = req.body;
    const userId = 1;
    db.query("UPDATE users SET email = ? WHERE id = ?", [email, userId], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Email updated!");
    });
});

// 📌 Aktivizimi/Çaktivizimi i njoftimeve
router.put("/notifications", (req, res) => {
    const { notifications } = req.body;
    const userId = 1;
    db.query("UPDATE users SET notifications = ? WHERE id = ?", [notifications, userId], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Notifications updated!");
    });
});

// 📌 Fshirja e llogarisë së përdoruesit
router.delete("/delete", (req, res) => {
    const userId = 1;
    db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Account deleted!");
    });
});

module.exports = router;
