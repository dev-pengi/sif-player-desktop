import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isError: false,
    videoSrc: null,
    isPlaying: false,
    mediaData: {
        name: null,
        type: null,
        resolution: null,
        url: null,
        size: 0,
    },
    currentSpeed: 1,
    isPiP: false,
    isLoading: false,
}

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        error(state) {
            state.isError = true
        },
        unerror(state) {
            state.isError = false
        },
        source(state, action) {
            state.videoSrc = action.payload
        },
        play(state) {
            state.isPlaying = true
        },
        pause(state) {
            state.isPlaying = false
        },
        toggle(state) {
            state.isPlaying = !state.isPlaying
        },
        updateData(state, action) {
            state.mediaData = action.payload
        },
        addData(state, action) {
            state.mediaData[action.payload.name] = action.payload.value
        },
        updateSpeed(state, action) {
            state.currentSpeed = action.payload
        },
        enterPiP(state) {
            state.isPiP = true
        },
        exitPiP(state) {
            state.isPiP = false
        },
        loading(state) {
            state.isLoading = true
        },
        loaded(state) {
            state.isLoading = false
        },
        reset(state) {
            return initialState;
        }
    },
})

export default playerSlice;