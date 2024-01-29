import { ContextMenu } from "@radix-ui/themes";
import { FC, ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks";
import {
  copyText,
  formatBytes,
  formatDate,
  videoType,
  serializeName,
  nativeDialog,
  getDirInformation,
} from "../../../../utils";
import { explorerActions, playerActions } from "../../../../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../modals";
import { Separator } from "../../..";
import { ActivityIndicator } from "../../../spins";
import { Dir } from "../../../../types";

import { electron, path, fs } from "../../../../utils/node.util";
const { shell, dialog } = electron;

interface SingleDirContextMenuProps {
  dir: Dir;
  children: ReactNode;
  loading?: boolean;
  innerMenu?: boolean;
}

const SingleDirContextMenu: FC<SingleDirContextMenuProps> = ({
  dir,
  children,
  innerMenu,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { copyFiles, dirs, currentDir } = useAppSelector(
    (state) => state.explorer
  );
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);

  const copyPath = () => {
    copyText(dir.path);
  };

  const copyName = () => {
    copyText(dir.name);
  };

  const copyFile = () => {
    dispatch(
      explorerActions.copyFiles([
        {
          path: dir.path,
          move: false,
        },
      ])
    );
  };

  const [creationTime, setCreationTime] = useState("");
  const [lastModified, setLastModified] = useState("");
  const [lastAccessed, setLastAccessed] = useState("");
  const [dirSize, setDirSize] = useState(0);
  const [dirType, setDirType] = useState("");

  const handlePathInfo = async () => {
    const pathInfo = await fs.promises.stat(dir.path).catch((e) => {
      return;
    });
    if (!pathInfo) return null;

    setCreationTime(formatDate(pathInfo.birthtimeMs));
    setLastModified(formatDate(pathInfo.mtimeMs));
    setLastAccessed(formatDate(pathInfo.atimeMs));
    setDirSize(pathInfo.size);

    const mediaType = `video/${path.parse(dir.path).ext.slice(1)}`;
    setDirType(dir.dir ? "Folder" : videoType(mediaType));
  };

  useEffect(() => {
    handlePathInfo();
  }, [dir.path]);

  const handlePasteProcess = async (
    oldPath: string,
    newPath: string,
    isDir: boolean,
    isMoved: boolean
  ) => {
    try {
      if (isMoved) {
        await fs.promises.rename(oldPath, newPath);
      } else {
        if (isDir) await fs.promises.cp(oldPath, newPath, { recursive: true });
        else await fs.promises.copyFile(oldPath, newPath);
      }
    } catch (error) {
      dialog.showMessageBox({
        type: "error",
        title: "Sif Player",
        message: `Failed to paste (${path.basename(oldPath)})`,
        detail: error.message,
        noLink: true,
      });
    }

    try {
      const file = await getDirInformation(newPath);
      if (currentDir === path.dirname(newPath))
        dispatch(explorerActions.addDir(file));

      if (isMoved && dirs.map((d) => d.path).includes(oldPath)) {
        dispatch(explorerActions.removeDir(oldPath));
      }
    } catch (error) {
      console.error(error);
    }
    dispatch(explorerActions.pasteEnd([oldPath]));
  };

  const checkFileExists = async (path: string): Promise<boolean> => {
    const findPath = await fs.promises.stat(path).catch((e) => {
      return false;
    });
    return Boolean(findPath);
  };

  const pasteFiles = async () => {
    let isThereAnExistingFile = false;
    let filesList = [...copyFiles];
    dispatch(explorerActions.resetCopyFiles());

    for (let file of filesList) {
      const fileName = path.basename(file.path);
      const newPath = path.join(dir.path, fileName);
      const fileExists = await checkFileExists(newPath);
      if (fileExists) {
        isThereAnExistingFile = true;
        break;
      }
    }

    let behavior = isThereAnExistingFile ? "rename" : "default";

    if (isThereAnExistingFile) {
      const dialogText =
        filesList.length > 1
          ? "some of the files do already exist in the destination folder, what do you want to do?"
          : "the file already exists in the destination folder, what do you want to do?";

      const buttons =
        filesList.length > 1
          ? ["Replace all", "Rename all", "Cancel"]
          : ["Replace", "Rename", "Cancel"];
      const response = await nativeDialog(dialogText, {
        type: "info",
        buttons,
      });

      if (response.code === 0) {
        behavior = "replace";
      } else if (response.code === 1) {
        behavior = "rename";
      } else {
        return;
      }
    }

    dispatch(explorerActions.pasteFiles(filesList.map((f) => f.path)));
    for (let file of filesList) {
      const fileName = path.basename(file.path);
      const newPath = path.join(dir.path, fileName);
      const fileExists = await checkFileExists(newPath);

      if (fileExists && behavior === "replace") {
        await handlePasteProcess(file.path, newPath, dir.dir, file.move);
      } else if (fileExists && behavior === "rename") {
        let newFileName = serializeName(
          [
            ...dir.videos.map((v: string) => path.basename(v)),
            ...dir.nestedDirs.map((d: string) => path.basename(d)),
          ],
          fileName,
          " - ",
          "Copy (%N%)"
        );
        const newPath = path.join(dir.path, newFileName);
        await handlePasteProcess(file.path, newPath, dir.dir, file.move);
      } else {
        await handlePasteProcess(file.path, newPath, dir.dir, file.move);
      }
    }
  };

  const cutFile = () => {
    dispatch(
      explorerActions.copyFiles([
        {
          path: dir.path,
          move: true,
        },
      ])
    );
  };

  const handleRevealInExplorer = () => {
    shell.showItemInFolder(dir.path);
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
        message: `Are you sure you want to delete (${dir.name}) permanently?\nThis action cannot be undone.`,
        buttons: ["Delete", "Cancel"],
        noLink: true,
      })
      .then((res) => {
        if (res.response === 0) {
          handleDelete(dir);
        }
      });
  };

  const handleNavigate = (dir: string) => {
    dispatch(explorerActions.updateCurrentDir(dir));
  };

  const handleDirClick = (type = "playlist") => {
    if (dir.dir) {
      handleNavigate(dir.path);
    } else {
      if (type === "single") {
        dispatch(playerActions.updatePlaylist([dir.path]));
        dispatch(playerActions.updateVideoIndex(0));
      } else if (type === "playlist") {
        const allVideos =
          dirs.filter((d) => !d.dir)?.map((video) => video.path) ?? [];

        const clickedVideoIndex = allVideos.findIndex(
          (video) => video === dir.path
        );

        dispatch(playerActions.updatePlaylist(allVideos));
        dispatch(playerActions.updateVideoIndex(clickedVideoIndex));
      }
      navigate(`/player?type=file`);
    }
  };
  const handlePlayFolder = async () => {
    dispatch(playerActions.updatePlaylist(dir.videos));
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
          {!dir ? (
            <div className="w-full h-full flex items-center justify-center">
              <ActivityIndicator />
            </div>
          ) : (
            <>
              {dir.dir && dir.videos.length > 0 && (
                <>
                  <ContextMenu.Item onSelect={handlePlayFolder}>
                    Play folder videos ({dir.videos.length})
                  </ContextMenu.Item>
                  <Separator separateBy={6} height={1} />
                </>
              )}
              {!innerMenu && (
                <ContextMenu.Item onSelect={() => handleDirClick("playlist")}>
                  {dir.dir ? "Open Folder" : "Play Media"}
                </ContextMenu.Item>
              )}
              {!dir.dir && (
                <>
                  <ContextMenu.Item onSelect={() => handleDirClick("single")}>
                    Play as single
                  </ContextMenu.Item>
                  <Separator separateBy={6} height={1} />
                </>
              )}
              <ContextMenu.Item onSelect={handleRevealInExplorer}>
                Reveal in Explorer
              </ContextMenu.Item>
              <Separator separateBy={6} height={1} />

              {!innerMenu && (
                <>
                  <ContextMenu.Item onSelect={copyPath}>
                    Copy Path
                  </ContextMenu.Item>
                  <ContextMenu.Item onSelect={copyName}>
                    Copy Name
                  </ContextMenu.Item>
                </>
              )}

              {!innerMenu && (
                <>
                  <Separator separateBy={6} height={1} />
                  <ContextMenu.Item onSelect={cutFile}>Cut</ContextMenu.Item>
                  <ContextMenu.Item onSelect={copyFile}>Copy</ContextMenu.Item>
                </>
              )}
              {dir.dir && (
                <>
                  <ContextMenu.Item onSelect={pasteFiles}>
                    Paste
                  </ContextMenu.Item>
                </>
              )}
              <Separator separateBy={6} height={1} />
              <ContextMenu.Item onSelect={() => setIsPropertiesModalOpen(true)}>
                Properties
              </ContextMenu.Item>

              {!innerMenu && (
                <>
                  <Separator separateBy={6} height={1} />
                  <ContextMenu.Item color="red" onSelect={handleDeleteDialog}>
                    Delete {dir.dir ? "Folder" : "File"}
                  </ContextMenu.Item>
                </>
              )}
            </>
          )}
        </ContextMenu.Content>
      </ContextMenu.Root>
      <Modal
        isOpen={isPropertiesModalOpen}
        onClose={() => setIsPropertiesModalOpen(false)}
        style={{
          box: { maxWidth: "500px" },
          content: { minHeight: "100px" },
        }}
        title={`${dir.dir ? "Folder" : "Media"} Properties`}
      >
        <>
          <div className="flex items-start py-2" title={`Name: ${dir.name}`}>
            <h3 className="opacity-95">Name:</h3>
            <p className="ml-6 opacity-80 max-w-[90%] truncate">{dir.name}</p>
          </div>
          <div className="flex items-center py-2">
            <h3 className="opacity-95">Type:</h3>
            <p className="ml-6 opacity-80">{dirType}</p>
          </div>
          <Separator />
          <div className="flex items-center py-2" title={`Path: ${dir.path}`}>
            <h3 className="opacity-95">Path:</h3>
            <p className="ml-6 opacity-80 max-w-[90%] truncate">
              {dir.path ?? "Unspecified Path"}
            </p>
          </div>
          {!dir.dir && (
            <>
              <div className="flex items-center py-2">
                <h3 className="opacity-95">Size:</h3>
                <p className="ml-6 opacity-80">
                  {formatBytes(dirSize)} ({dirSize} bytes)
                </p>
              </div>
            </>
          )}
          {dir.dir && (
            <>
              <div className="flex items-center py-2">
                <h3 className="opacity-95">Videos:</h3>
                <p className="ml-6 opacity-80">{dir.videos.length} videos</p>
              </div>
            </>
          )}
          <Separator />

          <div className="flex items-center py-2">
            <h3 className="opacity-95">Created:</h3>
            <p className="ml-6 opacity-80">{creationTime}</p>
          </div>

          <div className="flex items-center py-2">
            <h3 className="opacity-95">Modified:</h3>
            <p className="ml-6 opacity-80">{lastModified}</p>
          </div>

          <div className="flex items-center py-2">
            <h3 className="opacity-95">Accessed:</h3>
            <p className="ml-6 opacity-80">{lastAccessed}</p>
          </div>
        </>
      </Modal>
    </>
  );
};

export default SingleDirContextMenu;
