import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isError: false,
    isPlaying: false,
    mediaData: {
        name: null,
        type: null,
        resolution: null,
        url: null,
        size: 0,
        creationTime: null,
        lastModified: null,
        lastAccessed: null,
    },
    currentSpeed: 1,
    isPiP: false,
    isLoading: false,
    videoSrc: null,
    videoIndex: null,
    isImporting: true,
    playlist: [] as any,
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
        updatePlaylist(state, action) {
            state.playlist = action.payload;
        },
        addMediaToPlaylist(state, action) {
            state.playlist = state.playlist.push(action.payload);
        },
        removeMediaFromPlaylist(state, action) {
            const index = action.payload;
            state.playlist = state.playlist.splice(index, 1);
        },
        updateVideoIndex(state, action) {
            if (action.payload < state.playlist.length && action.payload >= 0)
                state.videoIndex = action.payload;
            else console.error("Index out of bounds");
        },
        incrementVideoIndex(state) {
            if (state.videoIndex < state.playlist.length - 1)
                state.videoIndex++;
        },
        decrementVideoIndex(state) {
            if (state.videoIndex > 0)
                state.videoIndex--;
        },
        import(state) { 
            state.isImporting = true
        },
        imported(state) { 
            state.isImporting = false
        },
        reset() {
            return initialState;
        }
    },
})

export default playerSlice;