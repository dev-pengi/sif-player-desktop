import { FC } from "react";
import { CloseIcon, DashIcon, WindowMaximizeIcon } from "../assets";
import { useClean } from "../hooks";
import { FilesViewer } from "../components";

const { ipcRenderer } = window.require("electron");

const MainPage: FC = () => {
  useClean();

  const handleClose = () => {
    ipcRenderer.send("close");
  };
  const handleMaximizeToggle = () => {
    ipcRenderer.send("maximize");
  };
  const handleMinimize = () => {
    ipcRenderer.send("minimize");
  };

  return (
    <div className="h-screen">
      <nav
        className="flex w-full items-center h-[45px] fixed drag"
        style={{
          borderBottom: `1px solid #ffffff21`,
        }}
      >
        <div className="flex flex-1">
          <p className="ml-3 font-bold text-[13px] opacity-60 tracking-wide">
            Sif Player
          </p>
        </div>
        <div className="flex flex-row-reverse h-full items-center no-drag">
          <button
            onClick={handleClose}
            className="w-[45px] flex items-center justify-center h-full duration-100 text-[18px] hover:bg-red-500"
          >
            <CloseIcon />
          </button>
          <button
            onClick={handleMaximizeToggle}
            className="w-[45px] flex items-center justify-center h-full duration-100 text-[14px] hover:bg-[#ffffff21]"
          >
            <WindowMaximizeIcon />
          </button>
          <button
            onClick={handleMinimize}
            className="w-[45px] flex items-center justify-center h-full duration-100  hover:bg-[#ffffff21]"
          >
            <DashIcon />
          </button>
        </div>
      </nav>
      <div className="flex w-full h-[calc(100%-45px)] fixed top-[45px] py-3 px-3 ">
        <FilesViewer />
      </div>
    </div>
  );
};

export default MainPage;
