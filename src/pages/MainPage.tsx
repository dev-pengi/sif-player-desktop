import { FC, useEffect } from "react";
import { BackIcon, CloseIcon, DashIcon, WindowMaximizeIcon } from "../assets";
import { useAppSelector, useClean, useRPC } from "../hooks";
import { FilesViewer, Separator } from "../components";

const { ipcRenderer } = window.require("electron");

const MainPage: FC = () => {
  const rpc = useRPC();
  useClean();

  const { allowRPC } = useAppSelector((state) => state.settings);

  const handleClose = () => {
    ipcRenderer.send("close");
  };
  const handleMaximizeToggle = () => {
    ipcRenderer.send("maximize");
  };
  const handleMinimize = () => {
    ipcRenderer.send("minimize");
  };

  useEffect(() => {
    if (allowRPC) {
      rpc.set(`Browsing Files`, `Home`);
    } else {
      rpc.clear();
    }
  }, [allowRPC]);

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
          <div
            onClick={handleClose}
            className="w-[45px] flex items-center justify-center h-full duration-100 text-[18px] hover:bg-red-500"
          >
            <CloseIcon />
          </div>
          <div
            onClick={handleMaximizeToggle}
            className="w-[45px] flex items-center justify-center h-full duration-100 text-[14px] hover:bg-[#ffffff21]"
          >
            <WindowMaximizeIcon />
          </div>
          <div
            onClick={handleMinimize}
            className="w-[45px] flex items-center justify-center h-full duration-100  hover:bg-[#ffffff21]"
          >
            <DashIcon />
          </div>
        </div>
      </nav>
      <div className="flex w-full h-[calc(100%-45px)] fixed top-[45px]">
        <div
          className="w-[400px] h-full py-3 px-3"
          style={{
            borderRight: "1px solid #ffffff21",
          }}
        >
          <div className="flex items-center gap-2">
            <button className="hover:bg-[#ffffff16] duration-100 flex items-center px-1.5 py-1.5 text-[20px] rounded-md">
              <BackIcon />
            </button>
            <input
              type="text"
              className=" px-3 py-[5.5px] rounded-md bg-[#ffffff16] duration-100 text-[14px] w-[100%]"
              placeholder="Search"
            />
          </div>
          <Separator separateBy={14}/>
          <div className="flex flex-col items-start justify-start gap-2">
            <h3 className="text-[14px] font-bold ml-3 opacity-60 tracking-wide">Tabs</h3>
            <div className="bg-[#ffffff21] hover:text-neutral-100 text-[14px] duration-100 cursor-pointer w-full px-3 py-1.5 text-neutral-100 rounded-md">
              File Explorer
            </div>
            <div className=" hover:text-neutral-100 text-[15px] duration-100 cursor-pointer w-full px-3 py-1.5 text-neutral-400 rounded-md">
              Import URL
            </div>
            <div className=" hover:text-neutral-100 text-[15px] duration-100 cursor-pointer w-full px-3 py-1.5 text-neutral-400 rounded-md">
              File Explorer
            </div>
          </div>
        </div>
        <FilesViewer />
      </div>
    </div>
  );
};

export default MainPage;
