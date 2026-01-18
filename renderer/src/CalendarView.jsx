import { useEffect, useState } from "react";

function CalendarView({ onSelectDate }) {
  const [notes, setNotes] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // helper → first 3 words + ...
  const getPreview = (text = "") => {
    const words = text.trim().split(/\s+/);
    if (words.length <= 3) return words.join(" ");
    return words.slice(0, 3).join(" ") + " ...";
  };

  return (
    <div style={{ padding: "16px" }}>
      {/* Month header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
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
          gap: "10px",
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
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#2f2f2f",
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "4px",
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
