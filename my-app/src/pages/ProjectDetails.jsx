import {useState, useMemo, useEffect} from "react";
import { updateTaskPriorytet } from "../api/zadanieApi";
import {fetchProjectTasks} from "../api/projektApi.js";

export default function ProjectDetails({ project, onBack }) {

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

    useEffect(() => {
        fetchProjectTasks(project.id, page, size, debouncedSearch).then((data) => {
            setTasks(data.tasks.map(z => ({
                id: z.zadanieId,
                text: z.nazwa,
                opis: z.opis,
                priority: z.priorytet,
                uiPriority: mapPriority(z.priorytet),
            })));
            setTotalPages(data.totalPages);
        });
    }, [project.id, page, size, debouncedSearch]);

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
                {project.nazwa}
            </h1>

            {/* DESCRIPTION */}
            <p className="project-desc">
                {project.opis}
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
                    <span>{project.data_utworzenia}</span>
                </div>

                <div className="details-row">
                    <span className="label">Deadline:</span>
                    <span>{project.data_oddania}</span>
                </div>

                <div className="details-row">
                    <span className="label">Tasks:</span>
                    <span>{tasks.length}</span>
                </div>
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

        </div>
    );
}