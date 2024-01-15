import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
  useRef,
  RefObject,
} from "react";

interface PlayerContextProps {
  videoRef: RefObject<HTMLVideoElement>;
  videoFile: any;
  setVideoFile: Dispatch<SetStateAction<any>>;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

const usePlayerContext = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      "usePlayerContext must be used within a PlayerContextProvider"
    );
  }
  return context;
};

interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContextProvider: FC<PlayerContextProviderProps> = ({
  children,
}) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const value = {
    videoRef,
    videoFile,
    setVideoFile,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export { PlayerContext, usePlayerContext, PlayerContextProvider };
