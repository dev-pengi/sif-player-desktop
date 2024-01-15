import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { throttle } from "lodash";
import Slider from "rc-slider";

import { Separator, SettingCol, SettingSelect, SettingSwitch } from "..";
import { useAppSelector } from "../../../../../hooks";
import { settingsActions } from "../../../../../store";
import { settings } from "../../../../../constants";
import { findLabel } from "../../../../../utils";

const Advanced: FC = () => {
  const dispatch = useDispatch();
  const {
    allowAnimations,
    borderShadows,
    darkLayer,
    darkLayerOpacity,
    sleepMode,
    sleepModeDelay,
    sleepModeBehavior,
  } = useAppSelector((state) => state.settings);

  const handleToggleAllowAnimations = () => {
    dispatch(settingsActions.toggleAnimations());
  };
  const handleToggleBorderShadows = () => {
    dispatch(settingsActions.toggleBorderShadows());
  };
  const toggleDarkLayer = () => {
    dispatch(settingsActions.toggleDarkLayer());
  };
  const handleDarkLayerOpacityChange = useCallback(
    throttle((value) => {
      dispatch(settingsActions.updateDarkLayerOpacity(value));
    }, 30),
    []
  );
  const handleToggleSleepMode = () => {
    dispatch(settingsActions.toggleSleepMode());
  };
  const handleUpdateSleepDelay = (value: number) => {
    dispatch(settingsActions.updateSleepModeDelay(value));
  };
  const handleUpdateSleepBehavior = (value: number) => {
    dispatch(settingsActions.updateSleepModeBehavior(value));
  };

  return (
    <>
      <SettingCol
        title="Use animations"
        description="Enabling this setting animates controls, buttons, and modals, providing a more interactive experience. It's recommended to keep this enabled for a better user experience, unless you're experiencing performance issues"
      >
        <SettingSwitch
          onChange={handleToggleAllowAnimations}
          checked={allowAnimations}
        />
      </SettingCol>
      <Separator />
      <SettingCol
        title="Use border shadows"
        description="sets shadows on the top and bottom of the video player, in order to make the controls clear and visible on any background"
      >
        <SettingSwitch
          onChange={handleToggleBorderShadows}
          checked={borderShadows}
        />
      </SettingCol>
      <SettingCol
        title="Use dark layer"
        description="sets a dark opacity layer on the video player, recommended for users who are sensitive to bright colors and effects"
      >
        <SettingSwitch onChange={toggleDarkLayer} checked={darkLayer} />
      </SettingCol>
      {darkLayer && (
        <SettingCol
          title="Dark layer opacity"
          description="set the opacity of the dark layer, in range of 25% to 90%"
        >
          <div className="flex items-center">
            <p className="opacity-70 mR-1">{darkLayerOpacity}%</p>
            <Slider
              step={1}
              value={darkLayerOpacity}
              min={25}
              max={90}
              onChange={handleDarkLayerOpacityChange}
              keyboard={false}
              style={{ width: 60, marginLeft: 15, marginRight: 10 }}
              styles={{
                handle: {
                  border: "none",
                  boxShadow: "none",
                  cursor: "pointer",
                  opacity: 1,
                },
                track: {
                  backgroundColor: "#fff",
                },
                rail: {
                  backgroundColor: "#555",
                },
              }}
            />
          </div>
        </SettingCol>
      )}
      <Separator />
      <SettingCol
        title="Sleep mode"
        description="automatically stop the playback after a certain amount of time of inactivity"
      >
        <SettingSwitch onChange={handleToggleSleepMode} checked={sleepMode} />
      </SettingCol>
      {sleepMode && (
        <>
          <SettingCol
            title="Sleep Delay"
            description="the amount of time to enter sleep mode after inactivity"
          >
            <SettingSelect
              value={findLabel(settings.sleepModeDelay, sleepModeDelay)}
              list={settings.sleepModeDelay}
              onSelect={handleUpdateSleepDelay}
            />
          </SettingCol>
          <SettingCol
            title="Sleep Action"
            description="the action to take when the sleep mode is up"
          >
            <SettingSelect
              value={findLabel(settings.sleepModeBehavior, sleepModeBehavior)}
              list={settings.sleepModeBehavior}
              onSelect={handleUpdateSleepBehavior}
            />
          </SettingCol>
        </>
      )}
    </>
  );
};

export default Advanced;
