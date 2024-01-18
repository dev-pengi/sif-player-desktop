import { FC, useCallback, useEffect } from "react";
import { usePlayerContext } from "../../contexts";
import MainController from "../controllers/MainController";
import { useLoader, useRPC, useTimer } from "../../hooks";
import { useAppSelector } from "../../hooks";
import { throttle } from "lodash";
import { useDispatch } from "react-redux";
import { playerActions } from "../../store";
import { DarkLayer } from "../addons";
import { formatTime, separateText } from "../../utils";

const VideoPlayer: FC = () => {
  const dispatch = useDispatch();
  const rpc = useRPC();
  const { videoRef } = usePlayerContext();

  const { isPlaying, videoSrc, mediaData } = useAppSelector(
    (state) => state.player
  );
  const { duration, currentTime } = useAppSelector((state) => state.timer);
  const { allowRPC } = useAppSelector((state) => state.settings);

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

  useEffect(() => {
    if (!(mediaData.name && currentTime && duration)) return;
    if (allowRPC) {
      rpc.set(
        `Status: ${isPlaying ? "Playing" : "Paused"}`,
        `Playing Media: ${formatTime(currentTime)}`,
        separateText(mediaData.name)
      );
    } else {
      rpc.clear();
    }
  }, [isPlaying, currentTime, mediaData.name, duration, allowRPC]);

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
