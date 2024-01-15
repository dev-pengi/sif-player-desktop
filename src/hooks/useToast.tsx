import { useDispatch } from "react-redux";
import { useAppSelector } from ".";
import { controlsActions } from "../store";

const useToast = () => {
  const dispatch = useDispatch();

  return {
    showToast: (content: string) => {
      dispatch(controlsActions.fireActionToast(content));
    },
    hideToast: () => {
      dispatch(controlsActions.resetActionToast());
    },
  };
};

export default useToast;
