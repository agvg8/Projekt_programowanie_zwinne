import "./LoginPage.css";

export default function RegisterPage({ onShowLogin }) {
  return (
    <div className="login-layout">
      <div className="login-shape login-shape-left" />
      <div className="login-shape login-shape-right" />

      <section className="login-card" aria-label="Panel rejestracji">
        <p className="login-badge">Zwinne programowanie projekt</p>
        <h1 className="login-title">Utwórz nowe konto</h1>

        <form className="login-form">
          <label htmlFor="register-username">Login</label>
          <input
            id="register-username"
            type="text"
            autoComplete="username"
            placeholder="Wpisz login"
            required
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="Wpisz email"
            required
          />

          <label htmlFor="register-password">Hasło</label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="Wpisz hasło"
            required
          />

          <label htmlFor="register-password-repeat">Powtórz hasło</label>
          <input
            id="register-password-repeat"
            type="password"
            autoComplete="new-password"
            placeholder="Powtórz hasło"
            required
          />

          <button type="button" className="login-submit">
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