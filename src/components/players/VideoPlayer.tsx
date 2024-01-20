import { FC, useCallback, useEffect } from "react";
import { usePlayerContext } from "../../contexts";
import MainController from "../controllers/MainController";
import { useLoader, useRPC, useStore, useTimer } from "../../hooks";
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

  const { handleStoreData } = useStore();
  const { handleLoadStart, handleLoadEnd, handleVideoEnd } = useLoader();

  const { isPlaying, videoSrc, mediaData, isImporting } = useAppSelector(
    (state) => state.player
  );
  const { duration, currentTime } = useAppSelector((state) => state.timer);
  const { allowRPC } = useAppSelector((state) => state.settings);

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
        `Playing Media: ${formatTime(currentTime)}/${formatTime(duration)}`,
        separateText(mediaData.name)
      );
    } else {
      rpc.clear();
    }
  }, [isPlaying, currentTime, mediaData.name, duration, allowRPC]);

  useEffect(() => {
    const storeInterval = setInterval(() => {
      if (!videoRef.current || isImporting) return;
      handleStoreData(null, videoSrc, {
        time: videoRef.current.currentTime,
      });
    }, 500);

    return () => {
      clearInterval(storeInterval);
    };
  }, [videoSrc, isImporting]);

  useEffect(() => {}, [videoSrc]);

  return (
    <>
      {videoSrc && (
        <video
          ref={videoRef}
          className="object-contain w-screen h-screen"
          src={videoSrc}
          onError={handleLoadStart}
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadEnd}
          onWaiting={() => dispatch(playerActions.loading())}
          onPlaying={() => dispatch(playerActions.loaded())}
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
