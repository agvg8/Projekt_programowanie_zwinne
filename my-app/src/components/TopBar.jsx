import { FaUserCircle } from "react-icons/fa";
import keycloak from "../keycloak.js";

function getLoggedUserName() {
  const token = keycloak.tokenParsed || (() => {
    try {
      const encodedPayload = keycloak.token?.split(".")[1];
      if (!encodedPayload) return {};
      const normalizedPayload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        Array.from(
          atob(normalizedPayload),
          (character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`,
        ).join(""),
      );
      return JSON.parse(json);
    } catch {
      return {};
    }
  })();

  const fullName = [token.given_name, token.family_name].filter(Boolean).join(" ");
  return (
    token.name ||
    fullName ||
    token.preferred_username?.replaceAll("_", " ") ||
    "Zalogowany użytkownik"
  );
}

export default function TopBar({ onLogout, setCurrentPage, setEditedTask }) {
  const loggedUserName = getLoggedUserName();

  const openNewTask = () => {
    setEditedTask?.(null);
    setCurrentPage?.("addTask");
  };

  return (
    <div className="top-bar">
      <button className="btn add-task" onClick={openNewTask}>
        + Nowe zadanie
      </button>
      <div className="profile-container">
        <div className="profile-identity" title={`Zalogowany jako ${loggedUserName}`}>
          <FaUserCircle className="profile-icon" />
          <span className="profile-name">{loggedUserName}</span>
        </div>
        <button className="profile-logout" onClick={onLogout}>
          Wyloguj się
        </button>
      </div>
    </div>
  );
}
