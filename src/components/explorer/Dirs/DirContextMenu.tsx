import { ContextMenu } from "@radix-ui/themes";
import React, { FC, ReactNode, useState } from "react";
import { useAppSelector } from "../../../hooks";
import { copyText, formatBytes, formatDate, videoType } from "../../../utils";
import { explorerActions, playerActions } from "../../../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../modals";
import { Separator } from "../..";
import { ActivityIndicator } from "../../spins";

const { dialog } = window.require("@electron/remote") as typeof import('@electron/remote');
const { shell } = window.require("electron") as typeof import('electron');
const path = window.require("path") as typeof import('path');
const fs = window.require("fs");

interface DirContextMenuProps {
  dir: any;
  children: ReactNode;
  loading?: boolean;
  innerMenu?: boolean;
}

const DirContextMenu: FC<DirContextMenuProps> = ({
  dir,
  children,
  innerMenu,
  loading,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { copyFiles, cutFiles, dirs } = useAppSelector(
    (state) => state.explorer
  );
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  if (loading)
    return (
      <>
        <ContextMenu.Root>
          <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
          <ContextMenu.Content
            style={{
              minWidth: 220,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <ActivityIndicator />
            </div>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </>
    );

  const copyPath = () => {
    copyText(dir.path);
  };

  const copyName = () => {
    copyText(dir.name);
  };

  const copyFile = () => {
    dispatch(explorerActions.copyFiles([dir.path]));
  };

  const pathInfo = fs.statSync(dir?.path);

  const creationTime = formatDate(pathInfo.birthtime);
  const lastModified = formatDate(pathInfo.mtime);
  const lastAccessed = formatDate(pathInfo.atime);

  const dirSize = pathInfo.size;
  const mediaType = `video/${path.parse(dir.path).ext.slice(1)}`;
  const dirType = dir.dir ? "Folder" : videoType(mediaType);
  const dirName = dir.name;

  const pasteFiles = async () => {
    const filePasted = [];
    if (copyFiles.length > 0) {
      dispatch(explorerActions.updateCurrentDir(dir.path));
      for (const file of copyFiles) {
        let fileName = path.basename(file);
        let newPath = path.join(dir.path, fileName);
        const findPath = await fs.promises.stat(newPath).catch((e) => {
          return;
        });
        const fileExists = Boolean(findPath);
        if (fileExists) {
          dialog
            .showMessageBox({
              type: "info",
              title: "Sif Player",
              message: `A file with the name of: ${fileName} already exists in the path: ${dir.path}`,
              buttons: ["replace", "cancel"],
              noLink: true,
            })
            .then(async (res: any) => {
              if (res.response === 0) {
                await fs.promises.copyFile(file, newPath);
              }
            });
        } else await fs.promises.copyFile(file, newPath);
      }
    } else if (cutFiles.length > 0) {
      dispatch(explorerActions.updateCurrentDir(dir.path));
      for (const file of cutFiles) {
        const fileName = path.basename(file);
        const newPath = path.join(dir.path, fileName);
        await fs.promises.rename(file, newPath);
      }
    }

    dispatch(explorerActions.pasteFiles(filePasted));
  };

  const cutFile = () => {
    dispatch(explorerActions.cutFiles([dir.path]));
  };

  const handleRevealInExplorer = () => {
    shell.showItemInFolder(dir.path);
  };
  const handleDelete = async (dir) => {
    try {
      if (dir.dir) {
        await fs.promises.rmdir(dir.path, { recursive: true, force: true });
      } else {
        await fs.promises.unlink(dir.path);
      }
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
          <div className="flex items-start py-2" title={`Name: ${dirName}`}>
            <h3 className="opacity-95">Name:</h3>
            <p className="ml-6 opacity-80 max-w-[90%] truncate">{dirName}</p>
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

export default DirContextMenu;
