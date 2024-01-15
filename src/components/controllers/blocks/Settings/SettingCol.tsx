import { FC, HTMLAttributes } from "react";

interface SettingColProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  className?: string;
}

const SettingCol: FC<SettingColProps> = ({
  className,
  title,
  description,
  ...props
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between py-3 ${className}`}
      {...props}
    >
      <div>
        <p className="text-white capitalize">{title}</p>
        {description && (
          <p className="text-white opacity-70 text-[15px] font-light mt-2 mr-3">
            {description}
          </p>
        )}
      </div>
      {props.children}
    </div>
  );
};

export default SettingCol;
