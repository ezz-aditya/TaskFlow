const Project = require("../models/Project");
const Task = require("../models/Task");

// Create Project
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Project name is required"
            });
        }

        const project = await Project.create({
            name,
            description,
            owner: req.user._id
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get All Projects
const getProjects = async (req, res) => {
    try {
        console.log("Logged in user:", req.user);

        const projects = await Project.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        console.log("Projects found:", projects);

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Update Project
const updateProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        project.name = req.body.name ?? project.name;
        project.description =
            req.body.description ?? project.description;

        await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Delete Project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        await Task.deleteMany({
            project: project._id
        });

        await project.deleteOne();

        res.status(200).json({
            message: "Project and its tasks deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject
};