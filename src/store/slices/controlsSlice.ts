import { createSlice } from "@reduxjs/toolkit";
import { FC } from "react";

interface ActionToast {
    status: boolean,
    content: string | null
}

const initialState = {
    isFullscreen: false,
    isPanelHovering: false,
    isLocked: false,
    lastActivityTime: 0,
    controllersDeps: [
        'active'
    ],
    actionToast: {
        status: false,
        content: null
    } as ActionToast
}

const controlsSlice = createSlice({
    name: "controls",
    initialState: initialState,
    reducers: {
        fullscreen(state) {
            state.isFullscreen = true
        },
        unfullscreen(state) {
            state.isFullscreen = false
        },
        toggleFullscreen(state) {
            state.isFullscreen = !state.isFullscreen
        },
        panelHover(state) {
            state.isPanelHovering = true
        },
        panelUnhover(state) {
            state.isPanelHovering = false
        },
        togglePanelHover(state) {
            state.isPanelHovering = !state.isPanelHovering
        },
        lock(state) {
            state.isLocked = true
        },
        unlock(state) {
            state.isLocked = false
        },
        toggleLock(state) {
            state.isLocked = !state.isLocked
        },
        addControllerDependency(state, action) {
            if (!state.controllersDeps.includes(action.payload)) {
                state.controllersDeps.push(action.payload);
            }
        },
        removeControllerDependency(state, action) {
            if (state.controllersDeps.includes(action.payload)) {
                state.controllersDeps.splice(state.controllersDeps.indexOf(action.payload), 1);
            }
        },
        updateLastActivityTime(state) {
            const Time = Date.now()
            state.lastActivityTime = Time
        },
        fireActionToast(state, action) {
            if (!action.payload) {
                return
            }
            state.actionToast.status = true
            state.actionToast.content = action.payload
        },
        resetActionToast(state) {
            state.actionToast.status = false
            state.actionToast.content = null
        },
        reset(state) {
            return initialState;
        }
    },
})

export default controlsSlice;