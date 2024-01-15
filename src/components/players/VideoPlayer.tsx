import { FC, useCallback } from "react";
import { usePlayerContext } from "../../contexts";
import MainController from "../controllers/MainController";
import { useLoader, useTimer } from "../../hooks";
import { useAppSelector } from "../../hooks";
import { throttle } from "lodash";
import { useDispatch } from "react-redux";
import { playerActions } from "../../store";
import { DarkLayer } from "../addons";

const VideoPlayer: FC = () => {
  const dispatch = useDispatch();
  const { videoRef } = usePlayerContext();

  const { videoSrc } = useAppSelector((state) => state.player);

  const { handleLoadStart, handleLoadEnd, handleVideoEnd } = useLoader();
  const { handleTimeUpdate } = useTimer();

  const handlePlayerTimeUpdate = useCallback(
    throttle(() => {
      handleTimeUpdate();
    }, 500),
    []
  );

  const handlePlayVideo = useCallback(() => {
    dispatch(playerActions.play());
  }, []);

  const handlePauseVideo = useCallback(() => {
    dispatch(playerActions.pause());
  }, []);

  return (
    <>
      {videoSrc && (
        <video
          ref={videoRef}
          className="object-contain w-screen h-screen"
          src={videoSrc}
          onError={handleLoadStart}
          onLoadStart={handleLoadStart}
          onWaiting={handleLoadStart}
          onPlaying={handleLoadEnd}
          onLoadedData={handleLoadEnd}
          onTimeUpdate={handlePlayerTimeUpdate}
          onPlay={handlePlayVideo}
          onPause={handlePauseVideo}
          onEnded={handleVideoEnd}
          autoPlay
        ></video>
      )}
      <DarkLayer />
      <MainController />
    </>
  );
};

export default VideoPlayer;
