import { useEffect, useState, useRef } from "react";

function CalendarView({ onSelectDate }) {
  const [notes, setNotes] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    window.desknotes.loadNotes().then(setNotes);
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  /* line-based preview (max 2 lines) */
  const getPreview = (text = "") => {
    const lines = text.split("\n").filter(l => l.trim() !== "");
    if (lines.length <= 2) return lines.join(" ");
    return lines.slice(0, 2).join(" ") + " ...";
  };

  /* 🔑 AUTO-RESIZE WINDOW BASED ON CONTENT */
  useEffect(() => {
    if (!containerRef.current) return;

    const height = containerRef.current.scrollHeight;

    window.desknotes.setWindowMode({
      mode: "calendar",
      height: height + 140, // header + margins
    });
  }, [notes, currentMonth]);

  return (
    <div ref={containerRef} style={{ padding: "16px" }}>
      {/* Month header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))}>
          ◀
        </button>

        <strong>
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </strong>

        <button onClick={() => setCurrentMonth(new Date(year, month + 1))}>
          ▶
        </button>
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "12px",
        }}
      >
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div
            key={d}
            style={{
              fontSize: "11px",
              opacity: 0.6,
              textAlign: "center",
            }}
          >
            {d}
          </div>
        ))}

        {days.map((date, i) => {
          if (!date) return <div key={i} />;

          const key = date.toLocaleDateString("en-CA");
          const noteText = notes[key];

          return (
            <div
              key={i}
              onClick={() => onSelectDate(key)}
              style={{
                borderRadius: "10px",
                padding: "10px",
                cursor: "pointer",
                background: "#2f2f2f",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 500 }}>
                {date.getDate()}
              </div>

              {noteText && (
                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.7,
                    lineHeight: 1.3,
                  }}
                >
                  {getPreview(noteText)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;
