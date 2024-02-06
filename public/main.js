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
const rpc = require("discord-rpc");
const clientId = "1197268973784400032";
rpc.register(clientId);

const rpcClient = new rpc.Client({ transport: "ipc" });

rpcClient.login({ clientId }).catch(console.error);

require("@electron/remote/main").initialize();

const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {

  const win = new BrowserWindow({
    width: 900,
    height: 650,
    minWidth: 900,
    minHeight: 500,
    maximizable: true,
    titleBarStyle: "hidden",
    backgroundColor: "#101010",
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true,
      devTools: isDev,
    },
  });

  win.once("ready-to-show", () => {
    win.moveTop();
    win.focus();
    win.show();
    win.webContents.send("open-file-path", process.argv[1]);
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

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", () => {
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
        win.show();
        win.webContents.send("open-file-path", process.argv[1]);
      }
    });
  }

  const startTimestamp = Date.now();

  ipcMain.on("rpc", (event, args) => {
    const activityObject = {
      state: args?.state ?? "",
      details: args?.details,
      startTimestamp,
      largeImageKey: "icon-rounded",
      largeImageText: "Sif Player",
      instance: false,
      buttons: [
        {
          label: "Download Sif Player",
          url: "https://player.sifedine.com/desktop",
        },
        {
          label: "Use Sif Player Online",
          url: "https://player.sifedine.com",
        },
      ],
    };
    if (args?.filename) {
      activityObject.smallImageKey = "icon-rounded";
      activityObject.smallImageText = args?.filename;
    }
    rpcClient.setActivity(activityObject);
  });
  ipcMain.on("rpc-clear", (event, args) => {
    rpcClient.clearActivity();
  });
  checkForUpdates();
  ipcMain.on("check-update", (event) => {
    checkForUpdates();
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
    tray = new Tray(path.join(__dirname, "./icon.png"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Exit Application",
        type: "normal",
        click: () => {
          app.quit();
        },
      },
    ]);
    tray.on("click", () => {
      win.show();
    });
    tray.setToolTip("Sif Player");
    tray.setContextMenu(contextMenu);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  // app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
