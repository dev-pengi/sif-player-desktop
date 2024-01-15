import { useDispatch } from "react-redux";
import { usePlayerContext } from "../contexts";
import { playerActions, timerActions } from "../store";
import { useAppSelector } from ".";

const useLoader = () => {
  const dispatch = useDispatch();
  const { videoRef } = usePlayerContext();
  const { isLoop } = useAppSelector((state) => state.settings);

  const handleLoadStart = () => {
    dispatch(playerActions.loading());
  };

  const handleLoadEnd = () => {
    dispatch(playerActions.loaded());
    dispatch(timerActions.init(videoRef.current.duration));
    const resolution = videoRef.current.videoHeight;

    dispatch(
      playerActions.addData({
        name: "resolution",
        value: resolution,
      })
    );
  };

  const handleVideoEnd = () => {
    if (isLoop) {
      videoRef.current.currentTime = 0;
      dispatch(timerActions.update(0));
      videoRef.current.play();
    }
  };

  return {
    handleLoadStart,
    handleLoadEnd,
    handleVideoEnd,
  };
};

export default useLoader;
