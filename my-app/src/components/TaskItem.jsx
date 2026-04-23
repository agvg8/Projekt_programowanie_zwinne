export default function TaskItem({ task, onClick }) {
  return (
    <div
      className="task-item"
      style={{ backgroundColor: task.color }}
      onClick={() => onClick(task)}
    >
      <div className="task-left">{task.title}</div>
      <div className="task-right">{task.details}</div>
    </div>
  );
}