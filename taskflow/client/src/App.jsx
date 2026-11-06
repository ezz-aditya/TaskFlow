
import { useState } from "react";
import API from "./api/api";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const payload = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await API.post(endpoint, payload);

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setCurrentPage("dashboard");
      } else {
        setMessage("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
    setSelectedProject(null);
    setMessage("");
  };

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    setCurrentPage("tasks");
  };

  if (isAuthenticated) {
    return (
      <>
        {currentPage === "dashboard" ? (
          <Dashboard
            onLogout={handleLogout}
            onNavigate={setCurrentPage}
          />
        ) : currentPage === "projects" ? (
          <Projects
            onOpenProject={handleOpenProject}
            onNavigate={setCurrentPage}
          />
        ) : currentPage === "tasks" && selectedProject ? (
          <Tasks
            projectId={selectedProject._id}
            projectName={selectedProject.name}
            onBack={() => setCurrentPage("projects")}
          />
        ) : (
          <Projects
            onOpenProject={handleOpenProject}
            onNavigate={setCurrentPage}
          />
        )}
      </>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">
            <span className="brand-symbol">T</span>
          </div>

          <h1>TaskFlow</h1>
        </div>

        <p className="subtitle">
          {isLogin
            ? "Welcome back! Sign in to continue."
            : "Create your account and get organized."}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="switch-text">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            className="switch-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
