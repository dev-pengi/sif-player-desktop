import { useDispatch } from "react-redux";
import { useStore } from ".";
import { usePlayerContext } from "../contexts";
import { useAppSelector } from ".";
import { volumeActions } from "../store";

const useVolume = () => {
  const dispatch = useDispatch();
  const { volume, isMuted } = useAppSelector((state) => state.volume);
  const { videoRef } = usePlayerContext();
  const { handleStoreData } = useStore();

  const handleVolumeChange = (volume: number) => {
    if (!videoRef.current) return;
    const newVolume = Math.max(0, Math.min(volume, 100));
    dispatch(volumeActions.update(newVolume));
    if (newVolume == 0) {
      dispatch(volumeActions.mute());
      videoRef.current.muted = true;
      handleStoreData({
        volume: newVolume,
        muted: true,
      });
    } else {
      dispatch(volumeActions.unmute());
      videoRef.current.muted = false;
      handleStoreData({
        volume: newVolume,
        muted: false,
      });
    }
    videoRef.current.volume = newVolume / 100;
  };

  const handleToggleMute = () => {
    if (!videoRef?.current) return;

    if (isMuted) {
      dispatch(volumeActions.unmute());
      videoRef.current.muted = false;
      volume === 0 && handleVolumeChange(30);
      handleStoreData({
        muted: false,
      });
    } else {
      dispatch(volumeActions.mute());
      videoRef.current.muted = true;
      handleStoreData({
        muted: true,
      });
    }
  };

  const handleIncreaseVolume = (amount: number) => {
    handleVolumeChange(volume + amount);
  };

  const handleDecreaseVolume = (amount: number) => {
    handleVolumeChange(volume - amount);
  };

  return {
    handleVolumeChange,
    handleToggleMute,
    handleIncreaseVolume,
    handleDecreaseVolume,
  };
};

export default useVolume;
