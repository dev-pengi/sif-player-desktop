import { FC, useEffect, useState } from "react";
import { MenuIcon } from "../../assets";

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
      {!isInLastTwoDirs && isFirstDir && (
        <>
          <div
            key={index}
            onClick={() => onClick(dirName, index)}
            className="flex items-center text-[15px] rounded-md cursor-pointer hover:bg-[#ffffff21] px-2 py-1 duration-100"
          >
            {dirName}
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
      {isInLastTwoDirs && (
        <>
          <div
            key={index}
            onClick={() => onClick(dirName, index)}
            className="flex items-center text-[15px] rounded-md cursor-pointer hover:bg-[#ffffff21] px-2 py-1 duration-100"
            style={{}}
          >
            {dirName}
          </div>
          {!isLastDir && <span className="text-[15px] mx-1">{">"}</span>}
        </>
      )}
    </>
  );
};

const DirChain: FC<DirChainProps> = ({ dirsChain, onClick }) => {
  return (
    <div className="flex items-center flex-wrap ml-3 gap-0.5">
      {dirsChain.map((dirName, index) => (
        <DirItem
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
