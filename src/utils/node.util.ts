const electron = window.require(
    "@electron/remote"
) as typeof import("@electron/remote");
const path = window.require("path") as typeof import("path");
const fs = window.require("fs") as typeof import("fs");
const os = window.require("os") as typeof import("os");
const { ipcRenderer } = window.require("electron") as typeof import("electron");


export {
    electron,
    ipcRenderer,
    path,
    os,
    fs,
}