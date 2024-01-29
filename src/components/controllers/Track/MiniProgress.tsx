import { FC, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "../../../hooks";

const MiniProgress: FC = () => {
  const { primaryColor, miniProgressBar } = useAppSelector(
    (state) => state.settings
  );

  const [showMiniBar, setShowMiniBar] = useState(false);

  const { controllersDeps } = useAppSelector((state) => state.controls);
  const { timePercentage } = useAppSelector((state) => state.timer);
  useEffect(() => {
    setShowMiniBar(controllersDeps.length === 0);
  }, [controllersDeps]);
  return (
    <>
      <div
        style={{
          background: "#ffffff20",
          height: 5,
          opacity: showMiniBar && miniProgressBar ? 1 : 0,
        }}
        className="w-full absolute -bottom-[1px] left-0 z-[1000] duration-100"
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
      </div>
    </>
  );
};

export default MiniProgress;
