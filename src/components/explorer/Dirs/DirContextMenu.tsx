import { ContextMenu } from "@radix-ui/themes";
import { FC, ReactNode } from "react";
import { Dir } from "../../../types";
import SingleDirContextMenu from "./contextMenus/SingleDirContextMenu";
import MultiDirContextMenu from "./contextMenus/MultiDirContextMenu";
import { ActivityIndicator } from "../../spins";


interface DirContextMenuProps {
  selectedDirs: Dir[];
  children: ReactNode;
  loading?: boolean;
  innerMenu?: boolean;
  style?: any;
}
interface LoadingDirsContextMenuProps {
  children: ReactNode;
}

const LoadingDirsContextMenu: FC<LoadingDirsContextMenuProps> = ({
  children,
}) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content
        style={{
          minWidth: 220,
        }}
      >
        <div className="w-full h-full flex items-center justify-center mt-2">
          <ActivityIndicator />
        </div>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

const DirContextMenu: FC<DirContextMenuProps> = ({
  selectedDirs,
  children,
  innerMenu,
  loading,
}) => {
  switch (selectedDirs.length) {
    case 0:
      return <LoadingDirsContextMenu>{children}</LoadingDirsContextMenu>;
    case 1:
      const validDir = selectedDirs[0]?.path;
      return (
        validDir && (
          <SingleDirContextMenu dir={selectedDirs[0]} innerMenu={innerMenu}>
            {children}
          </SingleDirContextMenu>
        )
      );
    default:
      const validDirs =
        selectedDirs.length > 1 && selectedDirs.every((dir) => dir?.path);
      return (
        validDirs && (
          <MultiDirContextMenu selectedDirs={selectedDirs}>
            {children}
          </MultiDirContextMenu>
        )
      );
  }
};

export default DirContextMenu;
