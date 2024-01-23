import { FC } from "react";

interface ExplorerSectionTabProps {
  isActive: boolean;
  name: string;
  onSelect: () => void;
}

const ExplorerSectionTab: FC<ExplorerSectionTabProps> = ({
  isActive,
  name,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`${
        isActive
          ? "bg-[#ffffff21] text-white"
          : "hover:text-neutral-100 text-neutral-400"
      } text-[15px] duration-100 cursor-pointer w-full px-3 py-1.5 rounded-md`}
    >
      {name}
    </div>
  );
};

export default ExplorerSectionTab;
