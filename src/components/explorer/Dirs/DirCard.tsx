import { FC, useState } from "react";
import { FileIcon, FolderIcon } from "../../../assets";
import { ContextMenu, ContextMenuSeparator, HoverCard } from "@radix-ui/themes";
import { Modal } from "../../modals";
import { copyText, formatBytes, formatDate, videoType } from "../../../utils";
import { Separator } from "../..";
import { playerActions } from "../../../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import thumbnailPlaceholder from "../../../static/thumbnail-placeholder.png";
import { useAppSelector } from "../../../hooks";

const { dialog } = window.require("@electron/remote");
const { shell } = window.require("electron");
const fs = window.require("fs");
const path = window.require("path");

const nativeImage = window.require("electron").nativeImage;

interface DirCardProps {
  onClick: (type?: string) => void;
  dir: {
    name: string;
    path: string;
    dir: boolean;
    videos: string[];
    nestedDirs: string[];
    searchValid: boolean;
  };
  handleDelete: () => void;
}

const DirCard: FC<DirCardProps> = ({ onClick, dir, handleDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const pathInfo = fs.statSync(dir.path);

  const creationTime = formatDate(pathInfo.birthtime);
  const lastModified = formatDate(pathInfo.mtime);
  const lastAccessed = formatDate(pathInfo.atime);
  const dirSize = pathInfo.size;

  const mediaType = `video/${path.parse(dir.path).ext.slice(1)}`;
  const dirType = dir.dir ? "Folder" : videoType(mediaType);
  const dirName = dir.name;


  const copyPath = () => {
    copyText(dir.path);
  }

  const copyName = () => {
    copyText(dir.name);
  }

  // const copyFile = () => {
  

  const { isSearching } = useAppSelector((state) => state.explorer);

  const handleRevealInExplorer = () => {
    shell.showItemInFolder(dir.path);
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
          handleDelete();
        }
      });
  };
  const handleThumbnail = async () => {
    if (dir.dir || thumbnail) return;
    try {
      const img = await nativeImage.createThumbnailFromPath(dir.path, {
        width: 256,
        height: 256,
      });
      const buffer = img.toPNG();
      const blob = new Blob([buffer], { type: "image/png" });
      const thumbnailBlob = URL.createObjectURL(blob);
      setThumbnail(thumbnailBlob);
    } catch (err) {
      return;
    }
  };

  const handlePlayFolder = async () => {
    dispatch(playerActions.updatePlaylist(dir.videos));
    dispatch(playerActions.updateVideoIndex(0));
    navigate("/player?type=file");
  };

  return (
    <>
      {((isSearching && dir.searchValid) || !isSearching) && (
        <>
          <ContextMenu.Root>
            <ContextMenu.Trigger>
              <div
                onClick={() => onClick("playlist")}
                className="relative flex items-center justify-start px-3 gap-3 cursor-pointer hover:bg-[#ffffff21] rounded-md py-2"
              >
                {!dir.dir && (
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <div
                        onMouseEnter={() => {
                          handleThumbnail();
                        }}
                        className="absolute top-0 left-0 w-full h-full z-10"
                      />
                    </HoverCard.Trigger>
                    <HoverCard.Content side="top">
                      <div className="flex items-start gap-5">
                        <div className="bg-[#ffffff21] min-w-[160px] min-h-[100px] max-w-[160px] max-h-[100px] rounded-md ">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              className="min-w-[160px] min-h-[100px] max-w-[160px] max-h-[100px] rounded-md object-cover"
                            />
                          ) : (
                            <img
                              src={thumbnailPlaceholder}
                              className="opacity-70 min-w-[160px] min-h-[100px] max-w-[160px] max-h-[100px] rounded-md object-cover"
                            />
                          )}
                        </div>
                        <div className="max-w-[calc(100%-180px)]">
                          <h3 className="text-[14px] break-words font-bold opacity-80 line-clamp-3">
                            {dirName}
                          </h3>

                          <p className="text-[12px] mt-3">{creationTime}</p>
                          <p className="text-[12px]">{dirType}</p>
                          <p className="text-[12px]">{formatBytes(dirSize)}</p>
                        </div>
                      </div>
                    </HoverCard.Content>
                  </HoverCard.Root>
                )}
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
            </ContextMenu.Trigger>
            <ContextMenu.Content
              style={{
                minWidth: 220,
              }}
            >
              {dir.dir && dir.videos.length > 0 && (
                <>
                  <ContextMenu.Item onSelect={handlePlayFolder}>
                    Play folder videos ({dir.videos.length})
                  </ContextMenu.Item>
                  <Separator />
                </>
              )}
              <ContextMenu.Item onSelect={() => onClick("playlist")}>
                {dir.dir ? "Open Folder" : "Play Media"}
              </ContextMenu.Item>
              {!dir.dir && (
                <>
                  <ContextMenu.Item onSelect={() => onClick("single")}>
                    Play as single
                  </ContextMenu.Item>
                  <ContextMenuSeparator />
                </>
              )}
              <ContextMenu.Item onSelect={handleRevealInExplorer}>
                Reveal in Explorer
              </ContextMenu.Item>
              <ContextMenu.Item>Copy Path</ContextMenu.Item>
              <ContextMenuSeparator />
              <ContextMenu.Item>
                Copy {dir.dir ? "Folder" : "File"}
              </ContextMenu.Item>
              <ContextMenu.Item>
                Cut {dir.dir ? "Folder" : "File"}
              </ContextMenu.Item>
              <ContextMenu.Item onSelect={() => setIsPropertiesModalOpen(true)}>
                Properties
              </ContextMenu.Item>
              <ContextMenuSeparator />
              <ContextMenu.Item color="red" onSelect={handleDeleteDialog}>
                Delete {dir.dir ? "Folder" : "File"}
              </ContextMenu.Item>
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
                <p className="ml-6 opacity-80 max-w-[90%] truncate">
                  {dirName}
                </p>
              </div>
              <div className="flex items-center py-2">
                <h3 className="opacity-95">Type:</h3>
                <p className="ml-6 opacity-80">{dirType}</p>
              </div>
              <Separator />
              <div
                className="flex items-center py-2"
                title={`Path: ${dir.path}`}
              >
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
                    <p className="ml-6 opacity-80">
                      {dir.videos.length} videos
                    </p>
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
      )}
    </>
  );
};

export default DirCard;
