import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ContextMenu, HoverCard } from "@radix-ui/themes";

import { Separator } from "../..";
import { FileIcon, FolderIcon } from "../../../assets";
import { Modal } from "../../modals";
import { formatBytes, formatDate, videoType } from "../../../utils";
import { playerActions } from "../../../store";

import thumbnailPlaceholder from "../../../static/thumbnail-placeholder.png";
import { useAppSelector } from "../../../hooks";
import DirContextMenu from "./DirContextMenu";

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
}

const DirCard: FC<DirCardProps> = ({ onClick, dir }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const pathInfo = fs.statSync(dir.path);

  const creationTime = formatDate(pathInfo.birthtime);
  const lastModified = formatDate(pathInfo.mtime);
  const lastAccessed = formatDate(pathInfo.atime);
  const { isSearching } = useAppSelector((state) => state.explorer);
  const dirSize = pathInfo.size;

  const mediaType = `video/${path.parse(dir.path).ext.slice(1)}`;
  const dirType = dir.dir ? "Folder" : videoType(mediaType);
  const dirName = dir.name;

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
                  title={`${dir.path} - ${dir.name}`}
                  className="mt-0 text-center max-w-[90%] truncate break-words text-[14px]"
                >
                  {dir.name}
                </p>
              </div>
            </ContextMenu.Trigger>
            <DirContextMenu dir={dir} />
          </ContextMenu.Root>
        </>
      )}
    </>
  );
};

export default DirCard;
