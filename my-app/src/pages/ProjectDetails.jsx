import { useState } from "react";

export default function ProjectDetails({ task, onBack }) {
  const [subtasks, setSubtasks] = useState([
    { id: 1, text: "Create wireframes", priority: "low", done: false },
    { id: 2, text: "Fix login bug", priority: "medium", done: true },
    { id: 3, text: "Deploy to production", priority: "high", done: false },
  ]);

  // toggle done
  const toggleDone = (id) => {
    setSubtasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  // zmiana priorytetu
  const changePriority = (id) => {
    setSubtasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const next =
          t.priority === "low"
            ? "medium"
            : t.priority === "medium"
            ? "high"
            : "low";

        return { ...t, priority: next };
      })
    );
  };

  // progress
  const completed = subtasks.filter((t) => t.done).length;
  const progress = Math.round((completed / subtasks.length) * 100);

  return (
    <div className="project-details">

      {/* HEADER */}
      <div className="details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      {/* TITLE */}
      <h1 className="details-title">{task.title}</h1>

      {/* PROGRESS BAR */}
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
          <span className="label">Assigned to:</span>
          <span>Alice, Bob</span>
        </div>

        <div className="details-row">
          <span className="label">Start date:</span>
          <span>2026-03-01</span>
        </div>

        <div className="details-row">
          <span className="label">End date:</span>
          <span>2026-03-20</span>
        </div>
      </div>

      {/* SUBTASKS */}
      <div className="subtasks-section">
        <h2>Subtasks</h2>

        <div className="subtasks-list">
          {subtasks.map((sub) => (
            <div
              key={sub.id}
              className={`subtask-item ${sub.priority} ${
                sub.done ? "done" : ""
              }`}
            >
              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={sub.done}
                onChange={() => toggleDone(sub.id)}
              />

              {/* TEXT */}
              <span
                className="subtask-text"
                onClick={() => changePriority(sub.id)}
              >
                {sub.text}
              </span>

              {/* PRIORITY */}
              <span className="priority-label">
                {sub.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}