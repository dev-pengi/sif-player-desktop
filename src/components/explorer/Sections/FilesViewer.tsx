import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

import { BackIcon } from "../../../assets";
import { DirChain } from "..";
import { ActivityIndicator } from "../../spins";
import { formats } from "../../../constants";
import { explorerActions, playerActions } from "../../../store";
import DirCard from "../Dirs/DirCard";
import { useAppSelector } from "../../../hooks";

const { dialog } = window.require("@electron/remote");
const path = window.require("path");
const fs = window.require("fs");
const os = window.require("os");

const FilesViewer: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentDir, dirs, dirsChain, isLoadingFiles } = useAppSelector(
    (state) => state.explorer
  );

  useEffect(() => {
    document.title = `Sif Player | ${path.basename(currentDir)}`;
  }, [currentDir]);

  const fetchFiles = async (dir?: string) => {
    dir = path.join(dir || currentDir);
    dispatch(explorerActions.loading());
    const dirents = await fs.promises.readdir(currentDir, {
      withFileTypes: true,
    });

    const dirs_files: any[] = [];

    for (const dirent of dirents) {
      const res = path.resolve(currentDir, dirent.name);
      try {
        const dirStat = await fs.promises.stat(res);

        if (dirent.isDirectory() && !dirent.name.startsWith(".")) {
          const nestedDirents = await fs.promises.readdir(res, {
            withFileTypes: true,
          });
          dirs_files.push({
            name: dirent.name,
            dir: true,
            path: res,
            parent: currentDir,
            creationDate: dirStat.birthtimeMs,
            searchValid: false,
            videos: nestedDirents
              ?.filter((nestedDir) => {
                const ext = path.extname(nestedDir.name).slice(1);
                return (
                  !nestedDir.isDirectory() &&
                  !nestedDir.name.startsWith(".") &&
                  formats.includes(ext)
                );
              })
              .map((nestedDir) => {
                const nestedDirPath = path.resolve(res, nestedDir.name);
                return nestedDirPath;
              }),
            nestedDirs: nestedDirents
              ?.filter((nestedDir) => {
                return (
                  nestedDir.isDirectory() && !nestedDir.name.startsWith(".")
                );
              })
              .map((nestedDir) => {
                const dirPath = path.resolve(res, nestedDir.name);
                return dirPath;
              }),
          });
        } else {
          const ext = path.extname(dirent.name).slice(1);
          if (formats.includes(ext)) {
            dirs_files.push({
              name: dirent.name,
              dir: false,
              type: ext,
              path: res,
              parent: currentDir,
              creationDate: dirStat.birthtimeMs,
              searchValid: false,
            });
          }
        }
      } catch (error) {
        continue;
      }
    }

    dirs_files.sort((a, b) => {
      if (a.dir !== b.dir) {
        return a.dir ? -1 : 1;
      }

      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });

    const chain: string[] = [];
    let isFinished = false;
    let currentChainDir = currentDir;

    while (!isFinished) {
      const baseName = path.basename(currentChainDir);
      if (baseName) {
        chain.push(path.basename(currentChainDir));
        currentChainDir = path.dirname(currentChainDir);
      } else {
        const root = path.parse(currentChainDir).root;
        chain.push(root);
        isFinished = true;
      }
    }

    dispatch(explorerActions.updateDirsChain(chain.reverse()));

    dispatch(explorerActions.updateDirs(dirs_files));

    dispatch(explorerActions.loaded());
  };

  useEffect(() => {
    fetchFiles(currentDir);
  }, [currentDir]);

  const handleNavigate = (dir: string) => {
    dispatch(explorerActions.updateCurrentDir(dir));
    localStorage.setItem("last-dir", dir);
  };

  const handleBack = () => {
    dispatch(explorerActions.back());
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

  useHotkeys("backspace", handleBack, { keyup: true });
  useHotkeys("f5", () => fetchFiles(), { keyup: true });

  return (
    <div className="w-full h-full px-1.5 py-3">
      <div className="h-full w-full overflow-y-auto min-scrollbar">
        <div className="px-3 flex items-center">
          <DirChain
            dirsChain={dirsChain}
            onClick={(_, index) => {
              let newPath = path.join(...dirsChain.slice(0, index + 1));
              handleNavigate(newPath);
            }}
          />
        </div>
        <div className="mt-4 w-full h-max flex">
          {isLoadingFiles ? (
            <div className="flex items-center justify-center mt-[120px] w-full">
              <ActivityIndicator />
            </div>
          ) : (
            <>
              {dirs.length === 0 ? (
                <div className="flex items-center justify-center mt-[120px] w-full">
                  <p className="text-white/50">No videos found</p>
                </div>
              ) : (
                <div className="w-full grid grid-cols-dir gap-3 px-3">
                  {dirs.map((dir) => (
                    <DirCard
                      key={dir.path}
                      dir={dir}
                      onClick={(type: string = "playlist") => {
                        if (dir.dir) {
                          handleNavigate(dir.path);
                        } else {
                          if (type === "single") {
                            dispatch(playerActions.updatePlaylist([dir.path]));
                            dispatch(playerActions.updateVideoIndex(0));
                          } else if (type === "playlist") {
                            const allVideos =
                              dirs
                                .filter((d) => !d.dir)
                                ?.map((video) => video.path) ?? [];

                            const clickedVideoIndex = allVideos.findIndex(
                              (video) => video === dir.path
                            );

                            dispatch(playerActions.updatePlaylist(allVideos));
                            dispatch(
                              playerActions.updateVideoIndex(clickedVideoIndex)
                            );
                          }
                          navigate(`/player?type=file`);
                        }
                      }}
                      handleDelete={() => handleDelete(dir)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesViewer;
