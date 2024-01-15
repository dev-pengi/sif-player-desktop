import { FC } from "react";
import { Separator } from "./Settings";
import { useAppSelector } from "../../../hooks";
import moment from "moment";

const MediaInfo: FC = () => {
  const formatTime = (time) => {
    return moment(time).format("MMMM Do YYYY, h:mm:ss a");
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 bytes";

    const k = 1024;
    const sizes = ["", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
    );
  }

  const formatResolution = (resolution) => {
    const resolutions = [144, 240, 360, 480, 720, 1080, 1440, 2160];
    const types = ["SD", "HD", "FHD", "QHD", "UHD"];
    const closest = resolutions.reduce((prev, curr) => {
      return Math.abs(curr - resolution) < Math.abs(prev - resolution)
        ? curr
        : prev;
    });

    let resolutionType: string;
    switch (closest) {
      case 144:
      case 240:
      case 360:
        resolutionType = types[0]; // SD
        break;
      case 480:
      case 720:
        resolutionType = types[1]; // HD
        break;
      case 1080:
        resolutionType = types[2]; // FHD
        break;
      case 1440:
        resolutionType = types[3]; // QHD
        break;
      case 2160:
        resolutionType = types[4]; // UHD
        break;
      default:
        resolutionType = "SD";
    }

    return `${closest}p (${resolutionType})`;
  };

  const videoType = (type) => {
    switch (type) {
      case "video/mp4":
        return "MP4 Video";
      case "video/webm":
        return "WebM Video";
      case "video/ogg":
        return "Ogg Video";
      case "video/avi":
        return "AVI Video";
      case "video/mkv":
        return "MKV Video";
      case "video/flv":
        return "FLV Video";
      default:
        return "Unspecified Type";
    }
  };

  const { mediaData } = useAppSelector((state) => state.player);
  const mediaName = mediaData?.name ?? "Untitled Media";
  const mediaType = mediaData?.type ?? "Unspecified Type";
  const mediaSize = mediaData?.size ?? "Unspecified Size";
  const mediaResolution = mediaData?.resolution ?? "Unspecified Resolution";
  return (
    <>
      <div className="flex items-start py-2">
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
            {formatTime(mediaData.creationTime)}
          </p>
        </div>
      )}

      {mediaData?.lastModified && (
        <div className="flex items-center py-2">
          <h3 className="opacity-95">Modified:</h3>
          <p className="ml-6 opacity-80">
            {formatTime(mediaData.lastModified)}
          </p>
        </div>
      )}

      {mediaData?.lastAccessed && (
        <div className="flex items-center py-2">
          <h3 className="opacity-95">Accessed:</h3>
          <p className="ml-6 opacity-80">
            {formatTime(mediaData.lastAccessed)}
          </p>
        </div>
      )}
    </>
  );
};

export default MediaInfo;
