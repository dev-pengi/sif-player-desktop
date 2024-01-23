import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LinkIcon } from "../../../assets";
import { useAppSelector } from "../../../hooks";
import { playerActions } from "../../../store";

const URLImporter: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { primaryColor } = useAppSelector((state) => state.settings);

  const [url, setUrl] = useState("");
  const [isInvalidUrl, setIsInvalidUrl] = useState(false);
  const handleUrlSubmit = (e: any) => {
    e.preventDefault();
    if (!url?.trim()?.length) return setIsInvalidUrl(true);
    dispatch(playerActions.updatePlaylist([url]));
    dispatch(playerActions.updateVideoIndex(0));
    navigate(`/player?type=url`);
  };
  return (
    <div className="w-full h-full flex items-center justify-center px-2">
      <div className="max-w-[800px] bg-[#0f0f0f] px-4 py-3 rounded-md flex flex-col items-center justify-center gap-4 w-full">
        <h1 className="font-semibold capitalize opacity-80">
          Play video by url
        </h1>

        <div className="relative w-full">
          <div className="text-[18px] absolute top-1/2 left-4 transform -translate-y-1/2">
            <LinkIcon />
          </div>
          <input
            onChange={(e) => {
              setIsInvalidUrl(false);
              setUrl(e.target.value);
            }}
            value={url}
            type="text"
            placeholder="Enter URL"
            id="media-url"
            className={`px-6 py-3 w-full pl-[46px] h-max bg-transparent rounded-md ${
              isInvalidUrl ? "border-red-400" : "border-neutral-600"
            } border-solid border-[1px]`}
          />
        </div>
        <div className="flex">
          <button
            onClick={handleUrlSubmit}
            style={{
              color: primaryColor,
            }}
            className="py-2 px-9 text-[14px] border-[2px] border-current bg-current hover:opacity-90 duration-200 border-solid rounded-[4px]"
          >
            <p className="text-white">Play Video</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default URLImporter;
