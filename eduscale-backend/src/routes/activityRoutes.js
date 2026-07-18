const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const activityController = require("../controllers/activityController");


router.get("/", authMiddleware, authorizeRoles("Admin"), activityController.getAll);


module.exports = router;
