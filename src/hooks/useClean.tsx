import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  controlsActions,
  playerActions,
  timerActions,
  volumeActions,
} from "../store";

const useClean = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(timerActions.reset());
    dispatch(volumeActions.reset());
    dispatch(playerActions.reset());
    dispatch(controlsActions.reset());
    if (document.fullscreenElement) document.exitFullscreen();
  }, []);
};

export default useClean;
