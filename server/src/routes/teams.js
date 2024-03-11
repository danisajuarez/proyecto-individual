const { Router } = require("express");
const router = Router();
const { Team } = require("../db");
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    console.log("buscando teams en la db...");
    const teams = await Team.findAll();
    if (!teams.length) {
      console.log("buscando teams en la api...");
      const drivers = await axios.get(" http://localhost:5000/drivers");

      const teamsSet = new Set();

      console.log("obteniendo teams de los drivers...");
      drivers.data.forEach((driver) => {
        if (!driver.teams) {
          return;
        }
        const driverTeams = driver.teams.split(",").map((x) => x.trim());

        driverTeams.forEach((team) => {
          teamsSet.add(team);
        });
      });

      console.log("guardando teams en la db...");
      const teamsDb = await Promise.all(
        Array.from(teamsSet).map(async (team) => {
          return await Team.create({
            nombre: team,
          });
        })
      );
      res.send(teamsDb);
    } else {
      return res.send(teams);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
