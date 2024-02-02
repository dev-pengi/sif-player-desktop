import { Routes, Route } from "react-router-dom";
import { MainPage, PlayerPage } from "./pages";
import { Theme } from "@radix-ui/themes";
import { useAppSelector } from "./hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formats } from "./constants";
import { useDispatch } from "react-redux";
import { playerActions } from "./store";

import { ipcRenderer, path, fs } from "./utils/node.util";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { primaryColor } = useAppSelector((state) => state.settings);

  const requestOpenedFilePath = () => {
    ipcRenderer.send("request-file-path");
    ipcRenderer.on("file-path", async (_, filePath: string) => {
      try {
        const fileCheck = path.parse(filePath);
        const parentDirents = await fs.promises.readdir(fileCheck.dir, {
          withFileTypes: true,
        });
        if (!parentDirents) return;
        const isVideo = formats.includes(fileCheck.ext.slice(1));
        if (!isVideo) return;
        localStorage.setItem("last-dir", fileCheck.dir);
        const allVideos = parentDirents
          .filter((dir) => {
            const ext = path.extname(dir.name).slice(1);
            return (
              !dir.isDirectory() &&
              !dir.name.startsWith(".") &&
              formats.includes(ext)
            );
          })
          .map((dir) => {
            const nestedDirPath = path.resolve(fileCheck.dir, dir.name);
            return nestedDirPath;
          });
        const openedFileIndex = allVideos.findIndex(
          (video) => video === filePath
        );
        dispatch(playerActions.updatePlaylist(allVideos));
        dispatch(playerActions.updateVideoIndex(openedFileIndex));
        navigate(`/player?type=file`);
      } catch (error) {
        return;
      }
    });
  };

  useEffect(() => {
    requestOpenedFilePath();

    return () => {
      ipcRenderer.removeAllListeners("file-path");
    };
  }, []);

  return (
    <Theme>
      <style>
        {`
          ::selection {
            background: ${primaryColor} !important;
          }
        `}
      </style>
      <Routes>
        <Route path="*" Component={MainPage} />
        <Route path="/player" Component={PlayerPage} />
      </Routes>
    </Theme>
  );
}

export default App;
