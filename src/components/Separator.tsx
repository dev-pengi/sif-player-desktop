import { FC } from "react";

interface SeparatorProps {
  margins?: boolean;
  separateBy?: number;
}
const Separator: FC<SeparatorProps> = ({ margins = true, separateBy = 8 }) => {
  if (!margins) separateBy = 0;
  return (
    <div
      className={`h-[0.5px] w-full bg-[#ffffff21]`}
      style={{
        marginTop: `${separateBy}px`,
        marginBottom: `${separateBy}px`,
      }}
    />
  );
};

export default Separator;
