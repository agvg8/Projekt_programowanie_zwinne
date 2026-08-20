import { FiMessageCircle, FiSettings, FiGrid } from "react-icons/fi";

export default function Sidebar({ setCurrentPage, currentPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><span className="brand-mark">A</span><h2 className="sidebar-title">Agile<span>space</span></h2></div>
      <ul className="nav-list">
        <li onClick={() => setCurrentPage("dashboard")} className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}>
          <FiGrid /> Dashboard
        </li>
        <li onClick={() => setCurrentPage("chat")} className={`nav-item ${currentPage === "chat" ? "active" : ""}`}>
          <FiMessageCircle /> <span>Messages</span><b className="nav-badge">2</b>
        </li>
        <li onClick={() => setCurrentPage("settings")} className={`nav-item ${currentPage === "settings" ? "active" : ""}`}>
          <FiSettings /> Settings
        </li>
          <li onClick={() => setCurrentPage("admin")} className='nav-item'>
            Admin Panel
          </li>
      </ul>
      <div className="sidebar-spacer" />
      <div className="sidebar-tip"><span>TIP OF THE DAY</span><p>Małe kroki każdego dnia dają duże efekty.</p></div>
    </aside>
  );
}
