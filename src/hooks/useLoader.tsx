import { useDispatch } from "react-redux";
import { usePlayerContext } from "../contexts";
import { playerActions, timerActions } from "../store";
import { useAppSelector, useStore, useTimer } from ".";

const useLoader = () => {
  const dispatch = useDispatch();
  const { videoRef } = usePlayerContext();
  const { isLoop, saveTrack, autoPlay } = useAppSelector(
    (state) => state.settings
  );
  const { videoSrc, videoIndex, playlist } = useAppSelector(
    (state) => state.player
  );

  const { handleFetchData } = useStore();
  const { handleSeek } = useTimer();

  const handleLoadStart = () => {
    dispatch(playerActions.import());
    dispatch(timerActions.reset());
    dispatch(playerActions.loading());
  };

  const handleLoadEnd = () => {
    dispatch(playerActions.import());
    const data = handleFetchData(null, videoSrc);
    dispatch(playerActions.loaded());
    dispatch(timerActions.init(videoRef.current.duration));
    let videoTime = 0;
    if (data) {
      const { time } = data;
      if (!isNaN(time) && time > 0) {
        videoTime = time;
      }
    }
    if (videoTime >= videoRef.current.duration - 1) handleSeek(0);
    else {
      if (saveTrack) handleSeek(videoTime);
    }

    const resolution = videoRef.current.videoHeight;
    dispatch(
      playerActions.addData({
        name: "resolution",
        value: resolution,
      })
    );
    dispatch(playerActions.imported());
  };

  const handleVideoEnd = () => {
    if (isLoop) {
      videoRef.current.currentTime = 0;
      dispatch(timerActions.update(0));
      videoRef.current.play();
    } else {
      if (videoIndex < playlist?.length - 1 && autoPlay) {
        dispatch(playerActions.incrementVideoIndex());
      }
    }
  };

  return {
    handleLoadStart,
    handleLoadEnd,
    handleVideoEnd,
  };
};

export default useLoader;
