import { FC, useState } from "react";
import { FileIcon, FolderIcon } from "../../../assets";
import { ContextMenu, ContextMenuSeparator } from "@radix-ui/themes";
import { Modal } from "../../modals";
import { formatBytes, formatDate, videoType } from "../../../utils";
import { Separator } from "../..";

const { dialog } = window.require("@electron/remote");
const { shell } = window.require("electron");
const fs = window.require("fs");
const path = window.require("path");

interface DirCardProps {
  onClick: () => void;
  dir: {
    name: string;
    path: string;
    dir: boolean;
  };
  handleDelete: () => void;
}

const DirCard: FC<DirCardProps> = ({ onClick, dir, handleDelete }) => {
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  const pathInfo = fs.statSync(dir.path);

  const creationTime = pathInfo.birthtime;
  const lastModified = pathInfo.mtime;
  const lastAccessed = pathInfo.atime;
  const dirSize = pathInfo.size;

  const mediaType = `video/${path.parse(dir.path).ext.slice(1)}`;
  const dirType = dir.dir ? "Folder" : videoType(mediaType);
  const dirName = dir.name;

  const handleRevealInExplorer = () => {
    console.log(pathInfo.extname);
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

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div
            onClick={onClick}
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
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={onClick}>
            {dir.dir ? "Open Folder" : "Play Media"}
          </ContextMenu.Item>
          <ContextMenu.Item onSelect={handleRevealInExplorer}>
            Reveal in Explorer
          </ContextMenu.Item>
          <ContextMenuSeparator />
          <ContextMenu.Item onSelect={() => setIsPropertiesModalOpen(true)}>
            Properties
          </ContextMenu.Item>
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
            <p className="ml-6 opacity-80 max-w-[90%] truncate">{dirName}</p>
          </div>
          <div className="flex items-center py-2">
            <h3 className="opacity-95">Type:</h3>
            <p className="ml-6 opacity-80">{dirType}</p>
          </div>
          <Separator />
          <div className="flex items-center py-2" title={`Path: ${dir.path}`}>
            <h3 className="opacity-95">Path:</h3>
            <p className="ml-6 opacity-80 max-w-[90%] truncate">
              {dir.path ?? "Unspecified Path"}
            </p>
          </div>
          {!dir.dir && (
            <div className="flex items-center py-2">
              <h3 className="opacity-95">Size:</h3>
              <p className="ml-6 opacity-80">
                {formatBytes(dirSize)} ({dirSize} bytes)
              </p>
            </div>
          )}
          <Separator />

          <div className="flex items-center py-2">
            <h3 className="opacity-95">Created:</h3>
            <p className="ml-6 opacity-80">{formatDate(creationTime)}</p>
          </div>

          <div className="flex items-center py-2">
            <h3 className="opacity-95">Modified:</h3>
            <p className="ml-6 opacity-80">{formatDate(lastModified)}</p>
          </div>

          <div className="flex items-center py-2">
            <h3 className="opacity-95">Accessed:</h3>
            <p className="ml-6 opacity-80">{formatDate(lastAccessed)}</p>
          </div>
        </>
      </Modal>
    </>
  );
};

export default DirCard;
