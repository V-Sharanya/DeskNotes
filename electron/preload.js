const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desknotes", {
  // unified loader
  loadNotes: async () => {
    const data = await ipcRenderer.invoke("load-data");
    return data.notes;
  },

  loadWeeklyReflections: async () => {
    const data = await ipcRenderer.invoke("load-data");
    return data.weeklyReflections;
  },

  saveNote: (date, content) =>
    ipcRenderer.invoke("save-note", date, content),

  saveWeeklyReflection: (weekKey, content) =>
    ipcRenderer.invoke("save-weekly-reflection", weekKey, content),

  setWindowMode: (mode) =>
    ipcRenderer.invoke("set-window-mode", mode),
});
