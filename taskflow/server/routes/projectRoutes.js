const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

// All project routes are protected
router.use(protect);

router.post("/", createProject);
router.get("/", getProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;