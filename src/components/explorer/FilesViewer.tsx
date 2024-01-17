import { FC, useEffect, useState } from "react";
import { BackIcon, FileIcon, FolderIcon } from "../../assets";
import { DirChain } from ".";
import { useNavigate } from "react-router-dom";
import { ActivityIndicator } from "../spins";
import DirCard from "./Dirs/DirCard";
import { useHotkeys } from "react-hotkeys-hook";

const path = window.require("path");
const fs = window.require("fs");
const os = window.require("os");

const FilesViewer: FC = () => {
  const navigate = useNavigate();

  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [currentDir, setCurrentDir] = useState<string>(
    localStorage.getItem("last-dir") || os.homedir()
  );
  const [dirsChain, setDirsChain] = useState<string[]>([]);
  const [dirs, setDirs] = useState([]);

  useEffect(() => {
    document.title = `Sif Player | ${currentDir}`;
  }, [currentDir]);

  const fetchFiles = async (dir?: string) => {
    dir = path.join(dir || currentDir);
    setIsLoadingFiles(true);
    const dirents = await fs.promises.readdir(currentDir, {
      withFileTypes: true,
    });

    const videoFormats = ["mp4", "ogg", "mkv", "webm"];
    const dirs_files: any[] = [];

    for (const dirent of dirents) {
      const res = path.resolve(currentDir, dirent.name);

      try {
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
      } catch (error) {
        continue;
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

    setDirsChain(chain.reverse());

    setDirs(dirs_files);
    setIsLoadingFiles(false);
  };

  useEffect(() => {
    fetchFiles(currentDir);
  }, [currentDir]);

  const handleNavigate = (dir: string) => {
    setCurrentDir(dir);
    localStorage.setItem("last-dir", dir);
  };

  const handleBack = () => {
    const baseDir = path.dirname(currentDir);
    handleNavigate(baseDir);
  };

  const handleDelete = (dir) => {
    fs.rmSync(dir.path, { recursive: true, force: true });
    fetchFiles();
  };

  useHotkeys("backspace", handleBack, { keyup: true });
  useHotkeys("f5", () => fetchFiles(), { keyup: true });
  
  return (
    <div className="h-full w-full overflow-y-auto min-scrollbar">
      <div className="py-3 px-3 flex items-center">
        {path.dirname(currentDir) !== currentDir && (
          <button
            onClick={handleBack}
            className="bg-[#ffffff16] flex items-center px-1.5 py-1.5 text-[20px] rounded-md"
          >
            <BackIcon />
          </button>
        )}
        <DirChain
          dirsChain={dirsChain}
          onClick={(_, index) => {
            let newPath = path.join(...dirsChain.slice(0, index + 1));
            handleNavigate(newPath);
          }}
        />
      </div>
      <div className="mt-1 w-full h-max flex">
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
                    onClick={() => {
                      if (dir.dir) {
                        handleNavigate(dir.path);
                      } else {
                        navigate(`/player?src=${dir.path}&type=file`);
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
  );
};

export default FilesViewer;
