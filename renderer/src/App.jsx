import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [text, setText] = useState("");

  const today = new Date();
  const dateKey = today.toISOString().split("T")[0];

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Load today's note
  useEffect(() => {
    window.desknotes.loadNotes().then((notes) => {
      setText(notes[dateKey] || "");
    });
  }, [dateKey]);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      window.desknotes.saveNote(dateKey, text);
    }, 300);

    return () => clearTimeout(timer);
  }, [text, dateKey]);

  return (
    <>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-header">
              <span>Menu</span>
              <button onClick={() => setSidebarOpen(false)}>×</button>
            </div>

            <div className="sidebar-item">📅 Calendar</div>
            <div className="sidebar-item">📊 Analytics</div>
            <div className="sidebar-item">📝 Weekly Reflection</div>
          </div>
        </div>
      )}

      {/* Main note UI */}
      <div className="note-app">
        <header className="note-header">
          <span className="note-date">{formattedDate}</span>
          <span
            className="note-menu"
            onClick={() => setSidebarOpen(true)}
          >
            ⋮
          </span>
        </header>

        <textarea
          className="note-editor"
          placeholder="Take a note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </>
  );
}

export default App;
