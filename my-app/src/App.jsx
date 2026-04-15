import { useState, useEffect } from "react";
import "./styles.css";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TaskList from "./components/TaskList";
import Settings from "./pages/Settings";
import ProjectDetails from "./pages/ProjectDetails";
import { tasks } from "./data/tasks";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [background, setBackground] = useState("/bg1.jpg");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${background})`;
  }, [background]);

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
                tasks={tasks}
                onTaskClick={(task) => {
                setSelectedTask(task);
                setCurrentPage("details");
                }}
                />
            </>
          )}

          {currentPage === "details" && selectedTask && (
            <ProjectDetails
            task={selectedTask}
            onBack={() => setCurrentPage("dashboard")}
            />
           )}

          {currentPage === "settings" && (
            <Settings setBackground={setBackground} />
          )}


        </main>
      </div>
    </div>
  );
}