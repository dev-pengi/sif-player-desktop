import { createSlice } from "@reduxjs/toolkit";
import { extractLocalStorage } from "../../utils";
import { colors } from "../../constants";

const defaultSettings = {
    primaryColor: "#ff00fb",
    lockShortcuts: false,
    lockGestures: false,
    normalSkipStep: 10,
    doubleSkipStep: 30,
    volumeStep: 5,
    doubleVolumeStep: 20,
    isLoop: false,
    autoPlay: true,
    skipButtons: true,
    shortcutsEnabled: true,
    gesturesEnabled: true,
    saveTrack: true,
    saveAdjustments: true,
    playInBackground: true,
    playToggleClick: false,
    fullScreenOnDoubleClick: true,
    showHoverThumbnail: true,
    allowAnimations: true,
    borderShadows: true,
    darkLayer: false,
    darkLayerOpacity: 0.2,
    sleepMode: false,
    sleepModeDelay: 30, // in minutes
    sleepModeBehavior: "pause", // pause, quit video, close app, pc sleep, pc shutdown
    allowRPC: true,
    miniProgressBar: false,
}

const colorCheck = (color: string) => {
    return colors.includes(color);
}

const initialState = {
    primaryColor: extractLocalStorage("primary-color", "#ff00fb", "string", colorCheck),
    lockShortcuts: extractLocalStorage("lock-shortcuts", false, "boolean"),
    lockGestures: extractLocalStorage("lock-gestures", false, "boolean"),
    normalSkipStep: extractLocalStorage("skip-step", 10, "number"),
    doubleSkipStep: extractLocalStorage("double-skip-step", 30, "number"),
    volumeStep: extractLocalStorage("volume-step", 5, "number"),
    doubleVolumeStep: extractLocalStorage("double-volume-step", 20, "number"),
    isLoop: extractLocalStorage("is-loop", false, "boolean"),
    autoPlay: extractLocalStorage("auto-play", false, "boolean"),
    skipButtons: extractLocalStorage("skip-buttons", false, "boolean"),
    shortcutsEnabled: extractLocalStorage("shortcuts-enabled", true, "boolean"),
    gesturesEnabled: extractLocalStorage("gestures-enabled", true, "boolean"),
    saveTrack: extractLocalStorage("save-track", true, "boolean"),
    saveAdjustments: extractLocalStorage("save-adjustments", true, "boolean"),
    playInBackground: extractLocalStorage("play-in-background", true, "boolean"),
    playToggleClick: extractLocalStorage("play-toggle-click", false, "boolean"),
    fullScreenOnDoubleClick: extractLocalStorage("full-screen-on-double-click", true, "boolean"),
    showHoverThumbnail: extractLocalStorage("show-hover-thumbnail", true, "boolean"),
    allowAnimations: extractLocalStorage("allow-animations", true, "boolean"),
    borderShadows: extractLocalStorage("border-shadows", true, "boolean"),
    darkLayer: extractLocalStorage("dark-layer", false, "boolean"),
    darkLayerOpacity: extractLocalStorage("dark-layer-opacity", 0.2, "number"),
    sleepMode: extractLocalStorage("sleep-mode", false, "boolean"),
    sleepModeDelay: extractLocalStorage("sleep-mode-delay", 30, "number"),
    sleepModeBehavior: extractLocalStorage("sleep-mode-behavior", "pause", "string"),
    allowRPC: extractLocalStorage("allow-rpc", true, "boolean"),
    miniProgressBar: extractLocalStorage("mini-progress-bar", false, "boolean"),
}

