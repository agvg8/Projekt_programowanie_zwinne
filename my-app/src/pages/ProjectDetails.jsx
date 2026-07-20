import {useState, useMemo, useEffect} from "react";
import { updateTaskPriorytet, fetchTasks, assignUserToTask, removeUserFromTask } from "../api/zadanieApi";
import {fetchProjectTasks, updateProject, fetchProject} from "../api/projektApi.js";
import { fetchUsers } from "../api/uzytkownikApi.js";
import { FaGoogle } from "react-icons/fa";
import AddTaskModal from "../components/AddTaskModal";

export default function ProjectDetails({ project, onBack }) {
    // lokalny stan projektu
    const [currentProject, setCurrentProject] = useState(project);
    const [isEditingDeadline, setIsEditingDeadline] = useState(false);
    const [tempDeadline, setTempDeadline] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    // Wczytaj szczegóły projektu i wszystkich użytkowników
    useEffect(() => {
        if (!project?.id) return;
        setIsEditingDeadline(false);

        // Fetch project details
        fetchProject(project.id)
            .then((data) => {
                setCurrentProject(data);
            })
            .catch((err) => console.error("Error fetching project details:", err));

        // Fetch all available users in the system
        fetchUsers()
            .then((data) => {
                setAllUsers(data.users || []);
            })
            .catch((err) => console.error("Error fetching system users:", err));
    }, [project]);

    const handleAssignUserToTask = async (taskId, userId) => {
        try {
            if (userId) {
                await assignUserToTask(taskId, Number(userId));
            } else {
                await removeUserFromTask(taskId);
            }
            refreshTasks();
        } catch (err) {
            alert("Błąd przypisywania użytkownika do zadania: " + err.message);
        }
    };

    // map backend priorytet → UI style
    const mapPriority = (priority) => {
        switch (priority) {
            case "LOW":
                return "low";
            case "MEDIUM":
                return "medium";
            case "HIGH":
                return "high";
            default:
                return "low";
        }
    };

    // lokalny stan (po sync z backendem)
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const refreshTasks = () => {
        if (!currentProject?.id) return;
        fetchProjectTasks(currentProject.id, page, size, debouncedSearch).then((data) => {
            setTasks(data.tasks.map(z => ({
                id: z.zadanieId,
                text: z.nazwa,
                opis: z.opis,
                priority: z.priorytet,
                uiPriority: mapPriority(z.priorytet),
                assignedUserId: z.uzytkownik ? z.uzytkownik.uzytkownikId : "",
                assignedUserName: z.uzytkownik ? `${z.uzytkownik.imie} ${z.uzytkownik.nazwisko}` : "Brak"
            })));
            setTotalPages(data.totalPages);
        }).catch(err => console.error("Error fetching project tasks:", err));
    };

    useEffect(() => {
        refreshTasks();
    }, [currentProject?.id, page, size, debouncedSearch]);

    // progress (HIGH = done, bo na razie nie ma logiki done/undone)
    const progress = useMemo(() => {
        if (!tasks.length) return 0;

        const done = tasks.filter((t) => t.priority === "HIGH").length;
        return Math.round((done / tasks.length) * 100);
    }, [tasks]);

    // zmiana priorytetu
    const cyclePriority = async (taskId, currentPriority) => {
        const next =
            currentPriority === "LOW"
                ? "MEDIUM"
                : currentPriority === "MEDIUM"
                    ? "HIGH"
                    : "LOW";

        // update backend
        await updateTaskPriorytet(taskId, next);

        // update UI
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        priority: next,
                        uiPriority: mapPriority(next),
                    }
                    : t
            )
        );
    };

    const handleStartEditDeadline = () => {
        const rawDate = currentProject.data_oddania;
        const formatted = rawDate ? rawDate.substring(0, 16) : "";
        setTempDeadline(formatted);
        setIsEditingDeadline(true);
    };

    const handleSaveDeadline = async () => {
        let formattedDeadline = null;
        if (tempDeadline) {
            formattedDeadline = tempDeadline.length === 16 ? `${tempDeadline}:00` : tempDeadline;
        }

        try {
            await updateProject({
                projektId: currentProject.id,
                nazwa: currentProject.nazwa,
                opis: currentProject.opis,
                dataOddania: formattedDeadline
            });

            setCurrentProject(prev => ({
                ...prev,
                data_oddania: formattedDeadline
            }));
            setIsEditingDeadline(false);
        } catch (err) {
            alert("Błąd podczas aktualizacji terminu projektu: " + err.message);
        }
    };

    const getGoogleCalendarUrl = (proj) => {
        if (!proj.data_oddania) return "#";
        try {
            const dateObj = new Date(proj.data_oddania);
            if (isNaN(dateObj.getTime())) return "#";

            // Event ends at the deadline, starts 1 hour earlier
            const endDate = new Date(dateObj.getTime());
            const startDate = new Date(dateObj.getTime() - 60 * 60 * 1000);

            const formatUTC = (d) => {
                return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
            };

            const dates = `${formatUTC(startDate)}/${formatUTC(endDate)}`;
            const text = `Deadline: ${proj.nazwa}`;
            const details = `Opis projektu: ${proj.opis || "Brak opisu."}\n\nTermin oddania: ${proj.data_oddania}`;

            return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
        } catch (e) {
            console.error("Error generating Google Calendar URL:", e);
            return "#";
        }
    };

    return (
        <div className="project-details">

            {/* BACK BUTTON */}
            <div className="details-header">
                <button className="back-btn" onClick={onBack}>
                    ← Back to dashboard
                </button>
            </div>

            {/* TITLE */}
            <h1 className="details-title">
                {currentProject.nazwa}
            </h1>

            {/* DESCRIPTION */}
            <p className="project-desc">
                {currentProject.opis}
            </p>

            {/* PROGRESS */}
            <div className="progress-wrapper">
                <div className="progress-info">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* INFO */}
            <div className="details-card">
                <div className="details-row">
                    <span className="label">Created:</span>
                    <span>{currentProject.data_utworzenia ? new Date(currentProject.data_utworzenia).toLocaleDateString("pl-PL") : "Brak"}</span>
                </div>

                <div className="details-row" style={{ alignItems: "center" }}>
                    <span className="label">Deadline:</span>
                    {isEditingDeadline ? (
                        <div className="deadline-edit-form">
                            <input
                                type="datetime-local"
                                value={tempDeadline}
                                onChange={(e) => setTempDeadline(e.target.value)}
                                className="deadline-input"
                            />
                            <div className="deadline-edit-actions">
                                <button className="btn-small save-btn" onClick={handleSaveDeadline}>Zapisz</button>
                                <button className="btn-small cancel-btn" onClick={() => setIsEditingDeadline(false)}>Anuluj</button>
                            </div>
                        </div>
                    ) : (
                        <div className="deadline-display">
                            <span className="deadline-val">
                                {currentProject.data_oddania
                                    ? new Date(currentProject.data_oddania).toLocaleString("pl-PL", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })
                                    : "Brak"}
                            </span>
                            <button className="edit-deadline-btn" onClick={handleStartEditDeadline} title="Edytuj termin">
                                ✏️
                            </button>
                        </div>
                    )}
                </div>

                <div className="details-row">
                    <span className="label">Tasks:</span>
                    <span>{tasks.length}</span>
                </div>

                {currentProject.data_oddania && (
                    <div className="google-calendar-section">
                        <a
                            href={getGoogleCalendarUrl(currentProject)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="google-calendar-btn"
                        >
                            <FaGoogle className="google-icon" /> Dodaj do Kalendarza Google
                        </a>
                    </div>
                )}
            </div>


            {/* TASK LIST */}
            <div className="subtasks-section">
                <div className="tasks-header">
                    <h2>Tasks</h2>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button className="btn add-task" style={{ margin: 0 }} onClick={() => setIsAddTaskModalOpen(true)}>
                            + Nowe zadanie
                        </button>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="subtasks-list">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`task-item ${task.uiPriority}`}
                            onClick={() =>
                                cyclePriority(task.id, task.priority)
                            }
                        >

                            {/* LEFT */}
                            <div className="task-left">
                                <div className="task-title">
                                    {task.text}
                                </div>

                                <div className="task-desc">
                                    {task.opis || "No description"}
                                </div>
                            </div>

                            {/* MIDDLE: User Assignment */}
                            <div className="task-user-assignment" onClick={(e) => e.stopPropagation()}>
                                <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b6b6b', display: 'block', marginBottom: '4px' }}>
                                    Przypisany:
                                </label>
                                <select
                                    value={task.assignedUserId || ""}
                                    onChange={(e) => handleAssignUserToTask(task.id, e.target.value)}
                                    className="task-user-select"
                                >
                                    <option value="">Brak przypisania</option>
                                    {allUsers.map(u => (
                                        <option key={u.uzytkownikId} value={u.uzytkownikId}>
                                            {u.imie} {u.nazwisko}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* RIGHT */}
                            <div className="task-priority">
                                {task.priority}
                            </div>

                        </div>
                    ))}
                </div>

                {totalPages > 0 && (
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
                )}
            </div>

            <AddTaskModal
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                projectId={currentProject.id}
                onTaskCreated={refreshTasks}
                currentTaskCount={tasks.length}
            />
        </div>
    );
}