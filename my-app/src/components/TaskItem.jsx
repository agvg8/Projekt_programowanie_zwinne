export default function TaskItem({ task, onClick }) {
  console.log("PROJEKT W LISTACH:", task);
  return (
    <div
      className="task-item"
      style={{ backgroundColor: task.color }}
      onClick={() => onClick(task)}
    >
      <div className="task-left">{task.nazwa}</div>
      <div className="task-right">{task.opis}</div>
    </div>
  );
}