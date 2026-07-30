import {useState, useMemo, useEffect} from "react";
import {updateTaskStatus, deleteTask} from "../api/zadanieApi";
import {fetchProjectTasks, updateProject, deleteProject} from "../api/projektApi.js";
import {FaGoogle} from "react-icons/fa";


export default function ProjectDetails({
                                           project,
                                           onBack,
                                           setCurrentPage,
                                           setEditedTask,
                                           refreshProjects,
                                           setSelectedTask
                                       }) {
    const [currentProject, setCurrentProject] = useState(project);
    const [isEditingDeadline, setIsEditingDeadline] = useState(false);
    const [tempDeadline, setTempDeadline] = useState("");
    const [isEditingProject, setIsEditingProject] = useState(false);

    const [editedName, setEditedName] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    useEffect(() => {
        setCurrentProject(project);
        setIsEditingDeadline(false);
    }, [project]);

    const handleDeleteProject = async () => {
        if (!window.confirm("Usunąć projekt?"))
            return;
        try {
            await deleteProject(currentProject.id);
            refreshProjects();
            onBack();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStartEditProject = () => {
        setEditedName(currentProject.nazwa);
        setEditedDescription(currentProject.opis || "");
        setIsEditingProject(true);
    };

    const handleSaveProject = async () => {
        try {
            console.log(currentProject);
            await updateProject({
                projektId: currentProject.id,
                nazwa: editedName,
                opis: editedDescription,
                dataOddania: currentProject.data_oddania
            });

            setCurrentProject(prev => ({
                ...prev,
                nazwa: editedName,
                opis: editedDescription
            }));
            refreshProjects();
            setIsEditingProject(false);
            setSelectedTask(prev => ({
                ...prev,
                nazwa: editedName,
                opis: editedDescription
            }));
        } catch (err) {
            alert(err.message);
        }

    };

    const handleEditTask = (task, e) => {
        e.stopPropagation();

        console.log(task);

        setEditedTask(task);
        setCurrentPage("addTask");
    };

    const handleDeleteTask = async (taskId, e) => {
        e.stopPropagation();

        if (!window.confirm("Usunąć zadanie?")) return;

        try {
            await deleteTask(taskId);

            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            alert(err.message);
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

    const sortTasksByStatus = (tasks) => {
        const order = {
            IN_PROGRESS: 1,
            TODO: 2,
            DONE: 3
        };

        return [...tasks].sort(
            (a, b) => order[a.status] - order[b.status]
        );
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

    useEffect(() => {
        if (!currentProject?.id) return;
        fetchProjectTasks(currentProject.id, page, size, debouncedSearch).then((data) => {
            const mappedTasks = data.tasks.map(z => ({
                id: z.zadanieId,
                text: z.nazwa,
                opis: z.opis,
                priority: z.priorytet,
                status: z.status,
                uiPriority: mapPriority(z.priorytet),
                original: z
            }));

            setTasks(sortTasksByStatus(mappedTasks));
            setTotalPages(data.totalPages);
        });
    }, [currentProject?.id, page, size, debouncedSearch]);

    // progress (HIGH = done, bo na razie nie ma logiki done/undone)
    const progress = useMemo(() => {
        if (!tasks.length) return 0;

        const done = tasks.filter((t) => t.status === "DONE").length;
        return Math.round((done / tasks.length) * 100);
    }, [tasks]);

    const markAsDone = async (taskId) => {
        await updateTaskStatus(taskId, "DONE");
        setTasks(prev =>
            sortTasksByStatus(
                prev.map(task =>
                    task.id === taskId
                        ? {
                            ...task,
                            status: "DONE",
                            original: {
                                ...task.original,
                                status: "DONE"
                            }
                        }
                        : task
                )
            )
        );
    };

    const handleStartEditDeadline = () => {
        const rawDate = project.data_oddania;

        const formatted = rawDate
            ? rawDate.substring(0, 16)
            : new Date().toISOString().substring(0, 16);

        setTempDeadline(formatted);
        setIsEditingDeadline(true);
    };
    const handleSaveDeadline = async () => {

        let formattedDeadline = null;

        if (tempDeadline) {
            formattedDeadline =
                tempDeadline.length === 16
                    ? `${tempDeadline}:00`
                    : tempDeadline;
        }

        console.log("WYSYŁAM:", formattedDeadline);

        try {
            await updateProject({
                projektId: project.id,
                nazwa: project.nazwa,
                opis: project.opis,
                dataOddania: formattedDeadline
            });

            setCurrentProject(prev => ({
                ...prev,
                data_oddania: formattedDeadline
            }));

            setIsEditingDeadline(false);

        } catch (err) {
            alert(err.message);
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
                <button
                    className="back-btn"
                    onClick={onBack}
                >
                    ← Back to dashboard
                </button>
                <button
                    className="delete-project-btn"
                    onClick={handleDeleteProject}
                >
                    🗑 Usuń projekt
                </button>
            </div>
            {isEditingProject ? (
                <div className="edit-form">
                    <label>
                        Project name
                    </label>
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        maxLength={50}
                    />
                    <label>
                        Description
                    </label>
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        maxLength={1000}
                    />
                    <div className="edit-buttons">
                        <button
                            className="save-btn"
                            onClick={handleSaveProject}
                        >
                            Zapisz
                        </button>
                        <button
                            className="cancel-project-btn"
                            onClick={() => setIsEditingProject(false)}
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="project-title-row">

                        <h1 className="details-title">
                            {currentProject.nazwa}
                        </h1>


                        <button
                            className="edit-project-btn"
                            onClick={handleStartEditProject}
                        >
                            ✏️
                        </button>


                    </div>


                    <p className="project-desc">
                        {currentProject.opis}
                    </p>

                </>

            )}

            {/* PROGRESS */}
            <div className="progress-wrapper">
                <div className="progress-info">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{width: `${progress}%`}}
                    />
                </div>
            </div>

            {/* INFO */}
            <div className="details-card">
                <div className="details-row">
                    <span className="label">Created:</span>
                    <span>{currentProject.data_utworzenia ? new Date(currentProject.data_utworzenia).toLocaleDateString("pl-PL") : "Brak"}</span>
                </div>

                <div className="details-row" style={{alignItems: "center"}}>
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
                                <button className="btn-small cancel-btn"
                                        onClick={() => setIsEditingDeadline(false)}>Anuluj
                                </button>
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
                            <button className="edit-deadline-btn" onClick={handleStartEditDeadline}
                                    title="Edytuj termin">
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
                            <FaGoogle className="google-icon"/> Dodaj do Kalendarza Google
                        </a>
                    </div>
                )}
            </div>

            {/* TASK LIST */}
            <div className="subtasks-section">
                <div className="tasks-header">
                    <h2>Tasks</h2>
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

                <div className="subtasks-list">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`task-item ${task.uiPriority} ${task.status.toLowerCase()}`}
                            onClick={() => markAsDone(task.id)}
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
                            <div className="task-right">

                                <div className="task-priority">
                                    {task.status}
                                </div>

                                <button
                                    className="task-action edit"
                                    onClick={(e) => handleEditTask(task.original, e)}
                                >
                                    ✏️
                                </button>

                                <button
                                    className="task-action delete"
                                    onClick={(e) => handleDeleteTask(task.id, e)}
                                >
                                    🗑️
                                </button>

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

        </div>
    );
}