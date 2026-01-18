import { useEffect, useState } from "react";
import "./App.css";
import CalendarView from "./CalendarView";
import WeeklyReflection from "./WeeklyReflection";


function App() {
  const todayKey = new Date().toLocaleDateString("en-CA");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("note"); // note | calendar
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [text, setText] = useState("");

  const dateKey = selectedDate;
  const [y, m, d] = dateKey.split("-");
  const displayDate = new Date(y, m - 1, d);

  const formattedDate = displayDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* ---------- LOAD NOTE ---------- */
  useEffect(() => {
    window.desknotes.loadNotes().then((notes) => {
      setText(notes[dateKey] || "");
    });
  }, [dateKey]);

  /* ---------- AUTO SAVE ---------- */
  useEffect(() => {
    const t = setTimeout(() => {
      window.desknotes.saveNote(dateKey, text);
    }, 300);
    return () => clearTimeout(t);
  }, [text, dateKey]);

  /* ---------- WINDOW SIZE CONTROL ---------- */
  useEffect(() => {
    window.desknotes.setWindowMode({ mode: view });
  }, [view]);


  return (
    <>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <span>Menu</span>
              <button onClick={() => setSidebarOpen(false)}>×</button>
            </div>

            <div
              className="sidebar-item"
              onClick={() => {
                setView("calendar");
                setSidebarOpen(false);
              }}
            >
              📅 Calendar
            </div>

            <div
              className="sidebar-item"
              onClick={() => {
                setView("weekly");
                setSidebarOpen(false);
              }}
            >
              📝 Weekly Reflection
            </div>

          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="note-app">
        <header className="note-header">
          <span className="note-date">{formattedDate}</span>
          <span className="note-menu" onClick={() => setSidebarOpen(true)}>
            ⋮
          </span>
        </header>

        {view === "note" ? (
          <textarea
            className="note-editor"
            placeholder="Take a note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : view === "calendar" ? (
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setView("note"); // go back to note
            }}
          />
        ) : view === "weekly" && (
          <WeeklyReflection onBack={() => setView("note")} />
        )}
      </div>
    </>
  );
}

export default App;
