import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "../../hooks";
import { controlsActions } from "../../store";

const ActionToast: FC = () => {
  const dispatch = useDispatch();
  const { actionToast } = useAppSelector((state) => state.controls);

  useEffect(() => {
    const cleanTimeout = setTimeout(() => {
      dispatch(controlsActions.resetActionToast());
    }, 3000);

    return () => {
      clearTimeout(cleanTimeout);
    };
  }, [actionToast.status, actionToast.content]);
  return (
    <>
      <AnimatePresence>
        {actionToast.status && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -100 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed z-100 top-6 left-0 right-0 w-max mx-auto px-4 py-2 mt-4 text-sm text-white bg-[#ffffff21] rounded-md shadow-md"
          >
            {actionToast.content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActionToast;
