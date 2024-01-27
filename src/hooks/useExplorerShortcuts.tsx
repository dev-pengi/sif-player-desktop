import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch } from "react-redux";
import { useExplorer, useAppSelector } from ".";
import { explorerActions } from "../store";
import { extractVideos } from "../utils";

const useExplorerShortcuts = () => {
  const dispatch = useDispatch();
  const { fetchFiles, handlePlaylist, resetSelections } = useExplorer();
  const { dirs, isSearching, keyPressed, selectedDirs } = useAppSelector(
    (state) => state.explorer
  );

  useHotkeys(
    "backspace",
    () => {
      dispatch(explorerActions.back());
    },
    { keyup: true }
  );
  useHotkeys("f5", () => fetchFiles(), { keyup: true });
  useHotkeys(
    "ctrl+p",
    () => {
      if (selectedDirs.length > 0) {
        const dirVids = extractVideos(selectedDirs, true, isSearching);
        handlePlaylist(dirVids);
      } else {
        const dirVids = extractVideos(dirs, true, isSearching);
        handlePlaylist(dirVids);
      }
    },
    { keyup: true }
  );

  useHotkeys("ctrl+a", () => {
    if (selectedDirs.length === dirs.length) {
      resetSelections();
      return;
    }
    dispatch(
      explorerActions.updateSelectedDirs(
        dirs.filter((d) => (isSearching && d.searchValid) || !isSearching)
      )
    );
  });
  useHotkeys("esc", () => {
    resetSelections();
  });

  useHotkeys(
    "ctrl,shift",
    (key) => {
      if (key.key !== keyPressed)
        dispatch(explorerActions.updateKeyPress(key.key));
    },
    { keydown: true }
  );

  useHotkeys(
    "ctrl,shift",
    (key) => {
      if (key.key === keyPressed) dispatch(explorerActions.updateKeyPress(""));
    },
    { keyup: true }
  );
};

export default useExplorerShortcuts;
