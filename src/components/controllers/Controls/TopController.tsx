import { FC, useEffect } from "react";
import { BackButton, MenuButton } from "../Buttons";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../../hooks";

const TopController: FC = () => {
  const { mediaData } = useAppSelector((state) => state.player);
  const { allowAnimations } = useAppSelector((state) => state.settings);
  const { isLocked, controllersDeps } = useAppSelector(
    (state) => state.controls
  );
  const videoName = mediaData?.name ?? "Untitled Video";

  useEffect(() => {
    document.title = `Sif Player | ${videoName}`;
  }, [mediaData]);

  return (
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
          transition={{
            duration: allowAnimations ? 0.1 : 0,
          }}
          className="relative flex z-1 w-full items-center overflow-visible px-12 h-[70px] justify-between"
        >
          <div className="relative flex items-center justify-center">
            <BackButton />
            <p className="ml-3">{videoName}</p>
          </div>
          <div className="relative flex items-center justify-center">
            <MenuButton />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopController;
