import "./App.css";

function App() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="note-app">
      <header className="note-header">
        <span className="note-date">{today}</span>
        <span className="note-menu">⋮</span>
      </header>

      <textarea
        className="note-editor"
        placeholder="Take a note..."
      />
    </div>
  );
}

export default App;
