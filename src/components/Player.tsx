import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PlayerError } from "./errors";
import { VideoPlayer } from "./players";
import {
  useErrors,
  useEvents,
  usePlayer,
  useShortcuts,
  useStore,
  useTimer,
  useVolume,
} from "../hooks";
import { useDispatch } from "react-redux";
import { playerActions } from "../store";
import { useAppSelector } from "../hooks";
const fs = window.require("fs");
const path = window.require("path");

const useVideoSrc = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleVideoSrc = async () => {
      const queryParams = new URLSearchParams(location.search);
      const src = queryParams.get("src");
      const playType = queryParams.get("type");

      const { protocol, host } = window.location;
      if (playType === "local") {
        const blobUrl = `blob:${protocol}//${host}/${src}`;
        dispatch(playerActions.source(blobUrl));
      } else if (playType === "url") {
        dispatch(playerActions.source(src));
        const url = src;
        const controller = new AbortController();
        const signal = controller.signal;

        const mediaData = await fetch(src, { signal });
        const name = mediaData.headers
          .get("Content-Disposition")
          .split(";")[1]
          .trim()
          .split("=")[1]
          .replace(/"/g, "");
        const size = mediaData.headers.get("content-length");
        const type = mediaData.headers.get("content-type");

        dispatch(playerActions.updateData({ name, url, size, type }));
        controller.abort();
      } else if (playType === "file") {
        const url = src;
        const file = path.parse(url);
        const stats = await fs.promises.stat(url);
        const size = stats.size;
        const type = `video/${file.ext.slice(1)}`;
        const name = file.name;
        const creationTime = stats.birthtimeMs;
        const lastModified = stats.mtimeMs;
        const lastAccessed = stats.atimeMs;

        dispatch(
          playerActions.updateData({
            name,
            url,
            size,
            type,
            creationTime,
            lastModified,
            lastAccessed,
          })
        );
        dispatch(playerActions.source(url));
      }
    };

    handleVideoSrc();
  }, []);
};

const Player: FC = () => {
  const { saveTrack, saveAdjustments } = useAppSelector(
    (state) => state.settings
  );
  const { handleSeek } = useTimer();
  const { handleVolumeChange } = useVolume();
  const { handlePlaybackSpeedUpdate } = usePlayer();
  const { mediaData, isError } = useAppSelector((state) => state.player);
  const { duration } = useAppSelector((state) => state.timer);
  useVideoSrc();
  useEvents();
  useShortcuts();
  useErrors();

  const { handleFetchData } = useStore();

  useEffect(() => {
    const data = handleFetchData();
    if (data) {
      const { time, volume, muted, speed } = data;
      if (time && !isNaN(time) && saveTrack) handleSeek(Math.round(time));
      if (saveAdjustments) {
        if (volume && !isNaN(volume)) {
          handleVolumeChange(volume);
          if (muted) handleVolumeChange(0);
        }
        if (speed && !isNaN(speed)) handlePlaybackSpeedUpdate(speed);
      }
    }
  }, [mediaData?.name, mediaData?.url, duration]);

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-1 bg-black">
      {isError ? <PlayerError /> : <VideoPlayer />}
    </div>
  );
};

export default Player;
