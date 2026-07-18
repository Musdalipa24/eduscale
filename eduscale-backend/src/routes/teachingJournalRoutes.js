const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const journalController = require("../controllers/teachingJournalController");


router.get("/", authMiddleware, journalController.getAll);
router.get("/rekap/teacher", authMiddleware, journalController.getRekapByTeacher);
router.get("/rekap/class", authMiddleware, journalController.getRekapByClass);
router.get("/:id", authMiddleware, journalController.getById);
router.post("/", authMiddleware, authorizeRoles("Admin", "Guru"), journalController.create);
router.put("/:id", authMiddleware, authorizeRoles("Admin", "Guru"), journalController.update);
router.delete("/:id", authMiddleware, authorizeRoles("Admin", "Guru"), journalController.delete);


module.exports = router;
