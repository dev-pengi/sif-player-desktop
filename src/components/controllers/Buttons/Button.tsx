import { FC, ReactNode } from "react";
import { useAppSelector } from "../../../hooks";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const { allowAnimations } = useAppSelector((state) => state.settings);
  return (
    <button
      onKeyDown={(e) => e.preventDefault()}
      className={`relative p-4 w-max rounded-md ${
        allowAnimations ? "duration-100" : ""
      } hover:bg-[#ffffff21] hover:shadow-md ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer opacity-100"
      } ${className} `}
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
