const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const teacherController = require("../controllers/teacherController");


router.get("/", authMiddleware, teacherController.getAll);
router.get("/:id", authMiddleware, teacherController.getById);
router.post("/", authMiddleware, authorizeRoles("Admin"), teacherController.create);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), teacherController.update);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), teacherController.delete);


module.exports = router;
