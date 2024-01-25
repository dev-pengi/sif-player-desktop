import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

import { DirChain } from "..";
import { ActivityIndicator } from "../../spins";
import { explorerActions, playerActions } from "../../../store";
import DirCard from "../Dirs/DirCard";
import { useAppSelector } from "../../../hooks";
import { getDirInformation } from "../../../utils";
import { ContextMenu } from "@radix-ui/themes";
import DirContextMenu from "../Dirs/DirContextMenu";
import { FolderIcon } from "../../../assets";

const path = window.require("path") as typeof import('path');;
const fs = window.require("fs") as typeof import('fs');

const FilesViewer: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentDir, dirs, dirsChain, isLoadingFiles, currentDirData } =
    useAppSelector((state) => state.explorer);

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
      try {
        const file = await getDirInformation(
          path.resolve(currentDir, dirent.name)
        );
        dirs_files.push(file);
      } catch (error) {
        continue;
      }
    }

    const dirData = await getDirInformation(currentDir);
    dispatch(explorerActions.updateCurrentDirData(dirData));

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
  };

  const handleBack = () => {
    dispatch(explorerActions.back());
  };

  const handlePlayFolder = async () => {
    dispatch(playerActions.updatePlaylist(currentDirData.videos));
    dispatch(playerActions.updateVideoIndex(0));
    navigate("/player?type=file");
  };

  useHotkeys("backspace", handleBack, { keyup: true });
  useHotkeys("f5", () => fetchFiles(), { keyup: true });
  useHotkeys("ctrl+p", handlePlayFolder, { keyup: true });

  return (
    <div className="relative w-full h-full px-1.5 py-3">
      <>
        <div className="h-full w-full overflow-y-auto min-scrollbar relative">
          <DirContextMenu
            dir={currentDirData}
            loading={!currentDirData}
            innerMenu
          >
            <div>
              <div className="min-h-full w-full grid grid-cols-dir gap-3 top-0 left-0 absolute z-110">
                {dirs.map((dir) => (
                  <>
                    <div key={dir.path} className="opacity-0 pointer-events-none relative flex items-center justify-start px-3 gap-3 cursor-pointer hover:bg-[#ffffff21] rounded-md py-2">
                      <i className="text-[30px]">
                        <FolderIcon />
                      </i>
                      <p
                        title={`${dir.path} - ${dir.name}`}
                        className="mt-0 text-center max-w-[90%] truncate break-words text-[14px]"
                      >
                        {dir.name}
                      </p>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </DirContextMenu>
          <div className="w-max px-3 flex items-center relative">
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
                              dispatch(
                                playerActions.updatePlaylist([dir.path])
                              );
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
                                playerActions.updateVideoIndex(
                                  clickedVideoIndex
                                )
                              );
                            }
                            navigate(`/player?type=file`);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default FilesViewer;
