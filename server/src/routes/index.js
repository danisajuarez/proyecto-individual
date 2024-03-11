const { Router } = require("express");
const driversRoute = require("./drivers");
const router = Router();
const teamsRoute = require("./teams");

router.use("/drivers", driversRoute);
router.use("/teams", teamsRoute);

module.exports = router;
