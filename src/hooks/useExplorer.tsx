import { explorerActions, playerActions } from "../store";
import { useDispatch } from "react-redux";
import { useAppSelector } from ".";
import {
  extractVideos,
  getDirInformation,
  sortFiles,
  path,
  fs,
} from "../utils";
import { useNavigate } from "react-router-dom";
import { Dir } from "../types";

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

    let newDirs: Dir[] = [];

    for (const dirent of dirents) {
      try {
        const file = await getDirInformation(
          path.resolve(currentDir, dirent.name)
        );
        newDirs.push(file);
      } catch (error) {
        continue;
      }
    }

    newDirs = sortFiles(newDirs);

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

    dispatch(explorerActions.updateDirs(newDirs));

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
