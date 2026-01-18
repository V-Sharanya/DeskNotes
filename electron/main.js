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
ipcMain.handle("load-notes", async () => {
  return JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));
});

ipcMain.handle("save-note", async (_, date, content) => {
  const data = JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));
  data[date] = content;
  fs.writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
});

/* ---------- IPC FOR WINDOW SIZE ---------- */
ipcMain.handle("set-window-mode", (_, mode) => {
  if (!mainWindow) return;

  if (mode === "calendar") {
    mainWindow.setSize(520, 640, true); // BIG
  } else {
    mainWindow.setSize(420, 520, true); // SMALL
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
