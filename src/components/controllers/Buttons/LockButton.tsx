import { FC } from "react";
import Button from "./Button";
import { LockIcon } from "../../../assets";
import { useDispatch } from "react-redux";
import { controlsActions } from "../../../store";

const LockButton: FC = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <Button
        onClick={() => {
          dispatch(controlsActions.lock());
        }}
      >
        <div className="absolute text-[24px] left-0 right-0 top-0 bottom-0 h-max w-max m-auto">
          <LockIcon />
        </div>
      </Button>
    </div>
  );
};

export default LockButton;
