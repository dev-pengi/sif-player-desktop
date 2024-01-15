import { FC, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { PauseIcon, PlayIcon } from "../../../assets";
import Button from "./Button";
import { usePlayer } from "../../../hooks";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../../hooks";

interface PlayToggleProps {}

const PlayToggle: FC<PlayToggleProps> = ({}) => {
  const playController = useAnimation();
  const pauseController = useAnimation();
  const iconVariants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.2 },
  };

  const { isPlaying } = useAppSelector((state) => state.player);
  const { allowAnimations } = useAppSelector((state) => state.settings);
  const { handleTogglePlay } = usePlayer();

  useEffect(() => {
    playController.start(isPlaying ? "hidden" : "visible");
    pauseController.start(isPlaying ? "visible" : "hidden");
  }, [isPlaying]);

  return (
    <Button onClick={handleTogglePlay}>
      <motion.div
        className="absolute left-0 right-0 top-0 bottom-0 h-max w-max m-auto"
        variants={iconVariants}
        initial="hidden"
        animate={playController}
        transition={{
          duration: allowAnimations ? 0.1 : 0,
        }}
      >
        <PlayIcon />
      </motion.div>
      <motion.div
        className="absolute text-[22px] left-0 right-0 top-0 bottom-0 h-max w-max m-auto"
        variants={iconVariants}
        initial="visible"
        animate={pauseController}
        transition={{
          duration: allowAnimations ? 0.1 : 0,
        }}
      >
        <PauseIcon />
      </motion.div>
    </Button>
  );
};

export default PlayToggle;
