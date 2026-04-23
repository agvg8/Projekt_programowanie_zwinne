import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onTaskClick }) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onClick={onTaskClick}
        />
      ))}
    </div>
  );
}