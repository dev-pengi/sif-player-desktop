import { createSlice } from "@reduxjs/toolkit";
import { extractLocalStorage, separateText } from "../../utils";

const os = window.require("os");
const path = window.require("path");

const initialState = {
    isLoadingFiles: true,
    currentDir: extractLocalStorage("last-dir", os.homedir(), "string"),
    currentDirData: null,
    dirs: [],
    dirsChain: [],
    isSearching: false,
    searchKeyword: '',
    copyFiles: [],
    cutFiles: [],
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
        searchDirs(state, action) {
            const keyword = action.payload
            state.searchKeyword = keyword;
            if (!keyword.trim().length) {
                state.isSearching = false
            } else {
                state.isSearching = true
                state.dirs = state.dirs.map((d) => {
                    let includeNormalName = d.name.toLowerCase().includes(keyword.toLowerCase());
                    let includeSeparatedName = separateText(d.name).toLowerCase().includes(keyword.toLowerCase());
                    let includeFlatName = separateText(d.name, '', [' ']).toLowerCase().includes(keyword.toLowerCase());
                    let includeFlatSeparatedName = separateText(d.name, '', ["-", "_", ".", ",", ' ']).toLowerCase().includes(keyword.toLowerCase());
                    let searchValid = includeNormalName || includeSeparatedName || includeFlatSeparatedName || includeFlatName

                    return { ...d, searchValid }
                })
            }
        },
        copyFiles(state, action) {
            state.copyFiles = action.payload;
            state.cutFiles = [];
        },
        cutFiles(state, action) {
            state.cutFiles = action.payload;
            state.copyFiles = [];
        },
        pasteFiles(state, action) {
            state.pastingProcess = [
                ...state.pastingProcess,
                ...action.payload
            ]
            state.copyFiles = [];
            state.cutFiles = [];
        },
        pasteEnd(state, action) {
            state.pastingProcess = state.pastingProcess.filter(path => {
                return !action.payload.includes(path)
            })
        },
        resetPasteProcess(state) {
            state.pastingProcess = []
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