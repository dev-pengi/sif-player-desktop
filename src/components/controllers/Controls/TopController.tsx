import { FC, useEffect } from "react";
import { BackButton, MenuButton } from "../Buttons";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector, usePlayer } from "../../../hooks";
import { CloseIcon, DashIcon, WindowMaximizeIcon } from "../../../assets";
import {
  closeApp,
  ipcRenderer,
  maximizeApp,
  minimizeApp,
  separateText,
} from "../../../utils";

const TopController: FC = () => {
  const { mediaData } = useAppSelector((state) => state.player);
  const { closeToTray } = useAppSelector((state) => state.settings);
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
    closeApp(closeToTray);
  };
  const handleMaximizeToggle = () => {
    if (isFullscreen) {
      leaveFullScreen();
    }
    maximizeApp();
  };
  const handleMinimize = () => {
    if (isFullscreen) {
      leaveFullScreen();
    }
    minimizeApp();
  };

  return (
    <AnimatePresence>
      {controllersDeps.length && !isLocked && (
        <>
          <nav
            className={`flex w-full items-center justify-between h-[45px] fixed ${
              isFullscreen ? "no-drag" : "drag"
            }`}
            style={{
              borderBottom: `1px solid #ffffff21`,
            }}
          >
            <div className="flex max-w-[min(800px,60%)]">
              <div className="px-3 font-bold w-full text-[13px] opacity-80 tracking-wide">
                <div className="relative flex gap-3 items-center justify-start no-drag">
                  <BackButton />
                  {!isFullscreen && <MenuButton />}
                  <p className="truncate break-words">
                    {separateText(videoName)}
                  </p>
                </div>
              </div>
            </div>
            {isFullscreen ? (
              <div className="mr-3">
                <MenuButton />
              </div>
            ) : (
              <div className="flex flex-row-reverse h-full items-center no-drag">
                <button
                  onClick={handleClose}
                  className="cursor-default w-[45px] flex items-center justify-center h-full duration-100 text-[18px] hover:bg-[#ee0000c9]"
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
            )}
          </nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default TopController;
