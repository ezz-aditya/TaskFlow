
import { useEffect, useState } from "react";
import API from "../api/api";
import "./Projects.css";

function Projects({ onOpenProject, onNavigate }) {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects");

            setProjects(
                Array.isArray(res.data)
                    ? res.data
                    : res.data.projects ||
                    res.data.data ||
                    res.data.projectsList ||
                    []
            );
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load projects"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Project name is required");
            return;
        }

        try {
            setCreating(true);
            setError("");

            await API.post("/projects", {
                name: name.trim(),
                description: description.trim(),
            });

            setName("");
            setDescription("");
            await fetchProjects();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create project"
            );
        } finally {
            setCreating(false);
        }
    };

    const filteredProjects = projects.filter((project) =>
        `${project.name} ${project.description || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="project-layout">
            <aside className="project-sidebar">
                <div className="project-brand">
                    <div className="project-brand-icon">T</div>
                    <span>TaskFlow</span>
                </div>

                <div className="project-sidebar-label">WORKSPACE</div>

                <button
                    className="project-nav-item"
                    onClick={() => onNavigate("dashboard")}
                >
                    <span>▦</span> Dashboard
                </button>

                <button className="project-nav-item active">
                    <span>◈</span> Projects
                </button>

                <div className="project-sidebar-bottom">
                    <div className="project-user-avatar">A</div>
                    <div>
                        <strong>My Workspace</strong>
                        <small>Personal account</small>
                    </div>
                </div>
            </aside>

            <main className="project-main">
                <header className="project-topbar">
                    <div className="project-breadcrumb">
                        Workspace <span>/</span> <strong>Projects</strong>
                    </div>

                    <div className="project-topbar-label">
                        Project Management
                    </div>
                </header>

                <section className="project-content">
                    <div className="project-heading">
                        <div>
                            <div className="project-eyebrow">
                                YOUR WORKSPACE
                            </div>
                            <h1>My Projects</h1>
                            <p>
                                Manage your projects and keep your work
                                organized.
                            </p>
                        </div>

                        <div className="project-heading-icon">◈</div>
                    </div>

                    <div className="project-stats">
                        <div className="project-stat-card">
                            <span className="project-stat-icon purple">▤</span>
                            <div>
                                <small>Total projects</small>
                                <h2>{projects.length}</h2>
                            </div>
                        </div>

                        <div className="project-stat-card">
                            <span className="project-stat-icon green">✓</span>
                            <div>
                                <small>Active workspace</small>
                                <h2>Personal</h2>
                            </div>
                        </div>

                        <div className="project-stat-card">
                            <span className="project-stat-icon orange">◷</span>
                            <div>
                                <small>Tasks organized</small>
                                <h2>Stay focused</h2>
                            </div>
                        </div>
                    </div>

                    <div className="project-toolbar">
                        <div>
                            <h2>All Projects</h2>
                            <p>Everything you are currently working on</p>
                        </div>

                        <div className="project-search">
                            <span>⌕</span>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="project-error">{error}</div>
                    )}

                    {loading ? (
                        <div className="project-empty-state">
                            <div className="project-loader" />
                            <p>Loading projects...</p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="project-empty-state">
                            <div className="project-empty-icon">▤</div>
                            <h3>
                                {search
                                    ? "No matching projects"
                                    : "No projects yet"}
                            </h3>
                            <p>
                                {search
                                    ? "Try searching with another keyword."
                                    : "Create your first project and start organizing your work."}
                            </p>
                        </div>
                    ) : (
                        <div className="project-grid">
                            {filteredProjects.map((project, index) => (
                                <div
                                    className="project-card"
                                    key={project._id}
                                >
                                    <div className="project-card-top">
                                        <div
                                            className={`project-card-icon color-${index % 4}`}
                                        >
                                            ◈
                                        </div>

                                        <span className="project-card-menu">
                                            ● ● ●
                                        </span>
                                    </div>

                                    <h3>{project.name}</h3>

                                    <p className="project-card-description">
                                        {project.description ||
                                            "No description added yet."}
                                    </p>

                                    <div className="project-card-footer">
                                        <span className="project-card-tag">
                                            <span />
                                            Project
                                        </span>

                                        <button
                                            onClick={() => onOpenProject(project)}
                                        >
                                            Open Project <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <section className="project-create-section">
                        <div className="project-create-heading">
                            <div>
                                <h2>Create a new project</h2>
                                <p>
                                    Start something new and bring your ideas
                                    to life.
                                </p>
                            </div>

                            <div className="project-create-symbol">+</div>
                        </div>

                        <form
                            className="project-create-form"
                            onSubmit={handleCreateProject}
                        >
                            <div className="project-form-fields">
                                <div>
                                    <label>Project name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Website Redesign"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        placeholder="What is this project about?"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                className="project-create-btn"
                                type="submit"
                                disabled={creating}
                            >
                                {creating
                                    ? "Creating..."
                                    : "+ Create Project"}
                            </button>
                        </form>
                    </section>
                </section>
            </main>
        </div>
    );
}

export default Projects;
