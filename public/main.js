const { app, BrowserWindow, Menu, ipcMain, dialog, Tray } = require("electron");
const { exec } = require("child_process");
const { autoUpdater } = require("electron-updater");
const rpc = require("discord-rpc");
const clientId = "1197268973784400032";

const os = require("os");
const fs = require("fs");

const ffmpegStatic = require("ffmpeg-static");
const ffprobeStatic = require("ffprobe-static");

const ffmpeg = require("fluent-ffmpeg");

// Ensure that ffmpeg and ffprobe paths are correctly set
ffmpeg.setFfmpegPath(ffmpegStatic); // Path to ffmpeg executable
ffmpeg.setFfprobePath(ffprobeStatic.path); // Path to ffprobe executable

rpc.register(clientId);

const path = require("path");

const rpcClient = new rpc.Client({ transport: "ipc" });

rpcClient.login({ clientId }).catch(console.error);

require("@electron/remote/main").initialize();

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

  win.once("ready-to-show", () => {
    win.moveTop();
    win.focus();
    win.show();
  });

  if (process.argv.length >= 2) {
    let filePath = process.argv[1];

    ipcMain.on("request-file-path", (event) => {
      event.sender.send("open-file-path", filePath);
    });
  }

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", (event, argv) => {
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
        win.show();
        win.webContents.send("open-file-path", argv[2]);
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
    rpcClient.setActivity(activityObject).catch(() => null);
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

const extractSubtitles = (videoPath) => {
  return new Promise((resolve, reject) => {
    if (!ffmpegStatic || !ffprobeStatic) {
      reject(new Error("ffmpeg or ffprobe not found"));
      return;
    }

    if (!fs.existsSync(videoPath)) {
      reject(new Error(`Video file not found: ${videoPath}`));
      return;
    }

    const tempDir = path.join(os.tmpdir(), "subtitles");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const checkForSubtitles = (videoPath) => {
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
          if (err) {
            reject(new Error(`FFprobe error: ${err.message}`));
          } else {
            const subtitleStreams = metadata.streams
              .filter((stream) => stream.codec_type === "subtitle")
              .map((stream) => ({
                ...stream,
                language: stream.tags?.language || "eng",
              }));
            resolve(subtitleStreams);
          }
        });
      });
    };

    const extractSubtitleStream = (
      videoPath,
      tempDir,
      streamIndex,
      codecName,
      language
    ) => {
      return new Promise((resolve, reject) => {
        const outputFile = path.join(
          tempDir,
          `subtitle_${streamIndex}_${language}.${getSubtitleExtension(
            codecName
          )}`
        );

        ffmpeg(videoPath)
          .outputOptions([`-map 0:s:${streamIndex}`, "-c:s copy"])
          .output(outputFile)
          .on("start", (commandLine) => {
          })
          .on("progress", (progress) => {
          })
          .on("end", () => {
            resolve({ codec: codecName, file: outputFile, language });
          })
          .on("error", (err, stdout, stderr) => {
            console.error(
              `Error extracting subtitle stream ${streamIndex}: ${err.message}`
            );
            console.error(`FFmpeg stderr: ${stderr}`);
            reject(err);
          })
          .run();
      });
    };

    const getSubtitleExtension = (codecName) => {
      const codecToExtension = {
        hdmv_pgs_subtitle: "sup",
        subrip: "srt",
        ass: "ass",
        mov_text: "mov_text",
        webvtt: "vtt",
        dvb_subtitle: "sub",
        dvd_subtitle: "sub",
        xsub: "sub",
      };
      return codecToExtension[codecName] || "srt";
    };

    checkForSubtitles(videoPath)
      .then((subtitleStreams) => {
        if (subtitleStreams.length > 0) {
          console.log(
            `${subtitleStreams.length} subtitle streams found. Starting extraction...`
          );
          const extractionPromises = subtitleStreams.map((stream, index) =>
            extractSubtitleStream(
              videoPath,
              tempDir,
              index,
              stream.codec_name,
              stream.language
            )
          );
          return Promise.all(extractionPromises);
        } else {
          reject(new Error("No subtitle streams found in the video."));
        }
      })
      .then((subtitles) => {
        resolve(subtitles);
      })
      .catch((err) => {
        reject(new Error(`Error: ${err.message}`));
      });
  });
};

ipcMain.handle("extract-subtitles", async (event, videoPath) => {
  try {
    const subtitles = await extractSubtitles(videoPath);
    return subtitles;
  } catch (error) {
    console.error(error);
    return null;
  }
});
