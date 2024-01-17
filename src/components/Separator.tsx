import { FC } from "react";

interface SeparatorProps {
  margins?: boolean;
}
const Separator: FC<SeparatorProps> = ({ margins = true }) => {
  return (
    <div
      className={`h-[0.5px] ${
        margins ?"my-2" : ""
      } w-full bg-[#ffffff21]`}
    />
  );
};

export default Separator;
