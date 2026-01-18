const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desknotes", {
  loadNotes: () => ipcRenderer.invoke("load-notes"),
  saveNote: (date, content) =>
    ipcRenderer.invoke("save-note", date, content),

  setWindowMode: (mode) =>
    ipcRenderer.invoke("set-window-mode", mode),
});
