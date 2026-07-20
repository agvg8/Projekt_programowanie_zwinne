import { useState } from "react";
import "./LoginPage.css";

export default function LoginPage({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await onLogin(username.trim(), password);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }
  };

  return (
    <div className="login-layout">
      <div className="login-shape login-shape-left" />
      <div className="login-shape login-shape-right" />

      <section className="login-card" aria-label="Panel logowania">
        <p className="login-badge">Programowanie zwinne - Projekt</p>
        <h1 className="login-title">Zaloguj się</h1>
        <p className="login-subtitle">Zaloguj się swoimi danymi lub admin / admin</p>

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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? "Logowanie..." : "Zaloguj"}
          </button>

          <button
            type="button"
            className="login-secondary-action"
            onClick={onShowRegister}
            disabled={isSubmitting}
          >
            Nie masz konta? Zarejestruj.
          </button>
        </form>
      </section>
    </div>
  );
}