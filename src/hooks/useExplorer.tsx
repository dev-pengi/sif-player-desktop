import { explorerActions, playerActions } from "../store";
import { useDispatch } from "react-redux";
import { useAppSelector } from ".";
import { extractVideos, getDirInformation } from "../utils";
import { useNavigate } from "react-router-dom";

const path = window.require("path") as typeof import("path");
const fs = window.require("fs") as typeof import("fs");

const useExplorer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDir, dirs, isSearching } = useAppSelector(
    (state) => state.explorer
  );

  const handleDragSelectDirs = (ds: any, dirCardRefs: any) => {
    const selectedIndexes = ds
      .getSelection()
      .map((el) => dirCardRefs.current.findIndex((ref) => ref.current === el));

    dispatch(
      explorerActions.updateSelectedDirs(
        selectedIndexes.map((index: number) => dirs[index])
      )
    );
  };

  const fetchFiles = async (dir: string = currentDir) => {
    dir = path.join(dir);
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

  const resetSelections = () => {
    dispatch(explorerActions.updateSelectedDirs([]));
  };

  const handlePlaylist = (videos: string[], indexPath?: string) => {
    if (!videos.length) return;
    let index = videos.findIndex((video) => video === indexPath);
    if (!index || index < 0 || index > videos.length - 1) index = 0;
    dispatch(playerActions.updatePlaylist(videos));
    dispatch(playerActions.updateVideoIndex(index));
    navigate("/player?type=file");
  };
  const handleNavigate = (dir: string) => {
    dispatch(explorerActions.updateCurrentDir(dir));
  };

  const handleDirNavigate = (dir: any, type: string = "playlist") => {
    if (dir.dir) {
      handleNavigate(dir.path);
    } else {
      if (type === "single") {
        handlePlaylist([dir.path]);
      } else if (type === "playlist") {
        const dirVids = extractVideos(dirs, true, isSearching);
        handlePlaylist(dirVids, dir.path);
      }
      navigate(`/player?type=file`);
    }
  };

  return {
    fetchFiles,
    handlePlaylist,
    handleDragSelectDirs,
    resetSelections,
    handleNavigate,
    handleDirNavigate,
  };
};

export default useExplorer;
