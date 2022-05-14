const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

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

  mainWindow.loadFile("index.html");
};

app.once("ready", () => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
