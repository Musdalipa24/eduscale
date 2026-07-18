const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const academicYearController = require("../controllers/academicYearController");


// Academic Years
router.get("/", authMiddleware, academicYearController.getAllYears);
router.post("/", authMiddleware, authorizeRoles("Admin"), academicYearController.createYear);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), academicYearController.updateYear);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), academicYearController.deleteYear);

// Semesters
router.get("/semesters", authMiddleware, academicYearController.getAllSemesters);
router.post("/semesters", authMiddleware, authorizeRoles("Admin"), academicYearController.createSemester);
router.put("/semesters/:id", authMiddleware, authorizeRoles("Admin"), academicYearController.updateSemester);


module.exports = router;
