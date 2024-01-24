import { FC } from "react";

interface SeparatorProps {
  margins?: boolean;
  separateBy?: number;
  height?:number
}
const Separator: FC<SeparatorProps> = ({ margins = true, separateBy = 8, height=0.5 }) => {
  if (!margins) separateBy = 0;
  return (
    <div
      className={`w-full bg-[#ffffff21]`}
      style={{
        marginTop: `${separateBy}px`,
        marginBottom: `${separateBy}px`,
        height:`${height}px`
      }}
    />
  );
};

export default Separator;
