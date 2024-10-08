import { FC } from "react";
import { HomeIcon, MenuIcon } from "../../../assets";

interface DirChainProps {
  dirsChain: string[];
  onClick: (dir: string, index: number) => void;
}

interface DirItemProps {
  dirName: string;
  dirsChain: string[];
  onClick: (dir: string, index: number) => void;
  index: number;
}

const DirItem: FC<DirItemProps> = ({ dirName, dirsChain, onClick, index }) => {
  const hasMoreThanThreeDirs = dirsChain.length > 3;
  const isInLastTwoDirs = index >= dirsChain.length - 2;
  const isFirstDir = index === 0;
  const isSecondDir = index === 1;
  const isLastDir = index === dirsChain.length - 1;

  return (
    <>
      {isFirstDir && (
        <>
          <div
            key={index}
            onClick={() => onClick(dirName, index)}
            className="flex items-center text-[22px] rounded-md cursor-pointer hover:bg-[#ffffff21] px-2 py-1 duration-100"
          >
            <HomeIcon />
          </div>
          {!isLastDir && <span className="text-[15px] mx-1">{">"}</span>}
        </>
      )}
      {hasMoreThanThreeDirs && !isFirstDir && isSecondDir && (
        <>
          <div
            key={index}
            onClick={() => onClick(dirName, dirsChain.length - 3)}
            className="flex items-center text-[15px] rounded-md cursor-pointer hover:bg-[#ffffff21] px-2 py-2 duration-100"
          >
            <MenuIcon />
          </div>
          <span className="text-[15px] mx-1">{">"}</span>
        </>
      )}
      {isInLastTwoDirs && !isFirstDir && (
        <>
          <div
            key={index}
            onClick={() => onClick(dirName, index)}
            className="flex items-center text-[15px] rounded-md cursor-pointer hover:bg-[#ffffff21] px-2 py-1 duration-100"
            title={dirName}
          >
            <p className="max-w-[200px] truncate">{dirName}</p>
          </div>
          {!isLastDir && <span className="text-[15px] mx-1">{">"}</span>}
        </>
      )}
    </>
  );
};

const DirChain: FC<DirChainProps> = ({ dirsChain, onClick }) => {
  return (
    <div className="flex items-center flex-wrap gap-0.5">
      {dirsChain.map((dirName, index) => (
        <DirItem
          key={index}
          dirName={dirName}
          dirsChain={dirsChain}
          onClick={onClick}
          index={index}
        />
      ))}
    </div>
  );
};

export default DirChain;
