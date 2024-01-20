import { useDispatch } from "react-redux";
import { usePlayerContext } from "../contexts";
import { timerActions } from "../store";
import { useAppSelector } from ".";

const useTimer = () => {
  const dispatch = useDispatch();
  const { videoRef } = usePlayerContext();

  const handleSeek = (time: number) => {
    if (!videoRef?.current) return;
    const clampedTime = Math.max(0, Math.min(time, videoRef.current.duration));
    dispatch(timerActions.update(clampedTime));
    videoRef.current.currentTime = clampedTime;
  };

  const handleSkipForward = (amount: number) => {
    if (!videoRef?.current) return;
    const newTime = Math.max(
      0,
      Math.min(videoRef.current.currentTime + amount, videoRef.current.duration)
    );
    dispatch(timerActions.update(newTime));
    videoRef.current.currentTime = newTime;
  };

  const handleSkipBackward = (amount: number) => {
    if (!videoRef?.current) return;
    const newTime = Math.max(
      0,
      Math.min(videoRef.current.currentTime - amount, videoRef.current.duration)
    );
    dispatch(timerActions.update(newTime));
    videoRef.current.currentTime = newTime;
  };

  const handleTimeUpdate = () => {
    if (!videoRef?.current) return;
    const time = videoRef.current.currentTime;
    dispatch(timerActions.update(time));
  };

  return {
    handleSeek,
    handleSkipForward,
    handleSkipBackward,
    handleTimeUpdate,
  };
};

export default useTimer;
