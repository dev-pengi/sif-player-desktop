import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  controlsActions,
  playerActions,
  timerActions,
  volumeActions,
} from "../store";
import { useAppSelector } from ".";

const useClean = () => {
  const dispatch = useDispatch();
  // const { mediaData, videoSrc } = useAppSelector((state) => state.player);

  useEffect(() => {
    dispatch(timerActions.reset());
    dispatch(volumeActions.reset());
    dispatch(playerActions.reset());
    dispatch(controlsActions.reset());
    if (document.fullscreenElement) document.exitFullscreen();
  }, []);
};

export default useClean;
