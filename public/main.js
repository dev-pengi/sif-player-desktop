const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  shell,
  dialog,
  Tray,
} = require("electron");
const { exec } = require("child_process");
const { autoUpdater } = require("electron-updater");

require("@electron/remote/main").initialize();

const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    minWidth: 900,
    minHeight: 650,
    maximizable: true,
    titleBarStyle: "hidden",
    backgroundColor: "#101010",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true,
      devTools: true,
    },
  });

  autoUpdater.setFeedURL({
    provider: "github",
    repo: "sif-player-desktop",
    owner: "dev-pengi",
    private: false,
  });

  const checkForUpdates = () => {
    autoUpdater.checkForUpdates();
    autoUpdater.on("update-downloaded", (info) => {
      autoUpdater.removeAllListeners("update-downloaded");
      dialog
        .showMessageBox(win, {
          type: "info",
          title: "Update Downloaded",
          message: "You need to restart the app to apply the update",
          buttons: ["Close app", "Cancel"],
          noLink: true,
        })
        .then((value) => {
          if (value.response === 0) {
            win.destroy();
          }
        });
    });
  };

  checkForUpdates();
  ipcMain.on("check-update", (event) => {
    checkForUpdates();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (!isDev) {
    const customMenuTemplate = [];

    const customMenu = Menu.buildFromTemplate(customMenuTemplate);
    Menu.setApplicationMenu(customMenu);
  }

  require("@electron/remote/main").enable(win.webContents);
  const buildURL = `file://${path.join(__dirname, "../build/index.html")}`;
  const currentURL = isDev ? "http://localhost:5173" : buildURL;
  if (isDev) {
    win.openDevTools();
  }

  win.loadURL(currentURL);

  if (process.argv.length >= 2) {
    let filePath = process.argv[1];

    console.log(filePath);
    ipcMain.on("request-file-path", (event) => {
      console.log(filePath);
      event.sender.send("file-path", filePath);
    });
  }

  ipcMain.on("close", () => {
    win.close();
  });

  ipcMain.on("minimize", () => {
    win.minimize();
  });

  ipcMain.on("platform", (event) => {
    event.sender.send("platform", process.platform);
  });

  ipcMain.on("maximize", () => {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });

  ipcMain.on("shutdown", () => {
    if (process.platform === "win32") {
      exec("shutdown /s /t 0");
    } else if (process.platform === "linux") {
      exec("shutdown now");
    } else if (process.platform === "darwin") {
      exec("shutdown -h now");
    }
  });

  ipcMain.on("sleep", () => {
    if (process.platform === "win32") {
      exec("shutdown /h");
    } else if (process.platform === "linux") {
      exec("systemctl suspend");
    } else if (process.platform === "darwin") {
      exec("pmset sleepnow");
    }
  });

  let tray = null;
  app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, "../public/icon.png"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Exit Application",
        type: "normal",
        click: () => {
          app.quit();
        },
      },
    ]);
    tray.setToolTip("Sif Player");
    tray.setContextMenu(contextMenu);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
