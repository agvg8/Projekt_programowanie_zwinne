import "./LandingPage.css";

const FEATURES = [
  {
    icon: "📋",
    title: "Projekty w jednym miejscu",
    desc: "Wszystkie Twoje projekty zebrane w przejrzystym panelu. Nigdy nie zgub wątku.",
  },
  {
    icon: "⚡",
    title: "Zadania pod kontrolą",
    desc: "Twórz, priorytetyzuj i śledź postęp zadań w czasie rzeczywistym.",
  },
  {
    icon: "🤝",
    title: "Praca zespołowa",
    desc: "Przydzielaj zadania, komentuj i synchronizuj pracę całego zespołu bez chaosu.",
  },
];

const PREVIEW_ROWS = [
  { icon: "🚀", title: "Wdrożenie nowej funkcji", sub: "Frontend · sprint 3", tag: "high",   label: "Pilne"     },
  { icon: "🎨", title: "Redesign panelu użytkownika", sub: "Design · sprint 3",  tag: "medium", label: "W toku"    },
  { icon: "🔧", title: "Optymalizacja zapytań SQL",  sub: "Backend · sprint 2",  tag: "low",    label: "Gotowe"   },
];

export default function LandingPage({ onShowLogin, onShowRegister }) {
  return (
    <div className="landing">
      {/* blobs */}
      <div className="landing-blob landing-blob-1" />
      <div className="landing-blob landing-blob-2" />
      <div className="landing-blob landing-blob-3" />

      {/* nav */}
      <nav className="landing-nav">
        <span className="landing-logo">
          agile<span>flow</span>
        </span>
        <div className="landing-nav-actions">
          <button className="btn-ghost" onClick={onShowLogin}>
            Zaloguj się
          </button>
          <button className="btn-primary" onClick={onShowRegister}>
            Zarejestruj się
          </button>
        </div>
      </nav>

      {/* hero */}
      <section className="landing-hero">
        <div className="landing-badge">
          <span className="badge-dot" />
          Programowanie zwinne · Projekt
        </div>

        <h1 className="landing-title">
          Zarządzaj projektami<br />
          <em>szybciej i mądrzej</em>
        </h1>

        <p className="landing-subtitle">
          Jeden panel dla całego zespołu. Twórz projekty, śledź zadania
          i dostarczaj wartość każdego sprintu — bez zbędnego chaosu.
        </p>

        <div className="landing-cta">
          <button className="btn-cta" onClick={onShowRegister}>
            Zacznij za darmo →
          </button>
          <button className="btn-cta-outline" onClick={onShowLogin}>
            Mam już konto
          </button>
        </div>
      </section>

      {/* app preview */}
      <div className="landing-preview">
        <div className="preview-card">
          <div className="preview-topbar">
            <div className="preview-dot" />
            <div className="preview-dot" />
            <div className="preview-dot" />
          </div>
          {PREVIEW_ROWS.map((row) => (
            <div className="preview-row" key={row.title}>
              <div className="preview-row-icon">{row.icon}</div>
              <div className="preview-row-text">
                <div className="preview-row-title">{row.title}</div>
                <div className="preview-row-sub">{row.sub}</div>
              </div>
              <span className={`preview-row-tag tag-${row.tag}`}>{row.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* features */}
      <div className="landing-features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* footer */}
      <footer className="landing-footer">
        © 2025 AgileFlow · Projekt zaliczeniowy
      </footer>
    </div>
  );
}
