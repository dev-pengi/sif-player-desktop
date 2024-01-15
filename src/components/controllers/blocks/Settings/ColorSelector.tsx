import { FC } from "react";

interface ColorSelectorProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}

const ColorSelector: FC<ColorSelectorProps> = ({
  color,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(color)}
      style={{
        backgroundColor: color,
      }}
      className={`w-[24px] h-[24px] cursor-pointer duration-100 rounded-full ${
        isSelected ? "scale-[1.3]" : "hover:scale-[1.15]"
      }`}
    />
  );
};

export default ColorSelector;
