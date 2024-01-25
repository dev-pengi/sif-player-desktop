import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BackIcon, CloseIcon, DashIcon, WindowMaximizeIcon } from "../assets";
import { useAppSelector, useClean, useRPC } from "../hooks";
import {
  FilesViewer,
  Separator,
  URLImporter,
  ExplorerSectionTab,
} from "../components";
import { explorerActions } from "../store";

const { ipcRenderer } = window.require("electron");

const tabs = [
  {
    name: "File Explorer",
    component: <FilesViewer />,
  },
  {
    name: "Import URL",
    component: <URLImporter />,
  },
];

const CurrentSection = ({ sectionsTabs, activeTab }) => {
  return sectionsTabs[activeTab].component;
};

const MainPage: FC = () => {
  const dispatch = useDispatch();
  const rpc = useRPC();

  useClean();

  const { allowRPC } = useAppSelector((state) => state.settings);
  const { searchKeyword, dirs } = useAppSelector((state) => state.explorer);

  const [activeTab, setActiveTab] = useState(0);

  const handleClose = () => {
    ipcRenderer.send("close");
  };
  const handleMaximizeToggle = () => {
    ipcRenderer.send("maximize");
  };
  const handleMinimize = () => {
    ipcRenderer.send("minimize");
  };

  useEffect(() => {
    if (allowRPC) {
      rpc.set(`Browsing Files`, `Home`);
    } else {
      rpc.clear();
    }
  }, [allowRPC]);

  return (
    <div className="h-screen">
      <nav
        className="flex w-full items-center h-[45px] fixed drag"
        style={{
          borderBottom: `1px solid #ffffff21`,
        }}
      >
        <div className="flex flex-1">
          <p className="ml-3 font-bold text-[13px] opacity-60 tracking-wide">
            Sif Player
          </p>
        </div>
        <div className="flex flex-row-reverse h-full items-center no-drag">
          <div
            onClick={handleClose}
            className="w-[45px] flex items-center justify-center h-full duration-100 text-[18px] hover:bg-danger"
          >
            <CloseIcon />
          </div>
          <div
            onClick={handleMaximizeToggle}
            className="w-[45px] flex items-center justify-center h-full duration-100 text-[14px] hover:bg-[#ffffff21]"
          >
            <WindowMaximizeIcon />
          </div>
          <div
            onClick={handleMinimize}
            className="w-[45px] flex items-center justify-center h-full duration-100  hover:bg-[#ffffff21]"
          >
            <DashIcon />
          </div>
        </div>
      </nav>
      <div className="flex w-full h-[calc(100%-45px)] fixed top-[45px]">
        <div
          className="min-w-[300px] max-w-[300px] h-full py-3 px-3"
          style={{
            borderRight: "1px solid #ffffff21",
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(explorerActions.back())}
              className="hover:bg-[#ffffff16] duration-100 flex items-center px-1.5 py-1.5 text-[20px] rounded-md"
            >
              <BackIcon />
            </button>
            <input
              type="text"
              className=" px-3 py-[5.5px] rounded-md bg-[#ffffff16] duration-100 text-[14px] w-[100%]"
              placeholder="Search"
              onChange={(e) =>
                dispatch(explorerActions.searchDirs(e.target.value))
              }
              onKeyDown={(e) => {
                const searchValidDirs = dirs.filter((dir) => dir.searchValid);
                if (e.key === "Enter") {
                  if (searchKeyword === "::back") {
                    dispatch(explorerActions.back());
                    dispatch(explorerActions.searchDirs(""));
                  } else {
                    if (searchValidDirs.length === 0) return;
                    searchValidDirs[0].dir &&
                      dispatch(
                        explorerActions.updateCurrentDir(
                          searchValidDirs[0].path
                        )
                      );
                  }
                }
              }}
              value={searchKeyword}
            />
          </div>
          <Separator separateBy={14} />
          <div className="flex flex-col items-start justify-start gap-2">
            <h3 className="text-[14px] font-bold ml-3 opacity-60 tracking-wide">
              Tabs
            </h3>
            {tabs.map((tab, index) => {
              return (
                <ExplorerSectionTab
                  key={tab.name}
                  name={tab.name}
                  isActive={activeTab === index}
                  onSelect={() => setActiveTab(index)}
                />
              );
            })}
          </div>
        </div>
        <CurrentSection activeTab={activeTab} sectionsTabs={tabs} />
      </div>
    </div>
  );
};

export default MainPage;
