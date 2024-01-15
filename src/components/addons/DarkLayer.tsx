import { FC } from "react";
import { useAppSelector } from "../../hooks";
import { motion, AnimatePresence } from "framer-motion";

const DarkLayer: FC = () => {
  const { allowAnimations, darkLayer, darkLayerOpacity } = useAppSelector(
    (state) => state.settings
  );
  return (
    <>
      <AnimatePresence>
        {darkLayer && (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: darkLayerOpacity / 100 || 25 },
            }}
            style={{
              position: "fixed",
              width: "100vw",
              height: "100vh",
              top: 0,
              background: "#000000",
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              duration: allowAnimations ? 0.1 : 0,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default DarkLayer;
