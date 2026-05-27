import { useState } from "react";
import "./LoginPage.css";

export default function RegisterPage({ onRegister, onShowLogin }) {
  // 1. Definiujemy stany dla wszystkich pól formularza i błędów
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState("");

  // 2. Obsługa wysłania formularza
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Sprawdzamy, czy hasła się zgadzają zanim zapukamy do Keycloaka
    if (password !== passwordRepeat) {
      setError("Podane hasła nie są identyczne.");
      return;
    }

    setError("");

    // Wywołujemy funkcję rejestracji z App.jsx
    const result = await onRegister(username.trim(), email.trim(), password);

    if (!result.success) {
      setError(result.message);
      return;
    }
  };

  return (
      <div className="login-layout">
        <div className="login-shape login-shape-left" />
        <div className="login-shape login-shape-right" />

        <section className="login-card" aria-label="Panel rejestracji">
          <p className="login-badge">Zwinne programowanie projekt</p>
          <h1 className="login-title">Utwórz nowe konto</h1>

          {/* Zmieniamy zwykły div na onSubmit w form, aby działało klikanie i Enter */}
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="register-username">Login</label>
            <input
                id="register-username"
                type="text"
                autoComplete="username"
                placeholder="Wpisz login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <label htmlFor="register-email">Email</label>
            <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="Wpisz email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label htmlFor="register-password">Hasło</label>
            <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="Wpisz hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <label htmlFor="register-password-repeat">Powtórz hasło</label>
            <input
                id="register-password-repeat"
                type="password"
                autoComplete="new-password"
                placeholder="Powtórz hasło"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                required
            />

            {/* Wyświetlanie błędu (np. o niezgodnych hasłach lub zajętym loginie) */}
            {error && <p className="login-error">{error}</p>}

            {/* Typ zmieniamy na submit */}
            <button type="submit" className="login-submit">
              Zarejestruj
            </button>

            <button
                type="button"
                className="login-secondary-action"
                onClick={onShowLogin}
            >
              Masz już konto? Zaloguj.
            </button>
          </form>
        </section>
      </div>
  );
}