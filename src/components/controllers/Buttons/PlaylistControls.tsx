import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Popover } from "@radix-ui/themes";
import Button from "./Button";
import { playerActions } from "../../../store";
import { NextIcon, PlayListIcon, PreviousIcon } from "../../../assets";
import { useAppSelector, usePlayer } from "../../../hooks";
import { ActivityIndicator } from "../../spins";
import { formatBytes, formatDate } from "../../../utils";
import thumbnailPlaceholder from "../../../static/thumbnail-placeholder.png";

import { path, fs, electron } from "../../../utils/node.util";

const { nativeImage } = electron;

const ControlsHolder = ({ dependencyName }) => {
  const {
    handleAddControllerDependencies,
    handleRemoveControllerDependencies,
  } = usePlayer();
  useEffect(() => {
    handleAddControllerDependencies(dependencyName);
    return () => {
      handleRemoveControllerDependencies(dependencyName);
    };
  }, []);

  return null;
};

const PlaylistControls: FC = () => {
  const dispatch = useDispatch();
  const { playlist, videoIndex } = useAppSelector((state) => state.player);
  const { skipButtons } = useAppSelector((state) => state.settings);
  const [playlistInfo, setPlaylistInfo] = useState(null);

  const handlePlaylistInfo = async () => {
    setPlaylistInfo(null);
    const items = [];
    for (const item of playlist) {
      const stats = await fs.promises.stat(item);
      let thumbnail = null;
      try {
        const img = await nativeImage.createThumbnailFromPath(item, {
          width: 128,
          height: 128,
        });
        const buffer = img.toPNG();
        const blob = new Blob([buffer], { type: "image/png" });
        thumbnail = URL.createObjectURL(blob);
      } catch (err) {
        thumbnail = null;
      }
      const videoType = `video/${path.parse(item).ext.slice(1)}`;
      const info = {
        path: item,
        name: path.basename(item),
        size: formatBytes(stats.size),
        type: formatBytes(videoType),
        creationTime: formatDate(stats.birthtimeMs),
        thumbnail,
      };
      items.push(info);
    }
    setPlaylistInfo(items);
  };

  useEffect(() => {
    playlist.length > 1 && handlePlaylistInfo();
  }, [playlist]);

  return (
    <>
      {playlist.length > 1 && (
        <>
          {skipButtons && (
            <Button
              onClick={() => {
                dispatch(playerActions.decrementVideoIndex());
              }}
              disabled={videoIndex === 0}
            >
              <div className="absolute text-[16px] left-0 right-0 top-0 bottom-0 h-max w-max m-auto">
                <PreviousIcon />
              </div>
            </Button>
          )}
          <Popover.Root>
            <Popover.Trigger>
              <div>
                <Button>
                  <div className="absolute text-[25px] left-0 right-0 top-0 bottom-0 h-max w-max m-auto">
                    <PlayListIcon />
                  </div>
                </Button>
              </div>
            </Popover.Trigger>
            <Popover.Content>
              <div className="overflow-auto p-2 w-full min-scrollbar max-h-[min(85vh,500px)] max-w-[min(85vw,600px)] flex flex-col gap-1">
                {playlistInfo !== null ? (
                  playlistInfo.map((item, index: number) => (
                    <div
                      key={index}
                      onClick={() =>
                        dispatch(playerActions.updateVideoIndex(index))
                      }
                      className={`p-3 text flex items-start gap-3 duration-100 ${
                        index === videoIndex
                          ? "bg-[#ffffff18]"
                          : "hover:bg-[#ffffff16]"
                      } rounded-md cursor-pointer`}
                    >
                      <div className="bg-[#ffffff21] min-w-[120px] min-h-[70px] max-w-[120px] max-h-[70px] rounded-md ">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            className="min-w-[120px] min-h-[70px] max-w-[120px] max-h-[70px] rounded-md object-cover"
                          />
                        ) : (
                          <img
                            src={thumbnailPlaceholder}
                            className="opacity-70 min-w-[120px] min-h-[70px] max-w-[120px] max-h-[70px] rounded-md object-cover"
                          />
                        )}
                      </div>
                      <div className="max-w-[calc(100%-180px)]">
                        <h3
                          title={item.name}
                          className="text-[14px] w-full break-words font-bold opacity-80 line-clamp-1"
                        >
                          {item.name}
                        </h3>

                        <p className="text-[12px] mt-1">{item.creationTime}</p>
                        <p className="text-[12px]">{item.size}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <ActivityIndicator />
                  </div>
                )}
                <ControlsHolder dependencyName={"playlist-controls"} />
              </div>
            </Popover.Content>
          </Popover.Root>

          {skipButtons && (
            <Button
              onClick={() => {
                dispatch(playerActions.incrementVideoIndex());
              }}
              disabled={videoIndex >= playlist.length - 1}
            >
              <div className="absolute text-[16px] left-0 right-0 top-0 bottom-0 h-max w-max m-auto">
                <NextIcon />
              </div>
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default PlaylistControls;
