import { FC, useState } from "react";
import Switch from "react-switch";
import { DropdownMenu } from "@radix-ui/themes";
import Button from "./Button";
import { MenuIcon } from "../../../assets";
import { Modal } from "../../modals";
import { PlayerSettings, MediaInfo } from "../blocks";
import { usePlayer } from "../../../hooks";
import { useAppSelector } from "../../../hooks";
import { useDispatch } from "react-redux";
import { settingsActions } from "../../../store";

const MenuButton: FC = () => {
  const dispatch = useDispatch();
  const { primaryColor, isLoop, shortcutsEnabled } = useAppSelector(
    (state) => state.settings
  );

  const { isPiP } = useAppSelector((state) => state.player);
  const {
    handleAddControllerDependencies,
    handleRemoveControllerDependencies,
    handleTogglePiP,
  } = usePlayer();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [mediaInfoModalOpen, setMediaInfoModalOpen] = useState(false);

  const handleLoopToggle = () => {
    dispatch(settingsActions.toggleLoop());
  };
  const handleShortcutsToggle = () => {
    dispatch(settingsActions.toggleShortcuts());
  };

  const handleSettingsOpen = () => {
    setSettingsModalOpen(true);
    handleAddControllerDependencies("settings");
  };
  const handleSettingsClose = () => {
    setSettingsModalOpen(false);
    handleRemoveControllerDependencies("settings");
  };
  const handleMediaInfoOpen = () => {
    setMediaInfoModalOpen(true);
    handleAddControllerDependencies("media-info");
  };
  const handleMediaInfoClose = () => {
    setMediaInfoModalOpen(false);
    handleRemoveControllerDependencies("media-info");
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <div>
            <Button>
              <div className="absolute text-[24px] left-0 right-0 top-0 bottom-0 h-max w-max m-auto">
                <MenuIcon />
              </div>
            </Button>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          style={{
            minWidth: 250,
          }}
        >
          <DropdownMenu.Item
            onSelect={(event) => {
              event.preventDefault();
              handleLoopToggle();
            }}
          >
            <p>Loop Video</p>
            <Switch
              onChange={handleLoopToggle}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor={primaryColor}
              height={23}
              width={46}
              handleDiameter={18}
              checked={isLoop}
              className="pointer-events-none react-switch"
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={(event) => {
              event.preventDefault();
              handleShortcutsToggle();
            }}
          >
            <p>Enable Shortcuts</p>
            <Switch
              onChange={handleShortcutsToggle}
              checked={shortcutsEnabled}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor={primaryColor}
              height={23}
              width={46}
              handleDiameter={18}
              className="pointer-events-none react-switch"
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={(event) => {
              event.preventDefault();
              handleTogglePiP();
            }}
          >
            <p>Picture in Picture</p>

            <Switch
              onChange={handleTogglePiP}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor={primaryColor}
              height={23}
              width={46}
              handleDiameter={18}
              checked={isPiP}
              className="pointer-events-none react-switch"
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleSettingsOpen}>
            <p>More Settings</p>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <p>Keyboard Shortcuts</p>
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleMediaInfoOpen}>
            <p>Media Info</p>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Modal
        isOpen={settingsModalOpen}
        onClose={handleSettingsClose}
        style={{
          box: { maxWidth: "1000px" },
          content: {
            width: "100%",
            overflow: "hidden",
            height: "max-content",
            minHeight: "100px",
            maxHeight: "100vh",
            paddingLeft: "0px",
            paddingRight: "0px",
          },
        }}
        title="Player Settings"
      >
        <PlayerSettings />
      </Modal>
      <Modal
        isOpen={mediaInfoModalOpen}
        onClose={handleMediaInfoClose}
        style={{
          box: { maxWidth: "500px" },
          content: { minHeight: "100px" },
        }}
        title="Media Info"
      >
        <MediaInfo />
      </Modal>
    </>
  );
};

export default MenuButton;
