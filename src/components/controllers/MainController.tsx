import { FC, useCallback, useEffect, useRef } from "react";
import {
  BottomController,
  CenterController,
  LockedController,
  TopController,
} from "./Controls";
import { ActionToast, BorderShadows, SleepMode } from "../addons";
import { useAppSelector, usePlayer } from "../../hooks";
import { throttle } from "lodash";
import { useDispatch } from "react-redux";
import { controlsActions } from "../../store";

const CONTROLLER_DEP: string = "active";

const MainController: FC = () => {
  const dispatch = useDispatch();
  const { controllersDeps, lastActivityTime } = useAppSelector(
    (state) => state.controls
  );
  const { sleepMode } = useAppSelector((state) => state.settings);
  const {
    handleAddControllerDependencies,
    handleRemoveControllerDependencies,
  } = usePlayer();

  const handleEvent = useCallback(
    throttle(() => {
      dispatch(controlsActions.updateLastActivityTime());
    }, 200),
    [controllersDeps]
  );

  useEffect(() => {
    handleAddControllerDependencies(CONTROLLER_DEP);
    const timer = setTimeout(() => {
      handleRemoveControllerDependencies(CONTROLLER_DEP);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [lastActivityTime]);

  useEffect(() => {
    window.addEventListener("mousemove", handleEvent);
    window.addEventListener("mousedown", handleEvent);
    window.addEventListener("keyup", handleEvent);
    window.addEventListener("touchstart", handleEvent);
    window.addEventListener("touchend", handleEvent);

    return () => {
      window.removeEventListener("mousedown", handleEvent);
      window.removeEventListener("mousemove", handleEvent);
      window.removeEventListener("keyup", handleEvent);
      window.removeEventListener("touchstart", handleEvent);
      window.removeEventListener("touchend", handleEvent);
    };
  }, [controllersDeps]);

  return (
    <div
      style={{
        cursor: controllersDeps.length ? "auto" : "none",
      }}
      className="fixed w-screen h-screen flex flex-col z-1"
    >
      <BorderShadows />
      <ActionToast />
      {sleepMode && <SleepMode />}
      <TopController />
      <CenterController />
      <BottomController />
      <LockedController />
    </div>
  );
};

export default MainController;
