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
import AdminPanel from "./pages/AdminPanel";
import EditStudent from "./pages/EditStudent";
import { fetchProjects } from "./api/projektApi";
import AddTaskPage from "./pages/AddTask/AddTask";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  useEffect(() => {
    fetchProjects(page, size, debouncedSearch).then(data => {
      setProjects(data.projects);
      setTotalPages(data.totalPages);
    });
  }, [page, size, debouncedSearch]);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: "Nieprawidlowy login lub haslo" };
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
          <TopBar setCurrentPage={setCurrentPage} />

          {currentPage === "dashboard" && (
            <>
              <div className="dashboard-header">
                <h1 className="title">My Projects</h1>
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
                  setCurrentPage={setCurrentPage}
                  setEditedTask={setEditedTask}
              />
           )}

          {currentPage === "settings" && (
            <Settings setBackground={setBackground} />
          )}

          {
              currentPage === "admin" && (
                  <AdminPanel
                      setCurrentPage={setCurrentPage}
                      setSelectedUser={setSelectedUser}
                  />
              )
          }

          {
              currentPage === "editUser" && (
                  <EditStudent
                      user={selectedUser}
                      setCurrentPage={setCurrentPage}
                  />
              )
          }

          {currentPage === "addTask" && (
              <AddTaskPage
                  task={editedTask}
                  setCurrentPage={setCurrentPage}
              />
          )}


        </main>
      </div>
    </div>
  );
}