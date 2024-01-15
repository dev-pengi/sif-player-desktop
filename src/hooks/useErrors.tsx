import { useEffect } from "react";
import { usePlayerContext } from "../contexts";
import { playerActions } from "../store";
import { useDispatch } from "react-redux";
import { useAppSelector } from ".";

const useErrors = () => {
  const dispatch = useDispatch();
  const { videoSrc } = useAppSelector(state => state.player);
  const { videoRef } = usePlayerContext();
  const handleError = () => dispatch(playerActions.error());
  const handleRemoveError = () => dispatch(playerActions.unerror());
  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      if (!videoRef?.current?.readyState) handleError();
    }, 180000);

    return () => {
      clearTimeout(loadTimeout);
      handleRemoveError();
    };
  }, [videoSrc]);

  useEffect(() => {
    const validTimeout = setTimeout(() => {
      if (!videoSrc) handleError();
    }, 3000);
    return () => clearTimeout(validTimeout);
  }, [videoSrc]);
};

export default useErrors;
