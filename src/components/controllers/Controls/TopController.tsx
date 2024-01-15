import { FC, useEffect } from "react";
import { BackButton, MenuButton } from "../Buttons";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector, usePlayer } from "../../../hooks";
import { CloseIcon, DashIcon, WindowMaximizeIcon } from "../../../assets";
const { ipcRenderer } = window.require("electron");

const TopController: FC = () => {
  const { mediaData } = useAppSelector((state) => state.player);
  const { allowAnimations } = useAppSelector((state) => state.settings);
  const { isLocked, controllersDeps, isFullscreen } = useAppSelector(
    (state) => state.controls
  );
  const { leaveFullScreen } = usePlayer();
  const videoName = mediaData?.name ?? "Untitled Video";

  useEffect(() => {
    document.title = `Sif Player | ${videoName}`;
  }, [mediaData]);

  const handleClose = () => {
    if (isFullscreen) {
      leaveFullScreen();
    }
    ipcRenderer.send("close");
  };
  const handleMaximizeToggle = () => {
    if (isFullscreen) {
      leaveFullScreen();
    }
    ipcRenderer.send("maximize");
  };
  const handleMinimize = () => {
    if (isFullscreen) {
      leaveFullScreen();
    }
    ipcRenderer.send("minimize");
  };

  return (
    <AnimatePresence>
      {controllersDeps.length && !isLocked && (
        <>
          <nav
            className="flex w-full items-center h-[45px] fixed drag"
            style={{
              borderBottom: `1px solid #ffffff21`,
            }}
          >
            <div className="flex flex-1">
              <div className="ml-3 font-bold text-[13px] opacity-80 tracking-wide">
                <div className="relative flex items-center justify-center no-drag">
                  <BackButton />
                  <div className="relative ml-3 flex items-center justify-center">
                    <MenuButton />
                  </div>
                  <p className="ml-3">{videoName}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row-reverse h-full items-center no-drag">
              <button
                onClick={handleClose}
                className="cursor-default w-[45px] flex items-center justify-center h-full duration-100 text-[18px] hover:bg-[#ee000081]"
              >
                <CloseIcon />
              </button>
              <button
                onClick={handleMaximizeToggle}
                className="cursor-default w-[45px] flex items-center justify-center h-full duration-100 text-[14px] hover:bg-[#ffffff21]"
              >
                <WindowMaximizeIcon />
              </button>
              <button
                onClick={handleMinimize}
                className="cursor-default w-[45px] flex items-center justify-center h-full duration-100  hover:bg-[#ffffff21]"
              >
                <DashIcon />
              </button>
            </div>
          </nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default TopController;
