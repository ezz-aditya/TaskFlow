
import { useEffect, useState } from "react";
import API from "../api/api";
import "./Dashboard.css";

function Dashboard({ onLogout, onNavigate }) {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await API.get("/dashboard/stats");
                setStats(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard stats"
                );
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Projects",
            value: stats.totalProjects,
            icon: "▤",
        },
        {
            title: "Total Tasks",
            value: stats.totalTasks,
            icon: "☷",
        },
        {
            title: "Completed Tasks",
            value: stats.completedTasks,
            icon: "✓",
        },
        {
            title: "Pending Tasks",
            value: stats.pendingTasks,
            icon: "◷",
        },
    ];

    return (
        <div className="dashboard-page">
            <aside className="sidebar">
                
<div className="sidebar-brand">
    <div className="brand-icon">
        <span className="brand-symbol">T</span>
    </div>

    <span className="brand-name">TaskFlow</span>
</div>


                <div className="sidebar-label">WORKSPACE</div>

                <nav className="sidebar-nav">
                    <button
                        className="nav-item active"
                        onClick={() => onNavigate("dashboard")}
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => onNavigate("projects")}
                    >
                        <span>◈</span>
                        Projects
                    </button>
                </nav>

                <div className="sidebar-bottom">
                    <div className="sidebar-user">
                        <div className="user-avatar">A</div>
                        <div className="user-details">
                            <strong>My Workspace</strong>
                            <small>Personal account</small>
                        </div>
                    </div>

                    <button className="logout-btn" onClick={onLogout}>
                        <span>↪</span> Sign Out
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <p className="eyebrow">YOUR WORKSPACE</p>
                        <h1>Dashboard</h1>
                        <p className="header-subtitle">
                            A clear view of your work, all in one place.
                        </p>
                    </div>

                    <button
                        className="header-action"
                        onClick={() => onNavigate("projects")}
                    >
                        <span>+</span> New Project
                    </button>
                </header>

                <section className="welcome-banner">
                    <div className="welcome-content">
                        <span className="welcome-label">
                            TASKFLOW WORKSPACE
                        </span>
                        <h2>Make room for your best work.</h2>
                        <p>
                            Organize projects, track progress, and stay focused
                            on what matters.
                        </p>

                        <button
                            className="welcome-btn"
                            onClick={() => onNavigate("projects")}
                        >
                            Explore Projects <span>→</span>
                        </button>
                    </div>

                    <div className="welcome-decoration">
                        <div className="decoration-circle circle-one" />
                        <div className="decoration-circle circle-two" />
                        <div className="decoration-card">
                            <span className="decoration-check">✓</span>
                            <div>
                                <strong>Stay on track</strong>
                                <small>One task at a time</small>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="stats-section">
                    <div className="section-heading">
                        <div>
                            <h2>Overview</h2>
                            <p>Your workspace at a glance</p>
                        </div>
                    </div>

                    <div className="stats-grid">
                        {statCards.map((card, index) => (
                            <div
                                className="stat-card"
                                key={card.title}
                            >
                                <div className={`stat-icon stat-icon-${index}`}>
                                    {card.icon}
                                </div>

                                <p>{card.title}</p>
                                <h2>{card.value}</h2>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-content">
                    <div className="content-card">
                        <div className="content-heading">
                            <div>
                                <h2>Project Overview</h2>
                                <p>Track your progress</p>
                            </div>

                            <span className="overview-icon">◈</span>
                        </div>

                        <div className="overview-row">
                            <span>Projects created</span>
                            <strong>{stats.totalProjects}</strong>
                        </div>

                        <div className="overview-row">
                            <span>Tasks completed</span>
                            <strong>{stats.completedTasks}</strong>
                        </div>

                        <div className="overview-row">
                            <span>Tasks remaining</span>
                            <strong>{stats.pendingTasks}</strong>
                        </div>
                    </div>

                    <div className="content-card focus-card">
                        <div className="focus-icon">✦</div>
                        <span className="focus-label">A LITTLE REMINDER</span>
                        <h2>Progress over perfection.</h2>
                        <p>
                            Every completed task brings your project one step
                            closer to the finish line.
                        </p>

                        <button
                            className="focus-btn"
                            onClick={() => onNavigate("projects")}
                        >
                            View Projects <span>→</span>
                        </button>
                    </div>
                </section>

                {error && (
                    <p className="dashboard-error">{error}</p>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
