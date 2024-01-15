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
    sleepModeBehavior: "pause", // pause, quit video
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
}

const settingsSlice = createSlice({
    name: "settings",
    initialState: initialState,
    reducers: {
        updateColor(state, action) {
            localStorage.setItem("primary-color", action.payload);
            state.primaryColor = action.payload;
        },
        lockShortcuts(state) {
            localStorage.setItem("lock-shortcuts", "true");
            state.lockShortcuts = true
        },
        unlockShortcuts(state) {
            localStorage.setItem("lock-shortcuts", "false");
            state.lockShortcuts = false
        },
        toggleLockShortcuts(state) {
            localStorage.setItem("lock-shortcuts", String(!state.lockShortcuts));
            state.lockShortcuts = !state.lockShortcuts
        },
        lockGestures(state) {
            localStorage.setItem("lock-gestures", "true");
            state.lockGestures = true
        },
        unlockGestures(state) {
            localStorage.setItem("lock-gestures", "false");
            state.lockGestures = false
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
        enableLoop(state) {
            localStorage.setItem("is-loop", "true");
            state.isLoop = true
        },
        disableLoop(state) {
            localStorage.setItem("is-loop", "false");
            state.isLoop = false
        },
        toggleLoop(state) {
            localStorage.setItem("is-loop", String(!state.isLoop));
            state.isLoop = !state.isLoop
        },
        enableShortcuts(state) {
            localStorage.setItem("shortcuts-enabled", "true");
            state.shortcutsEnabled = true
        },
        disableShortcuts(state) {
            localStorage.setItem("shortcuts-enabled", "false");
            state.shortcutsEnabled = false
        },
        toggleShortcuts(state) {
            localStorage.setItem("shortcuts-enabled", String(!state.shortcutsEnabled));
            state.shortcutsEnabled = !state.shortcutsEnabled
        },
        enableGestures(state) {
            localStorage.setItem("gestures-enabled", "true");
            state.gesturesEnabled = true
        },
        disableGestures(state) {
            localStorage.setItem("gestures-enabled", "false");
            state.gesturesEnabled = false
        },
        toggleGestures(state) {
            localStorage.setItem("gestures-enabled", String(!state.gesturesEnabled));
            state.gesturesEnabled = !state.gesturesEnabled
        },
        enableSaveTrack(state) {
            localStorage.setItem("save-track", "true");
            state.saveTrack = true
        },
        disableSaveTrack(state) {
            localStorage.setItem("save-track", "false");
            state.saveTrack = false
        },
        toggleSaveTrack(state) {
            localStorage.setItem("save-track", String(!state.saveTrack));
            state.saveTrack = !state.saveTrack
        },
        enableSaveAdjustments(state) {
            localStorage.setItem("save-adjustments", "true");
            state.saveAdjustments = true
        },
        disableSaveAdjustments(state) {
            localStorage.setItem("save-adjustments", "false");
            state.saveAdjustments = false
        },
        toggleSaveAdjustments(state) {
            localStorage.setItem("save-adjustments", String(!state.saveAdjustments));
            state.saveAdjustments = !state.saveAdjustments
        },
        enablePlayInBackground(state) {
            localStorage.setItem("play-in-background", "true");
            state.playInBackground = true
        },
        disablePlayInBackground(state) {
            localStorage.setItem("play-in-background", "false");
            state.playInBackground = false
        },
        togglePlayInBackground(state) {
            localStorage.setItem("play-in-background", String(!state.playInBackground));
            state.playInBackground = !state.playInBackground
        },
        enablePlayToggleClick(state) {
            localStorage.setItem("play-toggle-click", "true");
            state.playToggleClick = true
        },
        disablePlayToggleClick(state) {
            localStorage.setItem("play-toggle-click", "false");
            state.playToggleClick = false
        },
        togglePlayToggleClick(state) {
            localStorage.setItem("play-toggle-click", String(!state.playToggleClick));
            state.playToggleClick = !state.playToggleClick
        },
        enableFullScreenOnDoubleClick(state) {
            localStorage.setItem("full-screen-on-double-click", "true");
            state.fullScreenOnDoubleClick = true
        },
        disableFullScreenOnDoubleClick(state) {
            localStorage.setItem("full-screen-on-double-click", "false");
            state.fullScreenOnDoubleClick = false
        },
        toggleFullScreenOnDoubleClick(state) {
            localStorage.setItem("full-screen-on-double-click", String(!state.fullScreenOnDoubleClick));
            state.fullScreenOnDoubleClick = !state.fullScreenOnDoubleClick
        },
        enableHoverThumbnail(state) {
            localStorage.setItem("show-hover-thumbnail", "true");
            state.showHoverThumbnail = true
        },
        disableHoverThumbnail(state) {
            localStorage.setItem("show-hover-thumbnail", "false");
            state.showHoverThumbnail = false
        },
        toggleHoverThumbnail(state) {
            localStorage.setItem("show-hover-thumbnail", String(!state.showHoverThumbnail));
            state.showHoverThumbnail = !state.showHoverThumbnail
        },
        enableAnimations(state) {
            localStorage.setItem("allow-animations", "true");
            state.allowAnimations = true
        },
        disableAnimations(state) {
            localStorage.setItem("allow-animations", "false");
            state.allowAnimations = false
        },
        toggleAnimations(state) {
            localStorage.setItem("allow-animations", String(!state.allowAnimations));
            state.allowAnimations = !state.allowAnimations
        },
        enableBorderShadows(state) {
            localStorage.setItem("border-shadows", "true");
            state.borderShadows = true
        },
        disableBorderShadows(state) {
            localStorage.setItem("border-shadows", "false");
            state.borderShadows = false
        },
        toggleBorderShadows(state) {
            localStorage.setItem("border-shadows", String(!state.borderShadows));
            state.borderShadows = !state.borderShadows
        },
        enableDarkLayer(state) {
            localStorage.setItem("dark-layer", "true");
            state.darkLayer = true
        },
        disableDarkLayer(state) {
            localStorage.setItem("dark-layer", "false");
            state.darkLayer = false
        },
        toggleDarkLayer(state) {
            localStorage.setItem("dark-layer", String(!state.darkLayer));
            state.darkLayer = !state.darkLayer
        },
        updateDarkLayerOpacity(state, action) {
            localStorage.setItem("dark-layer-opacity", String(action.payload));
            state.darkLayerOpacity = action.payload
        },
        enableSleepMode(state) {
            localStorage.setItem("sleep-mode", "true");
            state.sleepMode = true
        },
        disableSleepMode(state) {
            localStorage.setItem("sleep-mode", "false");
            state.sleepMode = false
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