const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const classController = require("../controllers/classController");


router.get("/", authMiddleware, classController.getAll);
router.get("/:id", authMiddleware, classController.getById);
router.get("/:id/students", authMiddleware, classController.getStudentsByClass);
router.post("/", authMiddleware, authorizeRoles("Admin"), classController.create);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), classController.update);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), classController.delete);


module.exports = router;
