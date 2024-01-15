import { FC } from "react";
import { useAppSelector } from "../../hooks";
import { motion, AnimatePresence } from "framer-motion";

const BorderShadows: FC = () => {
  const { controllersDeps, isLocked } = useAppSelector(
    (state) => state.controls
  );
  const { allowAnimations, borderShadows } = useAppSelector(
    (state) => state.settings
  );
  return (
    <>
      <AnimatePresence>
        {controllersDeps.length && borderShadows && !isLocked && (
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
            className="fixed z-0 top-0 left-0 w-full h-[150px] top-shadow pointer-events-none"
          ></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {controllersDeps.length && borderShadows && (
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
            className="fixed z-0 bottom-0 left-0 w-full h-[150px] bottom-shadow pointer-events-none"
          ></motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BorderShadows;
