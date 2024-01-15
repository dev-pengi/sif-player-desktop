import { FC } from "react";
import { ActivityIndicator } from "../../spins";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector, usePlayer } from "../../../hooks";

const CenterController: FC = () => {
  const { isLoading } = useAppSelector((state) => state.player);
  const { isLocked } = useAppSelector((state) => state.controls);
  const {
    playToggleClick,
    fullScreenOnDoubleClick,
    lockGestures,
    allowAnimations,
    gesturesEnabled,
  } = useAppSelector((state) => state.settings);
  const { handleToggleScreen, handleTogglePlay } = usePlayer();

  const handleClickPlay = () => {
    if (!gesturesEnabled) return;
    if (isLocked && lockGestures) return;
    if (playToggleClick) handleTogglePlay();
  };

  const handleDoubleClick = () => {
    if (!gesturesEnabled) return;
    if (isLocked && lockGestures) return;
    if (fullScreenOnDoubleClick) handleToggleScreen();
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onClick={handleClickPlay}
      className="flex-1 flex items-center justify-center"
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            variants={{
              visible: { opacity: 1 },
              hidden: { opacity: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              duration: allowAnimations ? 0.1 : 0,
            }}
            className="text-[22px]"
          >
            <ActivityIndicator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CenterController;
