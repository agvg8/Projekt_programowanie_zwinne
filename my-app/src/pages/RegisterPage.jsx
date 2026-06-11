import { useState } from "react";
import "./LoginPage.css";

export default function RegisterPage({ onShowLogin }) {

  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    password: "",
    repeatPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleRegister = async () => {

    setError("");
    setSuccess("");

    if (formData.password !== formData.repeatPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    try {

      const response = await fetch(
          "http://localhost:8081/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: formData.imie,
              surname: formData.nazwisko,
              email: formData.email,
              password: formData.password
            })
          }
      );

      if (response.ok) {

        setSuccess("Konto zostało utworzone");

        setTimeout(() => {
          onShowLogin();
        }, 1500);

      } else {

        const text = await response.text();

        setError(text || "Błąd rejestracji");
      }

    } catch (err) {

      console.error(err);

      setError("Błąd połączenia z serwerem");
    }
  };

  return (
      <div className="login-layout">

        <div className="login-shape login-shape-left" />
        <div className="login-shape login-shape-right" />

        <section
            className="login-card"
            aria-label="Panel rejestracji"
        >

          <p className="login-badge">
            Zwinne programowanie projekt
          </p>

          <h1 className="login-title">
            Utwórz nowe konto
          </h1>

          <form
              className="login-form"
              onSubmit={(e) => e.preventDefault()}
          >

            <label htmlFor="register-firstname">
              Imię
            </label>

            <input
                id="register-firstname"
                name="imie"
                type="text"
                placeholder="Wpisz imię"
                value={formData.imie}
                onChange={handleChange}
                required
            />

            <label htmlFor="register-surname">
              Nazwisko
            </label>

            <input
                id="register-surname"
                name="nazwisko"
                type="text"
                placeholder="Wpisz nazwisko"
                value={formData.nazwisko}
                onChange={handleChange}
                required
            />

            <label htmlFor="register-email">
              Email
            </label>

            <input
                id="register-email"
                name="email"
                type="email"
                placeholder="Wpisz email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <label htmlFor="register-password">
              Hasło
            </label>

            <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Wpisz hasło"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <label htmlFor="register-password-repeat">
              Powtórz hasło
            </label>

            <input
                id="register-password-repeat"
                name="repeatPassword"
                type="password"
                placeholder="Powtórz hasło"
                value={formData.repeatPassword}
                onChange={handleChange}
                required
            />

            {error && (
                <p style={{ color: "red" }}>
                  {error}
                </p>
            )}

            {success && (
                <p style={{ color: "green" }}>
                  {success}
                </p>
            )}

            <button
                type="button"
                className="login-submit"
                onClick={handleRegister}
            >
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