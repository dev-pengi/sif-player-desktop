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

  const { playlist, videoIndex } = useAppSelector((state) => state.player);

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
        const url = playlist[videoIndex];
        if (!url) return;
        dispatch(playerActions.source(url));
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
      }
    };

    handleVideoSrc();
  }, [location.search, playlist, videoIndex]);
};

const Player: FC = () => {
  const { isError } = useAppSelector((state) => state.player);
  useVideoSrc();
  useEvents();
  useShortcuts();
  useErrors();

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-1 bg-black">
      {isError ? <PlayerError /> : <VideoPlayer />}
    </div>
  );
};

export default Player;
