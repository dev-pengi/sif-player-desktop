import { createSlice } from "@reduxjs/toolkit";
import { extractLocalStorage, separateText } from "../../utils";

const os = window.require("os");
const path = window.require("path");

const initialState = {
    isLoadingFiles: true,
    currentDir: extractLocalStorage("last-dir", os.homedir(), "string"),
    dirs: [],
    dirsChain: [],
    isSearching: false,
    searchKeyword: ''
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
            localStorage.setItem("last-dir", action.payload);
            state.isSearching = false
            state.searchKeyword = '';
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
                    let includePath = d.path.toLowerCase().includes(keyword.toLowerCase());
                    let includeName = d.name.toLowerCase().includes(keyword.toLowerCase());
                    let includeSeparatedName = separateText(d.name.toLowerCase()).includes(keyword.toLowerCase());
                    let searchValid = includePath || includeName || includeSeparatedName

                    return { ...d, searchValid }
                })
            }
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