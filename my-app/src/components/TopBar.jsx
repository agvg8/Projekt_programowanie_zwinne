import { FaUserCircle } from "react-icons/fa";

export default function TopBar({ onLogout }) {
  return (
    <div className="top-bar">
      <button className="btn add-task">+ Add Task</button>
      <div 
        className="profile-container" 
        onClick={onLogout} 
        title="Kliknij, aby się wylogować" 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <FaUserCircle className="profile-icon" />
        <span style={{ fontSize: '14px', fontWeight: '600' }}>Wyloguj</span>
      </div>
    </div>
  );
}