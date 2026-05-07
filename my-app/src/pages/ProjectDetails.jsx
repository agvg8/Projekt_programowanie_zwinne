import {useState, useMemo, useEffect} from "react";
import { updateTaskStatus } from "../api/zadanieApi";
import {fetchProjectTasks} from "../api/projektApi.js";

export default function ProjectDetails({ project, onBack }) {

    // map backend status → UI style
    const mapStatus = (status) => {
        switch (status) {
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

    useEffect(() => {
        fetchProjectTasks(project.id).then((data) => {
            setTasks(data.map(z => ({
                id: z.zadanieId,
                text: z.nazwa,
                opis: z.opis,
                status: z.status,
                uiStatus: mapStatus(z.status),
            })));
        });
    }, [project.id]);

    // progress (HIGH = done, bo na razie nie ma logiki done/undone)
    const progress = useMemo(() => {
        if (!tasks.length) return 0;

        const done = tasks.filter((t) => t.status === "HIGH").length;
        return Math.round((done / tasks.length) * 100);
    }, [tasks]);

    // zmiana statusu
    const cycleStatus = async (taskId, currentStatus) => {
        const next =
            currentStatus === "LOW"
                ? "MEDIUM"
                : currentStatus === "MEDIUM"
                    ? "HIGH"
                    : "LOW";

        // update backend
        await updateTaskStatus(taskId, next);

        // update UI
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        status: next,
                        uiStatus: mapStatus(next),
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
                <h2>Tasks</h2>

                <div className="subtasks-list">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`task-item ${task.uiStatus}`}
                            onClick={() =>
                                cycleStatus(task.id, task.status)
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
                            <div className="task-status">
                                {task.status}
                            </div>

                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}