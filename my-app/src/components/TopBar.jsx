import { FaUserCircle } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="top-bar">
      <button className="btn add-task">+ Add Task</button>
      <FaUserCircle className="profile-icon" />
    </div>
  );
}