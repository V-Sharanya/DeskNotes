const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

const NOTES_FILE = path.join(app.getPath("userData"), "notes.json");

function ensureNotesFile() {
  if (!fs.existsSync(NOTES_FILE)) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify({}));
  }
}

function createWindow() {
  ensureNotesFile();

  mainWindow = new BrowserWindow({
    width: 420,        // SMALL by default
    height: 520,
    minWidth: 400,
    minHeight: 500,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");
}

/* ---------- IPC FOR NOTES ---------- */
ipcMain.handle("load-data", async () => {
  const raw = JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));

  return {
    notes: raw.notes || raw || {},
    weeklyReflections: raw.weeklyReflections || {},
  };
});

ipcMain.handle("save-note", async (_, date, content) => {
  const data = JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));

  if (!data.notes) data.notes = {};
  data.notes[date] = content;

  fs.writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
});

ipcMain.handle("save-weekly-reflection", async (_, weekKey, content) => {
  const data = JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));

  if (!data.weeklyReflections) data.weeklyReflections = {};
  data.weeklyReflections[weekKey] = content;

  fs.writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
});

/* ---------- IPC FOR WINDOW SIZE ---------- */
ipcMain.handle("set-window-mode", (_, payload) => {
  if (!mainWindow) return;

  // NOTE MODE
  if (payload === "note" || payload?.mode === "note") {
    mainWindow.setSize(420, 520, true);
    return;
  }

  // CALENDAR MODE (dynamic height)
  if (payload?.mode === "calendar") {
    const width = 540;
    const height = Math.min(
      Math.max(payload.height || 640, 600), // min
      900                                // max
    );

    mainWindow.setSize(width, height, true);
  }
});


app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
