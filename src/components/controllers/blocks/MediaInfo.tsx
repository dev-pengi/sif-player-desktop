import { FC } from "react";
import { Separator } from "./Settings";
import { useAppSelector } from "../../../hooks";
import moment from "moment";
import {
  formatBytes,
  formatDate,
  formatResolution,
  videoType,
} from "../../../utils";

const MediaInfo: FC = () => {
  const { mediaData } = useAppSelector((state) => state.player);
  const mediaName = mediaData?.name ?? "Untitled Media";
  const mediaType = mediaData?.type ?? "Unspecified Type";
  const mediaSize = mediaData?.size ?? "Unspecified Size";
  const mediaResolution = mediaData?.resolution ?? "Unspecified Resolution";
  return (
    <>
      <div className="flex items-start py-2" title={`Name: ${mediaName}`}>
        <h3 className="opacity-95">Name:</h3>
        <p className="ml-6 opacity-80 max-w-[90%] truncate">{mediaName}</p>
      </div>
      <div className="flex items-center py-2">
        <h3 className="opacity-95">Type:</h3>
        <p className="ml-6 opacity-80">
          {videoType(mediaType)} ({mediaType})
        </p>
      </div>
      <Separator />
      <div className="flex items-center py-2" title={`Path: ${mediaData?.url}`}>
        <h3 className="opacity-95">Path:</h3>
        <p className="ml-6 opacity-80 max-w-[90%] truncate">
          {mediaData?.url ?? "Unspecified Path"}
        </p>
      </div>
      <div className="flex items-center py-2">
        <h3 className="opacity-95">Size:</h3>
        <p className="ml-6 opacity-80">
          {formatBytes(mediaSize)} ({mediaSize} bytes)
        </p>
      </div>
      <div className="flex items-center py-2">
        <h3 className="opacity-95">Resolution:</h3>
        <p className="ml-6 opacity-80">{formatResolution(mediaResolution)}</p>
      </div>
      {(mediaData?.creationTime ||
        mediaData?.lastModified ||
        mediaData?.lastAccessed) && <Separator />}

      {mediaData?.creationTime && (
        <div className="flex items-center py-2">
          <h3 className="opacity-95">Created:</h3>
          <p className="ml-6 opacity-80">
            {formatDate(mediaData.creationTime)}
          </p>
        </div>
      )}

      {mediaData?.lastModified && (
        <div className="flex items-center py-2">
          <h3 className="opacity-95">Modified:</h3>
          <p className="ml-6 opacity-80">
            {formatDate(mediaData.lastModified)}
          </p>
        </div>
      )}

      {mediaData?.lastAccessed && (
        <div className="flex items-center py-2">
          <h3 className="opacity-95">Accessed:</h3>
          <p className="ml-6 opacity-80">
            {formatDate(mediaData.lastAccessed)}
          </p>
        </div>
      )}
    </>
  );
};

export default MediaInfo;
