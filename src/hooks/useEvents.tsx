import { useEffect, useState } from "react";
import { usePlayerContext } from "../contexts";
import { usePlayer, useStore, useToast } from ".";
import { useDispatch } from "react-redux";
import { controlsActions, playerActions, timerActions } from "../store";
import { useAppSelector } from ".";

const useEvents = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [isBackgroundPause, setIsBackgroundPause] = useState(false);

  const { videoRef } = usePlayerContext();
  const { isPlaying, isPiP } = useAppSelector((state) => state.player);
  const { playInBackground, isLoop } = useAppSelector(
    (state) => state.settings
  );
  const { volume, isMuted } = useAppSelector((state) => state.volume);
  const { duration, currentTime } = useAppSelector((state) => state.timer);

  const { handlePause, handlePlay } = usePlayer();
  const { handleStoreData } = useStore();

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!!document.fullscreenElement) {
        dispatch(controlsActions.fullscreen());
      } else {
        dispatch(controlsActions.unfullscreen());
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // useEffect(() => {
  //   if (!videoRef.current) return;
  //   if (isPlaying) {
  //     videoRef.current?.play();
  //     handleRemoveControllerDependencies("paused");
  //   } else {
  //     videoRef.current?.pause();
  //     handleAddControllerDependencies("paused");
  //   }
  // }, [isPlaying]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const enterPiPHandler = () => dispatch(playerActions.enterPiP());
    const leavePiPHandler = () => dispatch(playerActions.exitPiP());

    videoElement.addEventListener("enterpictureinpicture", enterPiPHandler);
    videoElement.addEventListener("leavepictureinpicture", leavePiPHandler);

    return () => {
      videoElement.removeEventListener(
        "enterpictureinpicture",
        enterPiPHandler
      );
      videoElement.removeEventListener(
        "leavepictureinpicture",
        leavePiPHandler
      );
    };
  }, [isPiP]);

  const calculateBufferedPercentage = () => {
    if (!videoRef.current) return 0;
    const buffered = videoRef.current.buffered;
    if (buffered.length === 0) return 0;
    const bufferedEnd = buffered.end(buffered.length - 1);
    return bufferedEnd / duration;
  };

  useEffect(() => {
    const storeInterval = setInterval(() => {
      if (!duration || !videoRef.current) return;
      handleStoreData({
        time: videoRef.current.currentTime,
      });
    }, 500);

    return () => {
      clearInterval(storeInterval);
    };
  }, [duration]);

  useEffect(() => {
    const bufferedPercentage = calculateBufferedPercentage();
    dispatch(timerActions.buffer(bufferedPercentage));
  }, [currentTime]);

  useEffect(() => {
    const handleBlur = () => {
      if (!videoRef.current) return;
      if (!playInBackground && isPlaying) {
        handlePause();
        setIsBackgroundPause(true);
      }
    };

    const handleFocus = () => {
      if (!videoRef.current) return;
      if (isBackgroundPause) {
        handlePlay();
        setIsBackgroundPause(false);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [playInBackground, isBackgroundPause, isPlaying]);

  useEffect(() => {
    toast.showToast(`Volume: ${volume}%`);
  }, [volume]);

  useEffect(() => {
    toast.showToast(`Loop: ${isLoop ? "on" : "off"}`);
  }, [isLoop]);

  useEffect(() => {
    toast.showToast(isPlaying ? "Playing" : "Paused");
  }, [isPlaying]);
};

export default useEvents;
