import { FC } from "react";
import Button from "./Button";
import { CheckIcon, PlaybackSpeedIcon } from "../../../assets";
import { usePlayerContext } from "../../../contexts";
import { DropdownMenu } from "@radix-ui/themes";
import { usePlayer } from "../../../hooks";
import { useAppSelector } from "../../../hooks";

const PlayBackSpeed: FC = () => {
  const { currentSpeed } = useAppSelector(state => state.player);
  const { handlePlaybackSpeedUpdate } = usePlayer();

  const SPEEDS = new Array(9).fill(0, 1, 9);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <div>
            <Button>
              <div className="absolute text-[22px] left-0 right-0 top-0 bottom-0 h-max w-max m-auto">
                <PlaybackSpeedIcon />
              </div>
            </Button>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {SPEEDS.map((_s, index) => {
            const speed = index * 0.25;
            return (
              <DropdownMenu.Item
                onSelect={(e) => {
                  e.preventDefault();
                  handlePlaybackSpeedUpdate(speed);
                }}
                key={`pb-speed-${index}`}
              >
                <div className="flex items-center">
                  <div className="text-[22px] w-[22px] h-[22px]">
                    {speed === currentSpeed && <CheckIcon />}
                  </div>
                  <p className="ml-3">{speed === 1 ? "Normal" : speed}</p>
                </div>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default PlayBackSpeed;
