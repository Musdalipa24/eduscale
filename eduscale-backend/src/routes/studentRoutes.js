const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const studentController = require("../controllers/studentController");


router.get("/", authMiddleware, studentController.getAll);
router.get("/export", authMiddleware, authorizeRoles("Admin"), studentController.exportStudents);
router.get("/:id", authMiddleware, studentController.getById);
router.post("/", authMiddleware, authorizeRoles("Admin"), studentController.create);
router.post("/import", authMiddleware, authorizeRoles("Admin"), studentController.importStudents);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), studentController.update);
router.put("/:id/status", authMiddleware, authorizeRoles("Admin"), studentController.updateStatus);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), studentController.delete);


module.exports = router;
