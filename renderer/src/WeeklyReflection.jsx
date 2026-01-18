import { useEffect, useState } from "react";

function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function WeeklyReflection({ onBack }) {
  const [text, setText] = useState("");
  const weekKey = getWeekKey();

  /* ✅ LOAD WEEKLY REFLECTION */
  useEffect(() => {
    window.desknotes.loadWeeklyReflections().then((weeks) => {
      setText(weeks[weekKey] || "");
    });
  }, [weekKey]);

  /* ✅ AUTO SAVE */
  useEffect(() => {
    const t = setTimeout(() => {
      window.desknotes.saveWeeklyReflection(weekKey, text);
    }, 300);
    return () => clearTimeout(t);
  }, [text, weekKey]);

  return (
    <div style={{ padding: "16px" }}>
      <button onClick={onBack}>← Back</button>

      <h3 style={{ marginTop: "12px" }}>
        Weekly Reflection ({weekKey})
      </h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Reflect on your week..."
        style={{
          width: "100%",
          height: "320px",
          marginTop: "12px",
          background: "#2b2b2b",
          color: "#fff",
          border: "none",
          padding: "14px",
          resize: "none",
        }}
      />
    </div>
  );
}

export default WeeklyReflection;
