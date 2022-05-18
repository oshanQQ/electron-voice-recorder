const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

// 起動時、デスクトップに2つのディレクトリを作成する
const homeDirectory =
  process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const desktopDirectory = path.join(homeDirectory, "Desktop");
const destinationDirectory1 = path.join(desktopDirectory, "1");
const destinationDirectory2 = path.join(desktopDirectory, "2");
fs.mkdir(destinationDirectory1, { recursive: true }, (err) => {
  if (err) throw err;
});
fs.mkdir(destinationDirectory2, { recursive: true }, (err) => {
  if (err) throw err;
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: "マイアプリ",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("open-dialog", async (_e, _arg) => {
    return dialog
      .showOpenDialog(mainWindow, {
        properties: ["openFile"],
      })
      .then((result) => {
        if (result.canceled) return "";
        return result.filePaths[0];
      });
  });

  mainWindow.webContents.openDevTools({ mode: "detach" });
  mainWindow.loadFile("index.html");
};

app.once("ready", () => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
