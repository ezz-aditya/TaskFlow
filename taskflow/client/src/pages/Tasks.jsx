
import { useEffect, useState } from "react";
import API from "../api/api";
import "./Tasks.css";

function Tasks({ projectId, projectName, onBack }) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchTasks = async () => {
        try {
            setError("");
            const res = await API.get(`/tasks/project/${projectId}`);
            setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const handleCreateTask = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        try {
            setCreating(true);
            setError("");

            await API.post(`/tasks/project/${projectId}`, {
                title: title.trim(),
                description: description.trim(),
            });

            setTitle("");
            setDescription("");
            await fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create task");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="task-layout">
            <aside className="task-sidebar">
                <div className="task-brand">
                    <div className="task-brand-icon">T</div>
                    <span>TaskFlow</span>
                </div>

                <div className="task-sidebar-label">WORKSPACE</div>

                <button className="task-nav-item" onClick={onBack}>
                    <span>▦</span> Dashboard
                </button>

                <button className="task-nav-item active" onClick={onBack}>
                    <span>◈</span> Projects
                </button>

                <div className="task-sidebar-bottom">
                    <div className="task-user-avatar">A</div>
                    <div>
                        <strong>My Workspace</strong>
                        <small>Personal account</small>
                    </div>
                </div>
            </aside>

            <main className="task-main">
                <header className="task-topbar">
                    <div className="task-breadcrumb">
                        Workspace <span>/</span> Projects <span>/</span>
                        <strong>{projectName}</strong>
                    </div>

                    <button className="task-back-btn" onClick={onBack}>
                        ← Back to Projects
                    </button>
                </header>

                <section className="task-content">
                    <div className="task-heading">
                        <div>
                            <div className="task-eyebrow">PROJECT WORKSPACE</div>
                            <h1>{projectName}</h1>
                            <p>Organize your work and keep everything moving.</p>
                        </div>

                        <div className="task-heading-icon">◈</div>
                    </div>

                    <div className="task-stats">
                        <div className="task-stat-card">
                            <span className="task-stat-icon purple">▤</span>
                            <div>
                                <small>Total tasks</small>
                                <h2>{tasks.length}</h2>
                            </div>
                        </div>

                        <div className="task-stat-card">
                            <span className="task-stat-icon green">✓</span>
                            <div>
                                <small>Completed</small>
                                <h2>
                                    {tasks.filter(
                                        (task) => task.status === "completed"
                                    ).length}
                                </h2>
                            </div>
                        </div>

                        <div className="task-stat-card">
                            <span className="task-stat-icon orange">◷</span>
                            <div>
                                <small>In progress</small>
                                <h2>
                                    {tasks.filter(
                                        (task) => task.status === "in-progress"
                                    ).length}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="task-workspace-grid">
                        <section className="task-list-panel">
                            <div className="task-panel-header">
                                <div>
                                    <h2>Tasks</h2>
                                    <p>Your project tasks in one place</p>
                                </div>
                                <span className="task-count">
                                    {tasks.length} tasks
                                </span>
                            </div>

                            {loading ? (
                                <div className="task-empty-state">
                                    <div className="task-loader" />
                                    <p>Loading tasks...</p>
                                </div>
                            ) : tasks.length === 0 ? (
                                <div className="task-empty-state">
                                    <div className="task-empty-icon">▤</div>
                                    <h3>No tasks yet</h3>
                                    <p>
                                        Your task list is empty. Create your
                                        first task to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="task-list">
                                    {tasks.map((task) => (
                                        <div className="task-item" key={task._id}>
                                            <div className="task-checkbox">
                                                {task.status === "completed"
                                                    ? "✓"
                                                    : ""}
                                            </div>

                                            <div className="task-item-content">
                                                <h3>{task.title}</h3>
                                                <p>
                                                    {task.description ||
                                                        "No description added"}
                                                </p>
                                            </div>

                                            <span
                                                className={`task-status ${
                                                    task.status || "pending"
                                                }`}
                                            >
                                                {(task.status || "pending")
                                                    .replace("-", " ")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="task-create-panel">
                            <div className="task-panel-header">
                                <div>
                                    <h2>Create a task</h2>
                                    <p>Add something to your to-do list</p>
                                </div>
                            </div>

                            <form
                                className="task-create-form"
                                onSubmit={handleCreateTask}
                            >
                                <label>Task title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Design landing page"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    required
                                />

                                <label>Description</label>
                                <textarea
                                    placeholder="What needs to be done?"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows="4"
                                />

                                {error && (
                                    <div className="task-error">{error}</div>
                                )}

                                <button
                                    className="task-create-btn"
                                    type="submit"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "+ Create Task"}
                                </button>
                            </form>

                            <div className="task-form-tip">
                                <span>✦</span>
                                <p>
                                    <strong>Tip</strong>
                                    <br />
                                    Break large projects into smaller,
                                    manageable tasks.
                                </p>
                            </div>
                        </section>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Tasks;
