const Task = require("../models/Task");
const Project = require("../models/Project");

// Create Task
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const { projectId } = req.params;

        if (!title) {
            return res.status(400).json({ message: "Task title is required" });
        }

        const project = await Project.findOne({
            _id: projectId,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            project: project._id,
            owner: req.user._id
        });

        res.status(201).json({ message: "Task created", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Tasks (filters + search)
const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status, priority, search } = req.query;

        const project = await Project.findOne({
            _id: projectId,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const filter = {
            project: projectId,
            owner: req.user._id
        };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const fields = ["title", "description", "status", "priority", "dueDate"];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                task[field] = req.body[field];
            }
        });

        await task.save();

        res.status(200).json({ message: "Task updated", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};