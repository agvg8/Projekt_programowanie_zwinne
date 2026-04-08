import { useState, useEffect } from "react";
import "./styles.css";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TaskList from "./components/TaskList";
import Settings from "./pages/Settings";
import { tasks } from "./data/tasks";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [background, setBackground] = useState("/bg1.jpg");

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
              <TaskList tasks={tasks} />
            </>
          )}


          {currentPage === "settings" && (
            <Settings setBackground={setBackground} />
          )}


        </main>
      </div>
    </div>
  );
}