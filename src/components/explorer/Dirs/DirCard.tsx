import { FC, useEffect, useState } from "react";
import { HoverCard } from "@radix-ui/themes";

import { FileIcon, FolderIcon } from "../../../assets";
import {
  formatBytes,
  formatDate,
  videoType,
  fs,
  path,
  electron,
} from "../../../utils";

import thumbnailPlaceholder from "../../../static/thumbnail-placeholder.png";
import { useAppSelector, useExplorer } from "../../../hooks";
import DirContextMenu from "./DirContextMenu";
import { Dir } from "../../../types";

const { nativeImage } = electron;

interface DirCardProps {
  dir: Dir;
}

const DirCard: FC<DirCardProps> = ({ dir }) => {
  const { keyPressed, selectedDirs } = useAppSelector(
    (state) => state.explorer
  );
  const { handleDirNavigate, resetSelections } = useExplorer();

  const [isSelected, setIsSelected] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [creationTime, setCreationTime] = useState("");
  const [dirSize, setDirSize] = useState("0");
  const [dirType, setDirType] = useState("");

  const handlePathInfo = async () => {
    const pathInfo = await fs.promises.stat(dir.path).catch((e) => {
      return;
    });
    if (!pathInfo) return null;

    setCreationTime(formatDate(pathInfo.birthtimeMs));
    setDirSize(formatBytes(pathInfo.size));

    const mediaType = `video/${path.parse(dir.path).ext.slice(1)}`;
    setDirType(dir.dir ? "Folder" : videoType(mediaType));
  };

  useEffect(() => {
    handlePathInfo();
  }, []);

  useEffect(() => {
    setIsSelected(selectedDirs.map((d) => d?.path).includes(dir.path));
  }, [selectedDirs, dir]);

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

  const handleDirSelect = () => {
    if (keyPressed === "") {
      if (
        selectedDirs.length === 0 ||
        (selectedDirs.length === 1 && selectedDirs[0]?.path === dir?.path)
      ) {
        handleDirNavigate(dir);
      }
    } else if (keyPressed === "" && selectedDirs.length > 1) {
      resetSelections();
    }
  };

  return (
    <>
      <DirContextMenu
        selectedDirs={selectedDirs.length > 0 ? selectedDirs : [dir]}
      >
        <div
          onClick={handleDirSelect}
          className={`dir-card relative flex items-center justify-start px-3 gap-3 cursor-pointer ${
            isSelected ? "bg-[#ffffff21]" : "hover:bg-[#ffffff16]"
          } rounded-md py-2`}
        >
          {!dir.dir && (
            <HoverCard.Root>
              <HoverCard.Trigger>
                {/* <div
                        onMouseEnter={() => {
                          handleThumbnail();
                        }}
                        className="absolute top-0 left-0 w-full h-full z-10"
                      /> */}
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
                      {dir.name}
                    </h3>

                    <p className="text-[12px] mt-3">{creationTime}</p>
                    <p className="text-[12px]">{dirType}</p>
                    <p className="text-[12px]">{dirSize}</p>
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
      </DirContextMenu>
    </>
  );
};

export default DirCard;
