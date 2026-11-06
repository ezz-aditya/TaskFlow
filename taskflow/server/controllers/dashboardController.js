const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {
    const owner = req.user._id;

    const totalProjects = await Project.countDocuments({ owner });
    const totalTasks = await Task.countDocuments({ owner });
    const completedTasks = await Task.countDocuments({
      owner,
      status: "done",
    });
    const pendingTasks = await Task.countDocuments({
      owner,
      status: { $ne: "done" },
    });

    res.status(200).json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };