import { Routes, Route, HashRouter } from "react-router-dom";
import { MainPage, PlayerPage } from "./pages";
import { Theme } from "@radix-ui/themes";
import "react-contexify/dist/ReactContexify.css";
import "@radix-ui/themes/styles.css";
import { useAppSelector } from "./hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");
const fs = window.require("fs");
const path = window.require("path");

function App() {
  const navigate = useNavigate();
  const { primaryColor } = useAppSelector((state) => state.settings);

  const requestOpenedFilePath = () => {
    ipcRenderer.send("request-file-path");
    ipcRenderer.on("file-path", async (event, filePath) => {
      const fileCheck = path.parse(filePath);
      const findExt = ["mp4", "mkv", "webm", "avi", "mov", "wmv", "mpg"];
      const findPath = await fs.promises.readdir(fileCheck.dir);
      if (!findPath) return;
      const isVideo = findExt.includes(fileCheck.ext.slice(1));
      if (!isVideo) return;
      
      navigate(`/player?src=${filePath}&type=file`);
    });
  };
  useEffect(() => {
    requestOpenedFilePath();
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
