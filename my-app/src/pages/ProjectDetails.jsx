import {useState, useMemo, useEffect} from "react";
import { updateTaskPriorytet, fetchTasks } from "../api/zadanieApi";
import {fetchProjectTasks, updateProject, fetchProject, assignUserToProject, removeUserFromProject} from "../api/projektApi.js";
import { fetchUsers } from "../api/uzytkownikApi.js";
import { FaGoogle, FaUserPlus, FaUserMinus } from "react-icons/fa";
import AddTaskModal from "../components/AddTaskModal";

export default function ProjectDetails({ project, onBack }) {
    // lokalny stan projektu
    const [currentProject, setCurrentProject] = useState(project);
    const [isEditingDeadline, setIsEditingDeadline] = useState(false);
    const [tempDeadline, setTempDeadline] = useState("");
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserIdToAssign, setSelectedUserIdToAssign] = useState("");
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    // Wczytaj szczegóły projektu i wszystkich użytkowników
    useEffect(() => {
        if (!project?.id) return;
        setIsEditingDeadline(false);

        // Fetch project details to get latest assigned users
        fetchProject(project.id)
            .then((data) => {
                setCurrentProject(data);
                setAssignedUsers(data.uzytkownicy || []);
            })
            .catch((err) => console.error("Error fetching project details:", err));

        // Fetch all available users in the system
        fetchUsers()
            .then((data) => {
                setAllUsers(data.users || []);
            })
            .catch((err) => console.error("Error fetching system users:", err));
    }, [project]);

    const handleAssignUser = async () => {
        if (!selectedUserIdToAssign) return;
        try {
            await assignUserToProject(currentProject.id, Number(selectedUserIdToAssign));
            // Reload project details to sync state
            const updatedProject = await fetchProject(currentProject.id);
            setCurrentProject(updatedProject);
            setAssignedUsers(updatedProject.uzytkownicy || []);
            setSelectedUserIdToAssign("");
        } catch (err) {
            alert("Błąd przypisywania użytkownika: " + err.message);
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            await removeUserFromProject(currentProject.id, userId);
            // Reload project details to sync state
            const updatedProject = await fetchProject(currentProject.id);
            setCurrentProject(updatedProject);
            setAssignedUsers(updatedProject.uzytkownicy || []);
        } catch (err) {
            alert("Błąd usuwania przypisania: " + err.message);
        }
    };

    const unassignedUsers = useMemo(() => {
        const assignedIds = new Set(assignedUsers.map(u => u.uzytkownikId));
        return allUsers.filter(u => !assignedIds.has(u.uzytkownikId));
    }, [allUsers, assignedUsers]);

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

            {/* PROJECT MEMBERS */}
            <div className="members-section">
                <div className="members-header">
                    <h2>Członkowie projektu</h2>
                </div>
                <div className="details-card members-card">
                    {assignedUsers.length === 0 ? (
                        <p className="no-members">Brak przypisanych użytkowników do tego projektu.</p>
                    ) : (
                        <div className="members-list">
                            {assignedUsers.map(user => (
                                <div key={user.uzytkownikId} className="member-item">
                                    <div className="member-info">
                                        <span className="member-name">{user.imie} {user.nazwisko}</span>
                                        <span className="member-email">{user.email}</span>
                                        <span className="member-role">Rola: {user.rola}</span>
                                    </div>
                                    <button 
                                        className="btn-remove-user"
                                        onClick={() => handleRemoveUser(user.uzytkownikId)}
                                        title="Usuń użytkownika z projektu"
                                    >
                                        <FaUserMinus /> Usuń
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="assign-user-form">
                        <h3>Przypisz użytkownika do projektu</h3>
                        <div className="assign-controls">
                            <select
                                value={selectedUserIdToAssign}
                                onChange={(e) => setSelectedUserIdToAssign(e.target.value)}
                                className="assign-select"
                            >
                                <option value="">Wybierz użytkownika...</option>
                                {unassignedUsers.map(user => (
                                    <option key={user.uzytkownikId} value={user.uzytkownikId}>
                                        {user.imie} {user.nazwisko} ({user.email})
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAssignUser}
                                disabled={!selectedUserIdToAssign}
                                className="btn-assign-user"
                            >
                                <FaUserPlus /> Przypisz
                            </button>
                        </div>
                    </div>
                </div>
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