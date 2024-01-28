import React, { FC, useEffect, useRef, useState } from "react";
import DragSelect from "dragselect";

import { DirChain } from "..";
import { ActivityIndicator } from "../../spins";
import DirCard from "../Dirs/DirCard";
import {
  useAppSelector,
  useExplorer,
  useExplorerShortcuts,
} from "../../../hooks";
import DirContextMenu from "../Dirs/DirContextMenu";
import { extractVideos } from "../../../utils";
import { explorerActions } from "../../../store";
import { useDispatch } from "react-redux";

const path = window.require("path") as typeof import("path");

const FilesViewer: FC = () => {
  const dispatch = useDispatch();
  useExplorerShortcuts();

  const [isSelecting, setIsSelecting] = useState(false);

  const { primaryColor } = useAppSelector((state) => state.settings);

  const dirCardRefs = useRef([]);
  const explorerAreaRef = useRef(null);
  const { fetchFiles, handleDragSelectDirs, resetSelections, handleNavigate } =
    useExplorer();

  const {
    currentDir,
    dirs,
    dirsChain,
    isLoadingFiles,
    currentDirData,
    isSearching,
    pastingProcess,
  } = useAppSelector((state) => state.explorer);

  useEffect(() => {
    fetchFiles(currentDir);
    document.title = `Sif Player | ${path.basename(currentDir)}`;
  }, [currentDir]);

  useEffect(() => {
    resetSelections();
    if (!explorerAreaRef?.current) return;
    let ds = new DragSelect({
      area: explorerAreaRef?.current,
      draggability: false,
      selectorClass: "ds-selector",
    });

    try {
      ds.addSelectables(dirCardRefs.current.map((ref) => ref.current));

      ds.subscribe("DS:start", (el) => {
        setIsSelecting(true);
      });
      ds.subscribe("DS:end", (el) => {
        setIsSelecting(false);
        handleDragSelectDirs(ds, dirCardRefs);
      });
    } catch (error) {
      console.error(error);
    }

    return () => {
      ds.stop();
      ds.unsubscribe("DS:end");
    };
  }, [dirs]);

  useEffect(() => {
    console.log(pastingProcess.length);
  }, [pastingProcess]);

  useEffect(() => {
    const dirData = {
      dir: true,
      name: path.basename(currentDir),
      path: currentDir,
      videos: extractVideos(dirs, true, isSearching),
      nestedDirs: dirs.filter((dir) => dir.dir).map((dir) => dir.path),
      searchValid: true,
    };
    dispatch(explorerActions.updateCurrentDirData(dirData));
  }, [currentDir, dirs, isSearching]);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (explorerAreaRef.current && scrollContainerRef.current) {
        explorerAreaRef.current.style.top = `${scrollContainerRef.current.scrollTop}px`;
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      <div className="relative w-full h-full px-1.5 py-3">
        <>
          <div
            className="h-full w-full overflow-y-auto min-scrollbar relative"
            ref={scrollContainerRef}
          >
            <DirContextMenu
              selectedDirs={[currentDirData]}
              loading={!currentDirData}
              innerMenu
            >
              <div>
                <div
                  ref={explorerAreaRef}
                  onMouseDown={(e) => {
                    resetSelections();
                  }}
                  className="min-h-full w-full grid grid-cols-dir gap-3 top-0 left-0 absolute"
                />
              </div>
            </DirContextMenu>
            <div className="w-full px-3 flex items-center justify-between relative">
              <DirChain
                dirsChain={dirsChain}
                onClick={(_, index) => {
                  let newPath = path.join(...dirsChain.slice(0, index + 1));
                  handleNavigate(newPath);
                }}
              />
              {pastingProcess.length > 0 && (
                <div className="flex items-center gap-3 capitalize">
                  <div className="text-[10px]">
                    <ActivityIndicator />
                  </div>
                  <p className="mb-[4px]">pasting {pastingProcess.length} file</p>
                </div>
              )}
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
                      {dirs.map((dir, index) => {
                        if (index === 0) dirCardRefs.current = [];
                        dirCardRefs.current[index] = React.createRef();
                        return (
                          <div
                            key={dir.path}
                            ref={dirCardRefs.current[index]}
                            style={{
                              display:
                                (isSearching && dir.searchValid) || !isSearching
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <DirCard key={dir.path} dir={dir} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      </div>
      {isSelecting && (
        <style>{`
        .ds-selector {
          border: 1px solid ${primaryColor} !important;
          background-color: ${primaryColor}20 !important;
        }
        .ds-selected div {
          background-color: #ffffff21 !important;
        }
      `}</style>
      )}
    </>
  );
};

export default FilesViewer;
