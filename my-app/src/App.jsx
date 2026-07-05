import { useState, useEffect } from "react";
import "./styles.css";
import "./index.css";
import "./App.css";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TaskList from "./components/TaskList";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectDetails from "./pages/ProjectDetails";
import { fetchProjects } from "./api/projektApi";

const KEYCLOAK_TOKEN_URL =
    "http://localhost:8180/realms/programowanie-zwinne/protocol/openid-connect/token";
const BACKEND_URL = "http://localhost:8081";

export default function App({ keycloak, isKeycloakAuthenticated }) {
    const [isAuthenticated, setIsAuthenticated] = useState(isKeycloakAuthenticated || false);
    const [authPage, setAuthPage] = useState("landing");
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [background, setBackground] = useState("/bg1.jpg");
    const [selectedTask, setSelectedTask] = useState(null);
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
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

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchProjects(page, size, debouncedSearch).then((data) => {
            setProjects(data.projects);
            setTotalPages(data.totalPages);
        });
    }, [page, size, debouncedSearch, isAuthenticated]);

    const handleLogin = async (username, password) => {
        try {
            const params = new URLSearchParams({
                grant_type: "password",
                client_id: "react-frontend",
                username,
                password,
            });

            const res = await fetch(KEYCLOAK_TOKEN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                return {
                    success: false,
                    message: err.error_description || "Nieprawidłowy login lub hasło",
                };
            }

            const data = await res.json();
            keycloak.token = data.access_token;
            keycloak.refreshToken = data.refresh_token;
            setIsAuthenticated(true);
            return { success: true };
        } catch {
            return { success: false, message: "Nie można połączyć się z serwerem" };
        }
    };

    const handleRegister = async ({ firstName, lastName, email, password }) => {
        try {
            const res = await fetch(`${BACKEND_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: firstName, surname: lastName, email, password }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                let message = "Błąd rejestracji";
                try {
                    const parsed = JSON.parse(text);
                    message = parsed.message || parsed.error || message;
                } catch {}
                return { success: false, message };
            }

            setRegisterSuccess(true);
            setAuthPage("login");
            return { success: true };
        } catch {
            return { success: false, message: "Nie można połączyć się z serwerem" };
        }
    };

    const handleSocialLogin = (provider) => {
        keycloak.login({
            idpHint: provider,
            redirectUri: window.location.origin,
        });
    };

    if (!isAuthenticated) {
        if (authPage === "register") {
            return (
                <RegisterPage
                    onRegister={handleRegister}
                    onShowLogin={() => setAuthPage("login")}
                    onSocialLogin={handleSocialLogin}
                />
            );
        }
        if (authPage === "login") {
            return (
                <LoginPage
                    onLogin={handleLogin}
                    onShowRegister={() => {
                        setRegisterSuccess(false);
                        setAuthPage("register");
                    }}
                    onSocialLogin={handleSocialLogin}
                    registerSuccess={registerSuccess}
                />
            );
        }
        return (
            <LandingPage
                onShowLogin={() => {
                    setRegisterSuccess(false);
                    setAuthPage("login");
                }}
                onShowRegister={() => setAuthPage("register")}
            />
        );
    }

    return (
        <div className="background">
            <div className="app-container">
                <Sidebar setCurrentPage={setCurrentPage} />

                <main className="main-content">
                    <TopBar />

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
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                >
                                    Poprzednia
                                </button>
                                <span>
                                    Strona {page + 1} z {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
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
        </div>
    );
}