const express = require('express');
const router = express.Router();
const {
    getStatsForResturant
} = require("../controllers/analysisController");
const { Owner } = require("../models/allModels");
const {
  authenticateUser,
  autherizeUser,
} = require("../middleware/authenticateUser");

router.get(
    "/owner/stats",
    authenticateUser(Owner),
    autherizeUser("Owner"),
    getStatsForResturant
  );
module.exports = router;
