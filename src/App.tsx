import { Routes, Route } from "react-router-dom";
import { MainPage, PlayerPage } from "./pages";
import { Theme } from "@radix-ui/themes";
import "react-contexify/dist/ReactContexify.css";
import "@radix-ui/themes/styles.css";
import { useAppSelector } from "./hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formats } from "./constants";
import { useDispatch } from "react-redux";
import { playerActions } from "./store";
const { ipcRenderer } = window.require("electron");
const fs = window.require("fs");
const path = window.require("path");

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { primaryColor } = useAppSelector((state) => state.settings);

  const requestOpenedFilePath = () => {
    ipcRenderer.send("request-file-path");
    ipcRenderer.on("file-path", async (event, filePath) => {
      const fileCheck = path.parse(filePath);
      const findPath = await fs.promises.readdir(fileCheck.dir);
      if (!findPath) return;
      const isVideo = formats.includes(fileCheck.ext.slice(1));
      if (!isVideo) return;
      const mediaParent = path.dirname(filePath);
      localStorage.setItem("last-dir", mediaParent);
      dispatch(playerActions.updatePlaylist([findPath]));
      navigate(`/player?type=file`);
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
          ::-moz-selection {
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
