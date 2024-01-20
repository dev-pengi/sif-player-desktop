import { FC } from "react";
import { Separator, SettingCol, SettingInput, SettingSwitch } from "..";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../hooks";
import { settingsActions } from "../../../../../store";

const Preferences: FC = () => {
  const dispatch = useDispatch();
  const {
    saveTrack,
    saveAdjustments,
    playInBackground,
    normalSkipStep,
    doubleSkipStep,
    volumeStep,
    doubleVolumeStep,
    skipButtons,
  } = useAppSelector((state) => state.settings);

  const handleSaveTrackToggle = () => {
    dispatch(settingsActions.toggleSaveTrack());
  };

  const handleSaveAdjustmentsToggle = () => {
    dispatch(settingsActions.toggleSaveAdjustments());
  };

  const handleTogglePlayInBackground = () => {
    dispatch(settingsActions.togglePlayInBackground());
  };
  const handleToggleSkipButtons = () => {
    dispatch(settingsActions.toggleSkipButtons());
  };
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
      <Separator />
      <SettingCol
        title="Enable skip buttons"
        description="show buttons to skip to the next or previous video of the playlist or the folder you're in"
      >
        <SettingSwitch
          onChange={handleToggleSkipButtons}
          checked={skipButtons}
        />
      </SettingCol>
      <Separator />
      <SettingCol
        title="Save track"
        description="save the current track by filename when the player is closed"
      >
        <SettingSwitch onChange={handleSaveTrackToggle} checked={saveTrack} />
      </SettingCol>
      <SettingCol
        title="Save Adjustments"
        description="save the current adjustments (volume, playback rate, etc) when the player is closed"
      >
        <SettingSwitch
          onChange={handleSaveAdjustmentsToggle}
          checked={saveAdjustments}
        />
      </SettingCol>
      <Separator />
      <SettingCol
        title="Play In Background"
        description="keep playing the media when you leave the application"
      >
        <SettingSwitch
          onChange={handleTogglePlayInBackground}
          checked={playInBackground}
        />
      </SettingCol>
    </>
  );
};

export default Preferences;
