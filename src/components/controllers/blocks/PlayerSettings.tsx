import { FC, useState } from "react";
import {
  Accessability,
  Advanced,
  Appearance,
  General,
  Preferences,
} from "./Settings/Sections";
import SettingSectionTab from "./Settings/SettingSectionTab";
import { Separator } from "./Settings";

interface Tab {
  title: string;
  section: JSX.Element;
  separate?: boolean;
}

const tabs: Tab[] = [
  {
    title: "General",
    section: <General />,
  },
  {
    title: "Preferences",
    section: <Preferences />,
  },
  {
    title: "Appearance",
    section: <Appearance />,
  },
  {
    title: "Accessibility",
    section: <Accessability />,
  },
  {
    title: "Advanced",
    section: <Advanced />,
    separate: true,
  },
];

const CurrentSection = ({ sectionsTabs, activeTab }) => {
  return sectionsTabs[activeTab].section;
};



const SettingsBlock: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex justify-start items-start md:flex-row flex-col">
      <div className="hidden md:flex flex-col gap-3 w-[300px] h-[55vh] overflow-auto hidden-track py-3 ml-2">
        {tabs.map((tab, index) => {
          return (
            <>
              {tab.separate && <Separator margins={false} />}
              <SettingSectionTab
                key={index}
                title={tab.title}
                isActive={activeTab === index}
                onSelect={() => setActiveTab(index)}
              />
            </>
          );
        })}
      </div>
      <div className="flex md:hidden items-center px-2 pb-2 min-scrollbar w-full overflow-auto">
        {tabs.map((tab, index) => {
          return (
            <>
              <SettingSectionTab
                key={index}
                title={tab.title}
                isActive={activeTab === index}
                onSelect={() => {
                  setActiveTab(index);
                }}
                vertical
              />
            </>
          );
        })}
      </div>
      <div className="md:hidden flex h-max w-full">
        <Separator margins={true} />
      </div>
      <div className="min-scrollbar px-4 md:ml-2 md:mt-0 mt-1 w-full h-[55vh] overflow-y-auto">
        <CurrentSection sectionsTabs={tabs} activeTab={activeTab} />
      </div>
    </div>
  );
};

export default SettingsBlock;
