export default function Sidebar({ setCurrentPage }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Navigate Board</h2>
      <ul className="nav-list">
        <li onClick={() => setCurrentPage("dashboard")} className="nav-item">
          Dashboard
        </li>
        <li onClick={() => setCurrentPage("settings")} className="nav-item">
          Settings
        </li>
      </ul>
    </aside>
  );
}