const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const bkController = require("../controllers/bkController");


// BK Cases
router.get("/cases", authMiddleware, bkController.getAllCases);
router.post("/cases", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.createCase);
router.put("/cases/:id", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.updateCase);
router.delete("/cases/:id", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.deleteCase);

// Counseling
router.get("/counseling", authMiddleware, bkController.getAllCounseling);
router.post("/counseling", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.createCounseling);
router.put("/counseling/:id", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.updateCounseling);
router.delete("/counseling/:id", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.deleteCounseling);

// Violations
router.get("/violations", authMiddleware, bkController.getAllViolations);
router.post("/violations", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.createViolation);
router.put("/violations/:id", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.updateViolation);
router.delete("/violations/:id", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.deleteViolation);

// Achievements
router.get("/achievements", authMiddleware, bkController.getAllAchievements);
router.post("/achievements", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.createAchievement);
router.put("/achievements/:id", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.updateAchievement);
router.delete("/achievements/:id", authMiddleware, authorizeRoles("Admin", "Guru BK"), bkController.deleteAchievement);

// Rekap
router.get("/rekap/student/:student_id", authMiddleware, bkController.getRekapByStudent);
router.get("/rekap/class", authMiddleware, bkController.getRekapByClass);


module.exports = router;
