import { FC } from "react";
import { shortcuts } from "../../../constants";

const PlayerShortcutsGuide: FC = () => {
  const { player } = shortcuts;

  return (
    <>
      <div className="grid grid-flow-row grid-cols-2 gap-x-9 gap-y-4">
        {player.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between">
            <h3 className="text-[16px] font-medium text-gray-200 truncate">
              {shortcut.name}
            </h3>
            <div className="flex items-center gap-3 justify-end">
              {shortcut.keys.map((key, index2) => (
                <p
                  key={index2}
                  className={`flex items-center justify-center capitalize bg-[#ffffff21] w-max text-[14px] text-gray-300 rounded-[4px]`}
                  style={{
                    width: key.length >= 2 ? "64px" : "32px",
                    height: "32px",
                  }}
                >
                  {key}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PlayerShortcutsGuide;
