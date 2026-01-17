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
    width: 420,
    height: 520,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");
}

ipcMain.handle("load-notes", async () => {
  const data = fs.readFileSync(NOTES_FILE, "utf-8");
  return JSON.parse(data);
});

ipcMain.handle("save-note", async (event, date, content) => {
  const data = JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));
  data[date] = content;
  fs.writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
  return true;
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
