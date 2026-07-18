const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const subjectController = require("../controllers/subjectController");


router.get("/", authMiddleware, subjectController.getAll);
router.post("/", authMiddleware, authorizeRoles("Admin"), subjectController.create);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), subjectController.update);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), subjectController.delete);


module.exports = router;
