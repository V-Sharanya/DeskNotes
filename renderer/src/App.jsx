import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const today = new Date();
  const dateKey = today.toISOString().split("T")[0];

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [text, setText] = useState("");

  useEffect(() => {
    window.desknotes.loadNotes().then((notes) => {
      setText(notes[dateKey] || "");
    });
  }, [dateKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.desknotes.saveNote(dateKey, text);
    }, 300);

    return () => clearTimeout(timer);
  }, [text, dateKey]);

  return (
    <div className="note-app">
      <header className="note-header">
        <span className="note-date">{formattedDate}</span>
        <span className="note-menu">⋮</span>
      </header>

      <textarea
        className="note-editor"
        placeholder="Take a note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}

export default App;
