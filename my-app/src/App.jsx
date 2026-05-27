import { useState, useEffect } from "react";
import "./styles.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TaskList from "./components/TaskList";
import Settings from "./pages/Settings";
import ProjectDetails from "./pages/ProjectDetails";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { fetchProjects } from "./api/projektApi";

export default function App({ keycloak }) {
  // --- Stany dla nawigacji aplikacji ---
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [background, setBackground] = useState("/bg1.jpg");
  const [selectedTask, setSelectedTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Stany do obsługi autorskiego logowania/rejestracji ---
  const [isAuthenticated, setIsAuthenticated] = useState(keycloak?.authenticated || false);
  const [view, setView] = useState("login"); // "login" lub "register"
  const [authError, setAuthError] = useState("");

  // Zmiana tła pulpitu
  useEffect(() => {
    document.body.style.backgroundImage = `url(${background})`;
  }, [background]);

  // Pobieranie danych z backendu (tylko jeśli użytkownik jest zalogowany)
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchProjects()
          .then((data) => setProjects(data))
          .catch((err) => {
            console.error("Błąd pobierania projektów:", err);
            setProjects([]);
          })
          .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  // --- Funkcja cichego logowania przez Twój własny formularz ---
  const handleLogin = async (username, password) => {
    try {
      // Budujemy żądanie Direct Grant do Keycloaka (port 8180)
      const response = await fetch(
          "http://localhost:8180/realms/programowanie-zwinne/protocol/openid-connect/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "password",
              client_id: "react-frontend",
              username: username,
              password: password,
            }),
          }
      );

      if (!response.ok) {
        throw new Error("Błędne dane logowania");
      }

      const data = await response.json();

      // Przekazujemy zdobyte tokeny do instancji Keycloaka
      keycloak.token = data.access_token;
      keycloak.refreshToken = data.refresh_token;
      keycloak.idToken = data.id_token;
      keycloak.authenticated = true;

      // Ustawiamy stan w React, co natychmiast wpuści nas na pulpit
      setIsAuthenticated(true);
      setAuthError("");

      return { success: true };
    } catch (error) {
      console.error("Błąd logowania:", error);
      setAuthError("Nieprawidłowy login lub hasło.");
      return { success: false, message: "Nieprawidłowy login lub hasło." };
    }
  };

  // --- Funkcja rejestracji użytkownika w Keycloaku ---
  const handleRegister = async () => {
    try {
      // Wywołujemy oficjalny formularz rejestracji Keycloaka i każemy mu wrócić na nasz frontend
      await keycloak.register({
        redirectUri: "http://localhost:5173/"
      });
      return { success: true };
    } catch (error) {
      console.error("Błąd przekierowania do rejestracji:", error);
      return { success: false, message: "Nie udało się uruchomić rejestracji." };
    }
  };

  // --- WARUNKI STEROWANIA WIDOKAMI (Zabezpieczenie przed niezalogowanymi) ---
  if (!isAuthenticated) {
    return view === "login" ? (
        <LoginPage
            onLogin={handleLogin}
            onShowRegister={() => setView("register")}
            externalError={authError}
        />
    ) : (
        <RegisterPage
            onRegister={handleRegister}
            onShowLogin={() => setView("login")}
        />
    );
  }

  // --- WŁAŚCIWY PULPIT (Wyświetla się TYLKO po udanym zalogowaniu) ---
  return (
      <div className="background">
        <div className="app-container">
          <Sidebar setCurrentPage={setCurrentPage} />

          <main className="main-content">
            <TopBar />

            {currentPage === "dashboard" && (
                <>
                  <h1 className="title">My Projects</h1>
                  {loading ? (
                      <p>Ładowanie projektów...</p>
                  ) : (
                      <TaskList
                          tasks={projects}
                          onTaskClick={(task) => {
                            setSelectedTask(task);
                            setCurrentPage("details");
                          }}
                      />
                  )}
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
      </div>
  );
}