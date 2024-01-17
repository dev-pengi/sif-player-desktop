import { useAppSelector } from ".";

const { ipcRenderer } = window.require("electron");

const useRPC = () => {
  const { allowRPC } = useAppSelector((state) => state.settings);
  return {
    set: (state: string, details: string, filename?: string) => {
      if (!allowRPC) return;
      ipcRenderer.send("rpc", {
        state,
        details,
        filename,
      });
    },
    clear: () => {
      ipcRenderer.send("rpc-clear");
    },
  };
};

export default useRPC;
