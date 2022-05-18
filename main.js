const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const prompt = require("electron-prompt");

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

// ダイアログに名前を入力し、同じ名前のディレクトリを上記のディレクトリ直下に作成する
// また、それらの個人名ディレクトリへのパスをタプルでreturnする。
const inputPrompt = () =>
  prompt({
    title: "入力プロンプト",
    label: "名前を入力してください",
    value: "",
    inputAttrs: {
      type: "text",
    },
    type: "input",
  })
    .then((input) => {
      if (input === null) {
        return;
      } else {
        const personalDirectory1 = path.join(destinationDirectory1, input);
        const personalDirectory2 = path.join(destinationDirectory2, input);
        fs.mkdir(personalDirectory1, { recursive: true }, (err) => {
          if (err) throw err;
        });
        fs.mkdir(personalDirectory2, { recursive: true }, (err) => {
          if (err) throw err;
        });
        return [personalDirectory1, personalDirectory2];
      }
    })
    .catch(console.error);

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: "マイアプリ",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("open-input-dialog", async (_e, _arg) => {
    return inputPrompt();
  });

  mainWindow.webContents.openDevTools({ mode: "detach" });
  mainWindow.loadFile("index.html");
};

app.once("ready", () => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
