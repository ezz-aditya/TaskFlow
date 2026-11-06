const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

router.use(protect);

// Tasks under a project
router.post("/project/:projectId", createTask);
router.get("/project/:projectId", getTasks);

// Update / delete task by ID
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;