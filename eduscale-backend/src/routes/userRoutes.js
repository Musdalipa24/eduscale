const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");


router.get("/", authMiddleware, authorizeRoles("Admin"), userController.getAll);
router.get("/:id", authMiddleware, authorizeRoles("Admin"), userController.getById);
router.post("/", authMiddleware, authorizeRoles("Admin"), userController.create);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), userController.update);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), userController.delete);
router.put("/:id/reset-password", authMiddleware, authorizeRoles("Admin"), userController.resetPassword);
router.put("/change-password/me", authMiddleware, userController.changePassword);


module.exports = router;
