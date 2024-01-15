import { FC, useState } from "react";
import { useAppSelector } from "../../../../hooks";
import { motion } from "framer-motion";

interface SettingInputProps {
  defaultValue: string | number;
  onChange: (value: any) => void;
  type?: "number" | "text";
}

const SettingInput: FC<SettingInputProps> = ({
  defaultValue,
  onChange,
  type = "number",
}) => {
  const [isError, setIsError] = useState(false);
  const { primaryColor } = useAppSelector((state) => state.settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const value = Number(e.target.value);
      if (!isNaN(value) && value > 0) {
        setIsError(false);
        onChange(value);
      } else {
        setIsError(true);
      }
    } else {
      const value = e.target.value;
      if (!value?.trim()?.length) {
        onChange(value);
      }
    }
  };
  return (
    <motion.input
      type="text"
      className={`w-[60px] rounded-[2px] px-2 bg-transparent border-[1px] border-solid duration-100 ${
        isError
          ? "text-red-600 border-red-600"
          : "bg-neutral-800 border-neutral-700"
      }`}
      whileHover={{
        borderColor: isError ? "" : primaryColor,
      }}
      whileFocus={{
        borderColor: isError ? "" : primaryColor,
      }}
      transition={{
        duration: 0.1,
      }}
      defaultValue={defaultValue}
      placeholder={String(defaultValue)}
      onChange={handleChange}
    />
  );
};

export default SettingInput;
