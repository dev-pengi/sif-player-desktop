import { FC } from "react";
import { Separator, SettingCol, SettingInput } from "..";
import { settingsActions } from "../../../../../store";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../hooks";

const General: FC = () => {
  const dispatch = useDispatch();
  const { normalSkipStep, doubleSkipStep, volumeStep, doubleVolumeStep } =
    useAppSelector((state) => state.settings);
  return (
    <>
      <SettingCol
        title="Forward/Backward"
        description="the amount of seconds to skip forward/backward"
      >
        <SettingInput
          defaultValue={normalSkipStep}
          onChange={(value) =>
            dispatch(settingsActions.updateNormalSkipStep(value))
          }
        />
      </SettingCol>
      <SettingCol
        title="Double Forward/Backward"
        description="The amount of seconds to skip forward/backward (double)"
      >
        <SettingInput
          defaultValue={doubleSkipStep}
          onChange={(value) =>
            dispatch(settingsActions.updateDoubleSkipStep(value))
          }
        />
      </SettingCol>
      <Separator />
      <SettingCol
        title="Increase/Decrease"
        description="The amount of volume to increase/decrease"
      >
        <SettingInput
          defaultValue={volumeStep}
          onChange={(value) =>
            dispatch(settingsActions.updateVolumeStep(value))
          }
        />
      </SettingCol>
      <SettingCol
        title="Double Increase/Decrease"
        description="The amount of volume to increase/decrease (double)"
      >
        <SettingInput
          defaultValue={doubleVolumeStep}
          onChange={(value) =>
            dispatch(settingsActions.updateDoubleVolumeStep(value))
          }
        />
      </SettingCol>
    </>
  );
};

export default General;
