import { ContextMenu } from "@radix-ui/themes";
import { FC, ReactNode } from "react";
import { explorerActions, playerActions } from "../../../../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Separator } from "../../..";
import { Dir } from "../../../../types";

import { electron, fs } from "../../../../utils/node.util";

const { dialog } = electron;

interface MultiDirContextMenuProps {
  selectedDirs: Dir[];
  children: ReactNode;
  loading?: boolean;
  innerMenu?: boolean;
}

const MultiDirContextMenu: FC<MultiDirContextMenuProps> = ({
  selectedDirs,
  children,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const copyFiles = () => {
    dispatch(
      explorerActions.copyFiles(
        selectedDirs.map((dir) => {
          return {
            path: dir?.path,
            move: false,
          };
        })
      )
    );
  };

  const cutFiles = () => {
    dispatch(
      explorerActions.copyFiles(
        selectedDirs.map((dir) => {
          return {
            path: dir?.path,
            move: true,
          };
        })
      )
    );
  };

  const handleDelete = async (dir) => {
    try {
      await fs.promises.rm(dir.path, { recursive: true, force: true });
      dispatch(explorerActions.removeDir(dir.path));
    } catch (error) {
      console.error(error);
      dialog
        .showMessageBox({
          type: "error",
          title: "Sif Player",
          message: `Failed to delete (${dir.name})`,
          buttons: ["retry", "cancel"],
          detail: error.message,
          noLink: true,
        })
        .then((res) => {
          if (res.response === 0) {
            handleDelete(dir);
          }
        });
    }
  };

  const handleDeleteDialog = () => {
    dialog
      .showMessageBox({
        type: "warning",
        title: `Sif Player`,
        message: `Are you sure you want to delete (${selectedDirs.length}) items permanently?\nThis action cannot be undone.`,
        buttons: [`Delete ${selectedDirs.length} items`, "Cancel"],
        noLink: true,
      })
      .then((res) => {
        if (res.response === 0) {
          for (const dir of selectedDirs) {
            handleDelete(dir);
          }
        }
      });
  };

  const playSelectedVideos = () => {
    const allVideos = selectedDirs
      .filter((dir) => !dir.dir)
      .map((dir) => dir.path);
    dispatch(playerActions.updatePlaylist(allVideos));
    dispatch(playerActions.updateVideoIndex(0));
    navigate("/player?type=file");
  };

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
        <ContextMenu.Content
          style={{
            minWidth: 220,
          }}
        >
          <ContextMenu.Item onSelect={playSelectedVideos}>
            Play Selected Media ({selectedDirs.filter((dir) => !dir.dir).length}
            )
          </ContextMenu.Item>
          <Separator separateBy={6} height={1} />
          <ContextMenu.Item onSelect={copyFiles}>
            Copy Selected Files
          </ContextMenu.Item>
          <ContextMenu.Item onSelect={cutFiles}>
            Cut Selected Files
          </ContextMenu.Item>
          <Separator separateBy={6} height={1} />
          <ContextMenu.Item color="red" onSelect={handleDeleteDialog}>
            Delete Selected Files
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </>
  );
};

export default MultiDirContextMenu;
