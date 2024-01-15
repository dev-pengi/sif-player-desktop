import { FC } from "react";
import { Separator, SettingCol } from "..";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../hooks";
import { settingsActions } from "../../../../../store";
import Switch from "react-switch";

const Preferences: FC = () => {
  const dispatch = useDispatch();
  const {
    primaryColor,
    lockShortcuts,
    saveTrack,
    saveAdjustments,
    playInBackground,
    playToggleClick,
  } = useAppSelector((state) => state.settings);

  const handleSaveTrackToggle = () => {
    dispatch(settingsActions.toggleSaveTrack());
  };

  const handleSaveAdjustmentsToggle = () => {
    dispatch(settingsActions.toggleSaveAdjustments());
  };

  const handleLockShortcutsToggle = () => {
    dispatch(settingsActions.toggleLockShortcuts());
  };

  const handleTogglePlayInBackground = () => {
    dispatch(settingsActions.togglePlayInBackground());
  };

  const handleTogglePlayToggleClick = () => {
    dispatch(settingsActions.togglePlayToggleClick());
  };
  return (
    <>
      <SettingCol
        title="Save track"
        description="save the current track by filename when the player is closed"
      >
        <Switch
          onChange={handleSaveTrackToggle}
          checked={saveTrack}
          uncheckedIcon={false}
          checkedIcon={false}
          onColor={primaryColor}
          height={23}
          width={46}
          handleDiameter={18}
          className="react-switch"
        />
      </SettingCol>
      <SettingCol
        title="Save Adjustments"
        description="save the current adjustments (volume, playback rate, etc) when the player is closed"
      >
        <Switch
          onChange={handleSaveAdjustmentsToggle}
          checked={saveAdjustments}
          uncheckedIcon={false}
          checkedIcon={false}
          onColor={primaryColor}
          height={23}
          width={46}
          handleDiameter={18}
          className="react-switch"
        />
      </SettingCol>
      <Separator />
      <SettingCol
        title="Play In Background"
        description="keep playing the media when you leave the tab or the browser"
      >
        <Switch
          onChange={handleTogglePlayInBackground}
          checked={playInBackground}
          uncheckedIcon={false}
          checkedIcon={false}
          onColor={primaryColor}
          height={23}
          width={46}
          handleDiameter={18}
          className="react-switch"
        />
      </SettingCol>

    </>
  );
};

export default Preferences;
