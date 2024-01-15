import { FC } from "react";
import Button from "./Button";
import { BackIcon } from "../../../assets";
import { usePlayer } from "../../../hooks";

const BackButton: FC = () => {
  const { handleBack } = usePlayer();
  return (
    <Button onClick={handleBack}>
      <div className="absolute text-[24px] left-0 right-0 top-0 bottom-0 h-max w-max m-auto">
        <BackIcon />
      </div>
    </Button>
  );
};

export default BackButton;