const settingsSlice = createSlice({
    name: "settings",
    initialState: initialState,
    reducers: {
        updateColor(state, action) {
            localStorage.setItem("primary-color", action.payload);
            state.primaryColor = action.payload;
        },
        toggleLockShortcuts(state) {
            localStorage.setItem("lock-shortcuts", String(!state.lockShortcuts));
            state.lockShortcuts = !state.lockShortcuts
        },
        toggleLockGestures(state) {
            localStorage.setItem("lock-gestures", String(!state.lockGestures));
            state.lockGestures = !state.lockGestures
        },
        updateNormalSkipStep(state, action) {
            localStorage.setItem("skip-step", String(action.payload));
            state.normalSkipStep = action.payload
        },
        updateDoubleSkipStep(state, action) {
            localStorage.setItem("double-skip-step", String(action.payload));
            state.doubleSkipStep = action.payload
        },
        updateVolumeStep(state, action) {
            localStorage.setItem("volume-step", String(action.payload));
            state.volumeStep = action.payload
        },
        updateDoubleVolumeStep(state, action) {
            localStorage.setItem("double-volume-step", String(action.payload));
            state.doubleVolumeStep = action.payload
        },
        toggleLoop(state) {
            localStorage.setItem("is-loop", String(!state.isLoop));
            state.isLoop = !state.isLoop
        },
        toggleShortcuts(state) {
            localStorage.setItem("shortcuts-enabled", String(!state.shortcutsEnabled));
            state.shortcutsEnabled = !state.shortcutsEnabled
        },
        toggleGestures(state) {
            localStorage.setItem("gestures-enabled", String(!state.gesturesEnabled));
            state.gesturesEnabled = !state.gesturesEnabled
        },
        toggleSaveTrack(state) {
            localStorage.setItem("save-track", String(!state.saveTrack));
            state.saveTrack = !state.saveTrack
        },
        toggleSaveAdjustments(state) {
            localStorage.setItem("save-adjustments", String(!state.saveAdjustments));
            state.saveAdjustments = !state.saveAdjustments
        },
        togglePlayInBackground(state) {
            localStorage.setItem("play-in-background", String(!state.playInBackground));
            state.playInBackground = !state.playInBackground
        },
        togglePlayToggleClick(state) {
            localStorage.setItem("play-toggle-click", String(!state.playToggleClick));
            state.playToggleClick = !state.playToggleClick
        },
        toggleFullScreenOnDoubleClick(state) {
            localStorage.setItem("full-screen-on-double-click", String(!state.fullScreenOnDoubleClick));
            state.fullScreenOnDoubleClick = !state.fullScreenOnDoubleClick
        },
        toggleHoverThumbnail(state) {
            localStorage.setItem("show-hover-thumbnail", String(!state.showHoverThumbnail));
            state.showHoverThumbnail = !state.showHoverThumbnail
        },
        toggleAnimations(state) {
            localStorage.setItem("allow-animations", String(!state.allowAnimations));
            state.allowAnimations = !state.allowAnimations
        },
        toggleBorderShadows(state) {
            localStorage.setItem("border-shadows", String(!state.borderShadows));
            state.borderShadows = !state.borderShadows
        },
        toggleDarkLayer(state) {
            localStorage.setItem("dark-layer", String(!state.darkLayer));
            state.darkLayer = !state.darkLayer
        },
        updateDarkLayerOpacity(state, action) {
            localStorage.setItem("dark-layer-opacity", String(action.payload));
            state.darkLayerOpacity = action.payload
        },
        toggleSleepMode(state) {
            localStorage.setItem("sleep-mode", String(!state.sleepMode));
            state.sleepMode = !state.sleepMode
        },
        updateSleepModeDelay(state, action) {
            localStorage.setItem("sleep-mode-delay", String(action.payload));
            state.sleepModeDelay = action.payload
        },
        updateSleepModeBehavior(state, action) {
            localStorage.setItem("sleep-mode-behavior", action.payload);
            state.sleepModeBehavior = action.payload
        },
        toggleRPC(state) {
            localStorage.setItem("allow-rpc", String(!state.allowRPC));
            state.allowRPC = !state.allowRPC
        },
        toggleAutoPlay(state) {
            localStorage.setItem("auto-play", String(!state.autoPlay));
            state.autoPlay = !state.autoPlay
        },
        toggleSkipButtons(state) {
            localStorage.setItem("skip-buttons", String(!state.skipButtons));
            state.skipButtons = !state.skipButtons
        },
        toggleMiniProgressBar(state) {
            localStorage.setItem("mini-progress-bar", String(!state.miniProgressBar));
            state.miniProgressBar = !state.miniProgressBar
        },
        reset() {
            return initialState;
        },
        default() {
            localStorage.clear();
            return defaultSettings;
        }
    },
})

export default settingsSlice;