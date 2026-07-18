const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");


router.get("/stats", authMiddleware, dashboardController.getStats);
router.get("/activities", authMiddleware, dashboardController.getRecentActivities);
router.get("/charts", authMiddleware, dashboardController.getChartData);


module.exports = router;
