import { FaUserCircle } from "react-icons/fa";

export default function TopBar({
                                   setCurrentPage,
                                   setEditedTask
                               }) {
    return (
        <div className="top-bar">

            <button
                className="btn add-task"
                onClick={() => {
                    setEditedTask(null);
                    setCurrentPage("addTask");
                }}
            >
                + Add Task
            </button>

            <FaUserCircle className="profile-icon" />

        </div>
    );
}