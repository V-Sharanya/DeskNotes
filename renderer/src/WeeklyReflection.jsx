import { useEffect, useState } from "react";

function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

// helper → preview first 2 lines
function getPreview(text = "") {
  const lines = text.split("\n").filter(l => l.trim() !== "");
  if (lines.length <= 2) return lines.join(" ");
  return lines.slice(0, 2).join(" ") + " ...";
}

function WeeklyReflection({ onBack }) {
  const currentWeekKey = getWeekKey();

  const [text, setText] = useState("");
  const [allWeeks, setAllWeeks] = useState({});
  const [activeWeek, setActiveWeek] = useState(currentWeekKey);

  /* LOAD ALL WEEKLY REFLECTIONS */
  useEffect(() => {
    window.desknotes.loadWeeklyReflections().then((weeks) => {
      setAllWeeks(weeks || {});
      setText(weeks?.[activeWeek] || "");
    });
  }, [activeWeek]);

  /* AUTO SAVE CURRENT WEEK */
  useEffect(() => {
    const t = setTimeout(() => {
      window.desknotes.saveWeeklyReflection(activeWeek, text);

      setAllWeeks(prev => ({
        ...prev,
        [activeWeek]: text,
      }));
    }, 300);

    return () => clearTimeout(t);
  }, [text, activeWeek]);

  const pastWeeks = Object.keys(allWeeks)
    .filter(w => w !== activeWeek)
    .sort()
    .reverse();

  return (
    <div style={{ padding: "16px" }}>
      <button onClick={onBack}>← Back</button>

      <h3 style={{ marginTop: "12px" }}>
        Weekly Reflection ({activeWeek})
      </h3>

      {/* Current week editor */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Reflect on your week..."
        style={{
          width: "100%",
          minHeight: "260px",
          marginTop: "12px",
          background: "#2b2b2b",
          color: "#fff",
          border: "1px solid #555",
          borderRadius: "6px",
          padding: "14px",
          resize: "none",
        }}
      />

      {/* Past reflections */}
      {pastWeeks.length > 0 && (
        <>
          <h4 style={{ marginTop: "24px", opacity: 0.8 }}>
            Past Weekly Reflections
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pastWeeks.map((week) => (
              <div
                key={week}
                onClick={() => {
                  setActiveWeek(week);
                  setText(allWeeks[week] || "");
                }}
                style={{
                  padding: "12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "#2f2f2f",
                }}
              >
                <strong>{week}</strong>
                <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
                  {getPreview(allWeeks[week])}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WeeklyReflection;
