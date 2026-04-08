export default function TaskItem({ task }) {
  return (
    <div
      className="task-item"
      style={{ backgroundColor: task.color }}
    >
      <div className="task-left">{task.title}</div>
      <div className="task-right">{task.details}</div>
    </div>
  );
}