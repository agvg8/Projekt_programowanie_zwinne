import { useState, useEffect } from "react";
import "./styles.css";
import "./index.css"
import "./App.css"

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TaskList from "./components/TaskList";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectDetails from "./pages/ProjectDetails";
import { fetchProjects } from "./api/projektApi";
import AddProjectModal from "./components/AddProjectModal";

export default function App({ keycloak }) {
  const [isAuthenticated, setIsAuthenticated] = useState(keycloak?.authenticated || false);
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [background, setBackground] = useState("/bg1.jpg");
  const [selectedTask, setSelectedTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${background})`;
  }, [background]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const refreshProjects = () => {
    if (!isAuthenticated) return;
    fetchProjects(page, size, debouncedSearch).then(data => {
      setProjects(data.projects);
      setTotalPages(data.totalPages);
    }).catch(err => console.error("Error fetching projects:", err));
  };

  useEffect(() => {
    refreshProjects();
  }, [page, size, debouncedSearch, isAuthenticated]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/realms/programowanie-zwinne/protocol/openid-connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: "react-frontend",
          grant_type: "password",
          username: username,
          password: password,
          scope: "openid"
        })
      });

      if (!response.ok) {
        let msg = "Błędny login lub hasło";
        try {
          const errData = await response.json();
          if (errData.error_description) {
            msg = errData.error_description;
          }
        } catch (_) {}
        return { success: false, message: msg };
      }

      const data = await response.json();
      localStorage.setItem("kc_token", data.access_token);
      localStorage.setItem("kc_refreshToken", data.refresh_token);

      keycloak.token = data.access_token;
      keycloak.refreshToken = data.refresh_token;
      keycloak.idToken = data.id_token;
      keycloak.authenticated = true;

      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Błąd połączenia z serwerem logowania" };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kc_token");
    localStorage.removeItem("kc_refreshToken");
    setIsAuthenticated(false);
    keycloak.logout();
  };

  if (!isAuthenticated) {
    if (authPage === "register") {
      return <RegisterPage onShowLogin={() => setAuthPage("login")} />;
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onShowRegister={() => setAuthPage("register")}
      />
    );
  }

  return (
    <div
      className="background"
      //style={{ backgroundImage: `url(${background})` }}
    >

      <div className="app-container">
        <Sidebar setCurrentPage={setCurrentPage} />

        <main className="main-content">
          <TopBar onLogout={handleLogout} />

          {currentPage === "dashboard" && (
            <>
              <div className="dashboard-header">
                <h1 className="title">My Projects</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button className="btn add-task" style={{ margin: 0 }} onClick={() => setIsAddModalOpen(true)}>
                    + Nowy Projekt
                  </button>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
              </div>
              <TaskList
                tasks={projects}
                onTaskClick={(task) => {
                setSelectedTask(task);
                setCurrentPage("details");
                }}
                />
              <div className="pagination">
                <button 
                  onClick={() => setPage(p => Math.max(0, p - 1))} 
                  disabled={page === 0}
                >
                  Poprzednia
                </button>
                <span>Strona {page + 1} z {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                  disabled={page >= totalPages - 1}
                >
                  Następna
                </button>
                <select 
                  value={size} 
                  onChange={(e) => { 
                    setSize(Number(e.target.value)); 
                    setPage(0); 
                  }}
                >
                  <option value={5}>5 na stronę</option>
                  <option value={10}>10 na stronę</option>
                  <option value={20}>20 na stronę</option>
                </select>
              </div>
            </>
          )}

          {currentPage === "details" && selectedTask && (
            <ProjectDetails
            project={selectedTask}
            onBack={() => setCurrentPage("dashboard")}
            />
           )}

          {currentPage === "settings" && (
            <Settings setBackground={setBackground} />
          )}


        </main>
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectCreated={refreshProjects}
      />
    </div>
  );
}