import { DropdownMenu } from "@radix-ui/themes";
import { FC } from "react";
import { DownIcon } from "../../../../assets";

interface SettingSelectProps {
  value: string | number;
  list: any[];
  onSelect: (value: string | number) => void;
  width?: number;
  before?: string;
  after?: string;
}

const SettingSelect: FC<SettingSelectProps> = ({
  value,
  list,
  onSelect,
  width = 175,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div
          style={{
            maxWidth: width,
            minWidth: width,
          }}
          className="px-4 py-1.5 flex min-w-[200px] items-center justify-between rounded-md bg-[#ffffff16] hover:bg-[#ffffff24] duration-100 cursor-pointer"
        >
          <p>{value}</p>
          <div className="ml-2">
            <DownIcon />
          </div>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        style={{
          maxWidth: width,
          minWidth: width,
        }}
      >
        {list.map((listItem, index: number) => {
          return (
            <DropdownMenu.Item
              key={`${index}-${listItem.value}`}
              onSelect={() => onSelect(listItem.value)}
            >
              {listItem.label}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default SettingSelect;
