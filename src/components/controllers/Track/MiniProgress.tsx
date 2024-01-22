import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "../../../hooks";

const MiniProgress: FC = () => {
  const { primaryColor, miniProgressBar } = useAppSelector(
    (state) => state.settings
  );
  const { controllersDeps } = useAppSelector((state) => state.controls);
  const { timePercentage } = useAppSelector((state) => state.timer);
  return (
    <>
      <p
        className="absolute"
        style={{
          visibility: "hidden",
        }}
      >
        {String(!controllersDeps.length)}
      </p>
      <AnimatePresence>
        {!controllersDeps.length && miniProgressBar && (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 0.8 },
            }}
            style={{
              background: "#ffffff20",
              height: 4,
            }}
            layoutId="progress"
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full absolute -bottom-[1px] left-0 z-[1000]"
          >
            <motion.div
              className="w-full h-full absolute left-0 bottom-0 right-0"
              style={{
                background: primaryColor,
                transformOrigin: "0 50%",
              }}
              transition={{
                type: "tween",
                duration: 0,
              }}
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: timePercentage,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MiniProgress;
