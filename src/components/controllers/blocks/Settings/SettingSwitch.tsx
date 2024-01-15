import { FC } from "react";
import Switch from "react-switch";
import { useAppSelector } from "../../../../hooks";

interface SettingSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SettingSwitch: FC<SettingSwitchProps> = ({ checked, onChange }) => {
  const { primaryColor } = useAppSelector((state) => state.settings);
  return (
    <>
      <Switch
        onChange={onChange}
        checked={checked}
        onColor={primaryColor}
        uncheckedIcon={false}
        checkedIcon={false}
        height={23}
        width={46}
        handleDiameter={18}
        className="react-switch"
      />
    </>
  );
};

export default SettingSwitch;
