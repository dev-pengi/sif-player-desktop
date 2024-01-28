import { createSlice } from "@reduxjs/toolkit";
import { extractLocalStorage } from "../../utils";
import Fuse, { IFuseOptions } from 'fuse.js'
import { Dir } from "../../types";


const os = window.require("os") as typeof import('os');
const path = window.require("path") as typeof import('path');

const initialState = {
    isLoadingFiles: true,
    currentDir: extractLocalStorage("last-dir", os.homedir(), "string"),
    currentDirData: null,
    keyPressed: '',
    selectedDirs: [],
    dirs: [] as Dir[],
    dirsChain: [],
    isSearching: false,
    searchKeyword: '',
    copyFiles: [],
    pastingProcess: [],
}

const explorerSlice = createSlice({
    name: "explorer",
    initialState: initialState,
    reducers: {
        loading(state) {
            state.isLoadingFiles = true;
        },
        loaded(state) {
            state.isLoadingFiles = false;
        },
        updateCurrentDir(state, action) {
            state.currentDir = action.payload;
            state.currentDirData = null;
            localStorage.setItem("last-dir", action.payload);
            state.isSearching = false;
            state.searchKeyword = '';
        },
        updateCurrentDirData(state, action) {
            state.currentDirData = action.payload;
        },
        updateDirsChain(state, action) {
            state.dirsChain = action.payload;
        },
        updateDirs(state, action) {
            state.dirs = action.payload;
        },
        removeDir(state, action) {
            state.dirs = state.dirs.filter((d) => d.path !== action.payload);
        },
        addDir(state, action) {
            const newDirs = [...state.dirs, action.payload];
        },
        searchDirs(state, action) {
            const keyword = action.payload
            state.searchKeyword = keyword;
            if (!keyword.trim().length) {
                state.isSearching = false
            } else {
                let options: IFuseOptions<any> = {
                    shouldSort: true,
                    threshold: 0.30,
                    location: 0,
                    distance: 100,
                    minMatchCharLength: 1,
                    keys: [
                        "name"
                    ]
                };

                state.isSearching = true;

                let fuse = new Fuse(state.dirs, options);

                let result = fuse.search(keyword);

                let matchedPaths = new Set(result.map(dir => dir.item.path));

                state.dirs = state.dirs.map((d, i) => {
                    let searchValid = matchedPaths.has(d.path);
                    return { ...d, searchValid };
                });
            }
        },
        copyFiles(state, action) {
            state.copyFiles = action.payload;
        },
        resetCopyFiles(state) {
            state.copyFiles = [];
        },
        pasteFiles(state, action) {
            state.pastingProcess = [
                ...action.payload
            ]
        },
        pasteEnd(state, action) {
            state.pastingProcess = state.pastingProcess.filter(path => {
                return !action.payload.includes(path)
            })
        },
        resetPasteProcess(state) {
            state.pastingProcess = []
        },
        updateKeyPress(state, action) {
            state.keyPressed = action.payload;
        },
        updateSelectedDirs(state, action) {
            state.selectedDirs = action.payload
        },
        resetSelectedDirs(state) {
            state.selectedDirs = initialState.selectedDirs;
        },
        back(state) {
            const baseDir = path.dirname(state.currentDir);
            state.currentDir = baseDir;
            localStorage.setItem("last-dir", baseDir);
        },
        reset() {
            return initialState;
        }
    },
})

export default explorerSlice;