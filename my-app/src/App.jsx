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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [background, setBackground] = useState("/bg1.jpg");
  const [selectedTask, setSelectedTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${background})`;
  }, [background]);

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

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
          <TopBar />

          {currentPage === "dashboard" && (
            <>
              <h1 className="title">My Projects</h1>
              <TaskList
                tasks={projects}
                onTaskClick={(task) => {
                setSelectedTask(task);
                setCurrentPage("details");
                }}
                />
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


        </main>
      </div>
    </div>
  );
}