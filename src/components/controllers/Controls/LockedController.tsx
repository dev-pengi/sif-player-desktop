import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UnlockIcon } from "../../../assets";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks";
import { controlsActions } from "../../../store";

const LockedController: FC = () => {
  const dispatch = useDispatch();
  const { isLocked, controllersDeps } = useAppSelector(
    (state) => state.controls
  );
  const { allowAnimations } = useAppSelector((state) => state.settings);
  return (
    <>
      <AnimatePresence>
        {isLocked && controllersDeps.length && (
          <motion.div
            onClick={() => dispatch(controlsActions.unlock())}
            variants={{
              visible: { opacity: 1, y: -20 },
              hidden: { opacity: 0, y: 20 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              duration: allowAnimations ? 0.1 : 0,
            }}
            className="py-2 px-4 cursor-pointer bottom-0 bg-[#ffffff3e] w-max rounded-[10px] flex items-center justify-center z-2 absolute left-0 right-0 mx-auto"
          >
            <div className="text-[22px] ">
              <UnlockIcon />
            </div>
            <p className="ml-2 ">Unlock Controllers</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LockedController;
