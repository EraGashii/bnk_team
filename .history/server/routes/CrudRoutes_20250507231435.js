const express = require("express");
const db = require("../models");
const router = express.Router();
const { Team, Player } = db;

// 🚀 Helper function
const handleError = (res, error, msg = "Internal Server Error") => {
  console.error(msg, error);
  res.status(500).json({ error: msg });
};

// ✅ TEAMS
router.get("/Team", async (_, res) => {
  try {
    const Teams = await Team.findAll();
    res.json(Teams);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/Team", async (req, res) => {
  const {Name } = req.body;
  if (!Name ) return res.status(400).json({ error: "Team name is required" });
  try {
    const newTeam = await Team.create({ Name,Surname});
res.json({ message: "Team added", Team: newTeam });

  } catch (error) {
    handleError(res, error);
  }
});

router.put("/Team/:id", async (req, res) => {
  const { id } = req.params;
  const { Name,Surname} = req.body;
  if ( !Name||!Surname) return res.status(400).json({ error: "Team name is required" });

  try {
    const [updated] = await Team.update({ Name,Surname}, { where: {  TeamId: id } });
    if (!updated) return res.status(404).json({ error: "Team not found" });
    res.json({ message: "Team updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Team/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await Player.destroy({ where: { TeamId:id } });
    const deleted = await Team.destroy({ where: { TeamId: id } });

    if (!deleted) return res.status(404).json({ error: "Team not found" });

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting Team:", error);
    res.status(500).json({ error: error.message || "Failed to delete Team" });
  }
});
// router.get("/Player/byTeamName/:name", async (req, res) => {
//   const { name } = req.params;

//   try {
//     const planet = await Team.findOne({ where: { Name: name } });
//     if (!planet) return res.status(404).json({ error: "Team not found" });

//     const satelites = await Player.findAll({
//       where: { TeamId: planet.TeamId, isDeleted: false },
//       include: Team
//     });

//     res.json(satelites);
//   } catch (error) {
//     handleError(res, error);
//   }
// });



// ✅ PLAYERS
router.get("/Player", async (_, res) => {
  try {
    const Players = await Player.findAll({ include:Team });
    res.json(Players);
  } catch (error) {
    handleError(res, error);
  }
});



router.post("/Player", async (req, res) => {
  const { Title, Description,TeamId } = req.body;

  if (!Title ||!Description || !TeamId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newPlayer = await Player.create({ Title,Description,TeamId });
    return res.json({ message: "Player added", Player: newPlayer }); // ✅ return added
  } catch (error) {
    if (!res.headersSent) {
      console.error("Error adding Player:", error);
      return res.status(500).json({ error: "Something went wrong while adding Player" });
    }
  }
});


router.put("/Player/:id", async (req, res) => {
  const { id } = req.params;
  const { Title,Description, TeamId } = req.body;

  try {
    await Player.update({  Title,Description, TeamId }, { where: {Id:id } });
    res.json({ message: "Player updated" });
  } catch (error) {
    handleError(res, error);
  }
});


router.delete("/Player/:id", async (req, res) => {
  try {
    const deleted = await Player.destroy({ where: { id: Number(req.params.id) } });

    if (deleted === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json({ message: "Player deleted" });
  } catch (error) {
    console.error("Error deleting Player:", error);
    res.status(500).json({ error: "Failed to delete contract" });
  }
});



module.exports = router;