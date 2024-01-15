import { FC, useEffect, useState } from "react";
import {
  BackIcon,
  CloseIcon,
  DashIcon,
  FileIcon,
  FolderIcon,
  WindowMaximizeIcon,
} from "../assets";
import { useNavigate } from "react-router-dom";
import { ActivityIndicator } from "../components/spins";
import { useClean } from "../hooks";
const { ipcRenderer } = window.require("electron");
const path = window.require("path");
const fs = window.require("fs");
const os = window.require("os");

const MainPage: FC = () => {
  const navigate = useNavigate();
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [currentDir, setCurrentDir] = useState<string>(os.homedir());
  const [dirsChain, setDirsChain] = useState<string[]>(
    currentDir.split(path.sep)
  );
  const [dirs, setDirs] = useState([]);

  useEffect(() => {
    document.title = `Sif Player | Web Player`;
  }, []);

  useClean();

  const handleClose = () => {
    ipcRenderer.send("close");
  };
  const handleMaximizeToggle = () => {
    ipcRenderer.send("maximize");
  };
  const handleMinimize = () => {
    ipcRenderer.send("minimize");
  };

  const fetchFiles = async (dir?: string) => {
    dir = dir || currentDir;
    setIsLoadingFiles(true);
    const dirents = await fs.promises.readdir(currentDir, {
      withFileTypes: true,
    });

    const videoFormats = ["mp4", "ogg", "mkv", "webm"];
    const dirs_files: any[] = [];

    for (const dirent of dirents) {
      const res = path.resolve(currentDir, dirent.name);
      const dirStat = await fs.promises.stat(res);

      if (dirent.isDirectory() && !dirent.name.startsWith(".")) {
        dirs_files.push({
          name: dirent.name,
          dir: true,
          path: res,
          parent: currentDir,
          creationDate: dirStat.birthtime,
        });
      } else {
        const ext = path.extname(dirent.name).slice(1);
        if (videoFormats.includes(ext)) {
          dirs_files.push({
            name: dirent.name,
            dir: false,
            type: ext,
            path: res,
            parent: currentDir,
            creationDate: dirStat.birthtime,
          });
        }
      }
    }

    dirs_files.sort((a, b) => {
      if (a.dir !== b.dir) {
        return a.dir ? -1 : 1;
      }

      const dateA = new Date(a.creationDate);
      const dateB = new Date(b.creationDate);

      return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
    });

    const splitDirs = currentDir.split(path.sep);
    setDirsChain(splitDirs);

    setDirs(dirs_files);
    setIsLoadingFiles(false);
  };

  useEffect(() => {
    fetchFiles(currentDir);
    console.log(currentDir);
  }, [currentDir]);

  const handleBack = () => {
    const splitDirs = currentDir.split(path.sep);
    splitDirs.pop();
    const newDir = path.join(...splitDirs);
    setCurrentDir(newDir);
  };

  return (
    <div className="h-screen">
      <nav
        className="flex w-full items-center h-[35px] fixed drag"
        style={{
          borderBottom: `2px solid #ffffff21`,
        }}
      >
        <div className="flex flex-1">
          <p className="ml-3 font-bold text-[13px] opacity-60 tracking-wide">
            Sif Player
          </p>
        </div>
        <div className="flex flex-row-reverse h-full items-center no-drag">
          <button
            onClick={handleClose}
            className="px-3 h-full duration-100 text-[18px] hover:bg-red-500"
          >
            <CloseIcon />
          </button>
          <button
            onClick={handleMaximizeToggle}
            className="px-3 h-full duration-100 text-[14px] hover:bg-[#ffffff21]"
          >
            <WindowMaximizeIcon />
          </button>
          <button
            onClick={handleMinimize}
            className="px-3 h-full duration-100  hover:bg-[#ffffff21]"
          >
            <DashIcon />
          </button>
        </div>
      </nav>
      <div className="flex w-full h-[calc(100%-35px)] fixed top-[35px]">
        <div className="h-full w-full overflow-y-scroll">
          <div className="py-3 px-3 flex items-center">
            <button
              onClick={handleBack}
              className="bg-[#ffffff16] flex items-center px-1.5 py-1.5 text-[20px] rounded-md"
            >
              <BackIcon />
            </button>
            <div className="flex items-center ml-3 gap-0.5">
              {dirsChain.map((dir, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentDir(path.join(...dirsChain.slice(0, index + 1)));
                  }}
                  className="flex items-center text-[15px] rounded-md cursor-pointer"
                >
                  {dir} /
                </div>
              ))}
            </div>
          </div>
          <div className="mt-1 w-full h-max flex">
            {isLoadingFiles ? (
              <div className="flex items-center justify-center  mt-[120px] w-full">
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
                      <div
                        key={dir.path}
                        onClick={() => {
                          if (dir.dir) {
                            setCurrentDir(dir.path);
                          } else {
                            navigate(`/player?src=${dir.path}&type=file`);
                          }
                        }}
                        className="flex items-center justify-start px-3 gap-3 cursor-pointer hover:bg-[#ffffff21] rounded-md py-2 "
                      >
                        {dir.dir ? (
                          <i className="text-[30px]">
                            <FolderIcon />
                          </i>
                        ) : (
                          <i className="text-[26px]">
                            <FileIcon />
                          </i>
                        )}
                        <p
                          aria-label={dir.name}
                          title={dir.name}
                          className="mt-0 text-center max-w-[90%] truncate break-words text-[14px]"
                        >
                          {dir.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
