export default function Settings({ setBackground }) {
  return (
    <div className="settings">
      <h1>Settings</h1>
      <p>Choose background:</p>

      <div className="bg-grid">
        <div
          className="bg-card"
          onClick={() => setBackground("/bg1.jpg")}
        >
          <img src="/bg1.jpg" alt="bg1" />
        </div>

        <div
          className="bg-card"
          onClick={() => setBackground("/bg2.jpg")}
        >
          <img src="/bg2.jpg" alt="bg2" />
        </div>

        <div
          className="bg-card"
          onClick={() => setBackground("/bg3.jpg")}
        >
          <img src="/bg3.jpg" alt="bg3" />
        </div>

      </div>
    </div>
  );
}