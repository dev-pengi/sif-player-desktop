import { FC } from "react";
import { Separator, SettingCol, SettingSwitch } from "..";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../hooks";
import { settingsActions } from "../../../../../store";

const Accessability: FC = () => {
  const dispatch = useDispatch();
  const {
    lockShortcuts,
    fullScreenOnDoubleClick,
    lockGestures,
    gesturesEnabled,
    playToggleClick,
    shortcutsEnabled,
    closeToTray,
  } = useAppSelector((state) => state.settings);

  const handleLockGesturesToggle = () => {
    dispatch(settingsActions.toggleLockGestures());
  };

  const handleLockShortcutsToggle = () => {
    dispatch(settingsActions.toggleLockShortcuts());
  };

  const handleTogglePlayToggleClick = () => {
    dispatch(settingsActions.togglePlayToggleClick());
  };

  const handleToggleFullScreenOnDoubleClick = () => {
    dispatch(settingsActions.toggleFullScreenOnDoubleClick());
  };
  const handleGesturesEnabledToggle = () => {
    dispatch(settingsActions.toggleGestures());
  };
  const handleShortcutsEnabledToggle = () => {
    dispatch(settingsActions.toggleShortcuts());
  };
  const handleCloseToTrayToggle = () => {
    dispatch(settingsActions.toggleCloseToTray());
  };
  return (
    <>
      <SettingCol
        title="Enable Shortcuts"
        description="control the player using keyboard shortcuts"
      >
        <SettingSwitch
          onChange={handleShortcutsEnabledToggle}
          checked={shortcutsEnabled}
        />
      </SettingCol>
      <SettingCol
        title="Lock Shortcuts"
        description="disable shortcuts when the player is on lock mode"
      >
        <SettingSwitch
          onChange={handleLockShortcutsToggle}
          checked={lockShortcuts}
        />
      </SettingCol>
      <Separator />
      <SettingCol
        title="Enable Gestures"
        description="enable gestures to interact with the player (click, double click, etc)"
      >
        <SettingSwitch
          onChange={handleGesturesEnabledToggle}
          checked={gesturesEnabled}
        />
      </SettingCol>
      {gesturesEnabled && (
        <>
          <SettingCol
            title="Lock Gestures"
            description="disable gestures when the player is on lock mode (click, double click, etc)"
          >
            <SettingSwitch
              onChange={handleLockGesturesToggle}
              checked={lockGestures}
            />
          </SettingCol>
          <Separator />
          <SettingCol
            title="Click To Play/Pause"
            description="click anywhere on the screen to toggle the video play/pause"
          >
            <SettingSwitch
              onChange={handleTogglePlayToggleClick}
              checked={playToggleClick}
            />
          </SettingCol>
          <SettingCol
            title="Full screen on double click"
            description="toggle full screen mode when double clicking on the screen"
          >
            <SettingSwitch
              onChange={handleToggleFullScreenOnDoubleClick}
              checked={fullScreenOnDoubleClick}
            />
          </SettingCol>
        </>
      )}
      <Separator />
      <SettingCol
        title="Close to Tray"
        description="minimize the app to the system tray instead of closing it, you can reopen/quit the app from the tray"
      >
        <SettingSwitch
          onChange={handleCloseToTrayToggle}
          checked={closeToTray}
        />
      </SettingCol>
    </>
  );
};

export default Accessability;
