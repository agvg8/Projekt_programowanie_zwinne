import { useState } from "react";
import "./LoginPage.css";

export default function LoginPage({ onLogin, onShowRegister, externalError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Dodajemy await, żeby poczekać na Keycloaka pod spodem
    const result = await onLogin(username.trim(), password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
  };

  return (
      <div className="login-layout">
        <div className="login-shape login-shape-left" />
        <div className="login-shape login-shape-right" />

        <section className="login-card" aria-label="Panel logowania">
          <p className="login-badge">Programowanie zwinne - Projekt</p>
          <h1 className="login-title">Zaloguj się</h1>
          <p className="login-subtitle">(Użyj: admin / admin)</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Login</label>
            <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Wpisz login"
                required
            />

            <label htmlFor="password">Hasło</label>
            <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Wpisz hasło"
                required
            />

            {(error || externalError) && (
                <p className="login-error">{error || externalError}</p>
            )}

            <button type="submit" className="login-submit">
              Zaloguj
            </button>

            <button
                type="button"
                className="login-secondary-action"
                onClick={onShowRegister}
            >
              Nie masz konta? Zarejestruj.
            </button>
          </form>
        </section>
      </div>
  );
}