import { FC, useEffect, useState } from "react";
import { useAppSelector, usePlayer } from "../../hooks";
import { Modal } from "../modals";
import { findLabel, formatTime } from "../../utils";
import { settings } from "../../constants";


type HandleAction = () => void;

const getSleepAction = (
  behavior: string,
  handlePause: HandleAction,
  handleBack: HandleAction
): HandleAction | (() => void) => {
  switch (behavior) {
    case "pause":
      return handlePause;
    case "quit":
      return handleBack;
    case "close":
      return window.close;
  }
};

const SleepMode: FC = () => {
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [remainingSleepTime, setRemainingSleepTime] = useState(60);

  const { sleepMode, sleepModeDelay, sleepModeBehavior } = useAppSelector(
    (state) => state.settings
  );

  const { lastActivityTime } = useAppSelector((state) => state.controls);
  const {
    handlePause,
    handleBack,
    handleAddControllerDependencies,
    handleRemoveControllerDependencies,
  } = usePlayer();

  const sleep = getSleepAction(sleepModeBehavior, handlePause, handleBack);

  const handleSleepAlert = () => {
    setIsSleepModalOpen(true);
    handleAddControllerDependencies("sleep-modal");
  };
  const handleSleepCancel = () => {
    setIsSleepModalOpen(false);
    handleRemoveControllerDependencies("sleep-modal");
  };

  const timeoutDuration = sleepModeDelay * 1000 * 60;
  const sleepAlertDelay = 60000; 

  useEffect(() => {
    if (!sleepMode || !lastActivityTime) return;
    const remainingTime = lastActivityTime + timeoutDuration - Date.now();
    let timeUpdateInterval = null;
    let timeFinishTimeout = null;
    if (remainingTime <= 0 || remainingTime > sleepAlertDelay) {
      handleSleepCancel();
    }
    const sleepTimeout = setTimeout(() => {
      setRemainingSleepTime(sleepAlertDelay / 1000);
      handleSleepAlert();
      timeUpdateInterval = setInterval(() => {
        setRemainingSleepTime((prev) => prev - 1);
      }, 1000);
      timeFinishTimeout = setTimeout(() => {
        handleSleepCancel();
        sleep();
      }, sleepAlertDelay);
    }, remainingTime - sleepAlertDelay);

    return () => {
      clearTimeout(sleepTimeout);
      clearTimeout(timeFinishTimeout);
      clearInterval(timeUpdateInterval);
      setRemainingSleepTime(sleepAlertDelay / 1000);
    };
  }, [sleepMode, lastActivityTime, sleepModeDelay]);

  return (
    <Modal
      isOpen={isSleepModalOpen && sleepMode}
      onClose={handleSleepCancel}
      style={{
        box: { maxWidth: "500px" },
        content: {
          height: "max-content",
          minHeight: 0,
        },
      }}
      title="Sleep Alert"
    >
      <div className="w-full flex flex-col items-center justify-center text-center">
        <p className="opacity-90">
          Your {findLabel(settings.sleepModeDelay, sleepModeDelay)} sleep
          countdown is almost over!
        </p>
        <h2 className="mx-2 text-[60px] opacity-90">{formatTime(remainingSleepTime)}</h2>
        <p className="text-[14px] opacity-75 mt-2">
          NOTE: you can interact with the app to cancel the sleep mode
        </p>
      </div>
    </Modal>
  );
};

export default SleepMode;