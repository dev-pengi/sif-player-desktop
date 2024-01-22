import { FC } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import {
  PlayToggle,
  FullScreenButton,
  VolumeSlider,
  PlayBackSpeed,
  PlaylistControls,
} from "../Buttons";
import { formatTime } from "../../../utils";
import TrackSlider from "../Track/TrackSlider";
import MiniProgress from "../Track/MiniProgress";
import LockButton from "../Buttons/LockButton";
import { useAppSelector } from "../../../hooks";
import { useDispatch } from "react-redux";
import { controlsActions } from "../../../store";

const BottomController: FC = () => {
  const dispatch = useDispatch();
  const { controllersDeps, isLocked } = useAppSelector(
    (state) => state.controls
  );
  const { allowAnimations } = useAppSelector((state) => state.settings);
  const { duration, currentTime } = useAppSelector((state) => state.timer);

  return (
    <>
      <AnimatePresence>
        {controllersDeps.length && !isLocked && (
          <motion.div
            variants={{
              visible: { opacity: 1 },
              hidden: { opacity: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onMouseEnter={() => dispatch(controlsActions.panelHover())}
            onMouseLeave={() => dispatch(controlsActions.panelUnhover())}
            transition={{
              duration: allowAnimations ? 0.1 : 0,
            }}
            className="relative flex w-full items-center px-12 h-[80px] flex-col"
          >
            <TrackSlider />
            <div className="flex justify-center w-full mt-2">
              <div className="relative flex items-center justify-start flex-1">
                <PlayToggle />
                <div className="ml-[14px]">
                  <LockButton />
                </div>
                <LayoutGroup>
                  <div className="ml-3">
                    <VolumeSlider />
                  </div>
                  <motion.div layout className="ml-3">
                    <motion.p
                      transition={{
                        duration: 0,
                      }}
                      layout
                      className="drop-shadow-2xl"
                    >
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </motion.p>
                  </motion.div>
                </LayoutGroup>
              </div>
              <div className="relative flex items-center justify-center"></div>
              <div className="relative flex items-center justify-end flex-1">
                <PlaylistControls />
                <PlayBackSpeed />
                <div className="ml-3">
                  <FullScreenButton />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomController;
