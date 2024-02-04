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
            <div className="flex justify-between w-full mt-2">
              <div className="relative flex items-center justify-start flex-1 gap-3">
                <PlayToggle />
                <LockButton />
                <LayoutGroup>
                  <VolumeSlider />
                  <motion.div layout>
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
              <div className="relative flex items-center justify-end flex-1 gap-3">
                <PlaylistControls />
                <PlayBackSpeed />
                <FullScreenButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomController;
