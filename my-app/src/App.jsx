import { useEffect, useState } from "react";
import "./styles.css";
import "./index.css";
import "./App.css";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TaskList from "./components/TaskList";
import ChatPage from "./components/ChatPage";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectDetails from "./pages/ProjectDetails";
import AdminPanel from "./pages/AdminPanel";
import EditStudent from "./pages/EditStudent";
import AddTaskPage from "./pages/AddTask/AddTask";
import AddProject from "./pages/AddProject/AddProject";
import { fetchProjects } from "./api/projektApi";
import AddProjectModal from "./components/AddProjectModal";
import keycloak from "./keycloak.js";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(keycloak?.authenticated || false);
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [background, setBackground] = useState("/bg1.jpg");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    document.body.style.backgroundImage = `url(${background})`;
  }, [background]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const loadProjects = () => {
    if (!isAuthenticated) return;

    fetchProjects(page, size, debouncedSearch)
      .then((data) => {
        setProjects(data.projects);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  };

  useEffect(() => {
    loadProjects();
  }, [page, size, debouncedSearch, isAuthenticated]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(
        "http://localhost:8080/realms/programowanie-zwinne/protocol/openid-connect/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: "react-frontend",
            grant_type: "password",
            username,
            password,
            scope: "openid",
          }),
        },
      );

      if (!response.ok) {
        let message = "Błędny login lub hasło";
        try {
          const errorData = await response.json();
          if (errorData.error_description) message = errorData.error_description;
        } catch {
          // Keep the default login error when the server response is not JSON.
        }
        return { success: false, message };
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
      return { success: false, message: "Błąd logowania" };
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
    <div className="background">
      <div className="app-container">
        <Sidebar
          setCurrentPage={setCurrentPage}
          setEditedTask={setEditedTask}
          currentPage={currentPage}
        />

        <main className="main-content">
          <TopBar
            onLogout={handleLogout}
            setCurrentPage={setCurrentPage}
            setEditedTask={setEditedTask}
          />

          {currentPage === "dashboard" && (
            <>
              <div className="dashboard-header">
                <h1 className="title">My Projects</h1>
                <button className="btn add-task" onClick={() => setIsAddModalOpen(true)}>
                  + Nowy projekt
                </button>
                <div className="search-container">
                  <input
                    className="search-input"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
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
                  disabled={page === 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                >
                  Poprzednia
                </button>
                <span>Strona {page + 1} z {totalPages}</span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                >
                  Następna
                </button>
                <select
                  value={size}
                  onChange={(event) => {
                    setSize(Number(event.target.value));
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
              setCurrentPage={setCurrentPage}
              setEditedTask={setEditedTask}
              refreshProjects={loadProjects}
              setSelectedTask={setSelectedTask}
            />
          )}

          {currentPage === "settings" && <Settings setBackground={setBackground} />}
          {currentPage === "admin" && (
            <AdminPanel
              setCurrentPage={setCurrentPage}
              setSelectedUser={setSelectedUser}
            />
          )}
          {currentPage === "editUser" && (
            <EditStudent user={selectedUser} setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "addTask" && (
            <AddTaskPage task={editedTask} setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "addProject" && (
            <AddProject
              setCurrentPage={setCurrentPage}
              refreshProjects={loadProjects}
            />
          )}
          {currentPage === "chat" && <ChatPage />}
        </main>
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectCreated={loadProjects}
      />
    </div>
  );
}
